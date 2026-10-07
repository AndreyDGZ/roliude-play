const fs = require('fs');

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) {
    console.error('Usage: node ua-tour-analyze.js <input.json> <output.json>');
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const nodes = raw.nodes || [];
  const edges = raw.edges || [];
  const layers = raw.layers || [];

  const nodeById = new Map();
  for (const node of nodes) nodeById.set(node.id, node);

  const fanIn = new Map();
  const fanOut = new Map();
  for (const node of nodes) {
    fanIn.set(node.id, 0);
    fanOut.set(node.id, 0);
  }
  for (const edge of edges) {
    if (fanOut.has(edge.source)) fanOut.set(edge.source, fanOut.get(edge.source) + 1);
    if (fanIn.has(edge.target)) fanIn.set(edge.target, fanIn.get(edge.target) + 1);
  }

  const fanInRanking = [...fanIn.entries()]
    .map(([id, count]) => ({ id, fanIn: count, name: nodeById.get(id)?.name }))
    .sort((a, b) => b.fanIn - a.fanIn)
    .slice(0, 20);

  const fanOutRanking = [...fanOut.entries()]
    .map(([id, count]) => ({ id, fanOut: count, name: nodeById.get(id)?.name }))
    .sort((a, b) => b.fanOut - a.fanOut)
    .slice(0, 20);

  const fanOutValues = [...fanOut.values()].sort((a, b) => a - b);
  const fanInValues = [...fanIn.values()].sort((a, b) => a - b);
  function percentileThreshold(sorted, pct) {
    const idx = Math.floor(sorted.length * pct);
    return sorted[Math.min(idx, sorted.length - 1)];
  }
  const fanOutTop10Threshold = percentileThreshold(fanOutValues, 0.9);
  const fanInBottom25Threshold = percentileThreshold(fanInValues, 0.25);

  const entryFilenames = new Set([
    'index.ts', 'index.js', 'main.ts', 'main.js', 'app.ts', 'app.js', 'server.ts', 'server.js',
    'mod.rs', 'main.go', 'main.py', 'main.rs', 'manage.py', 'app.py', 'wsgi.py', 'asgi.py', 'run.py',
    '__main__.py', 'Application.java', 'Main.java', 'Program.cs', 'config.ru', 'index.php',
    'App.swift', 'Application.kt', 'main.cpp', 'main.c'
  ]);

  function pathDepth(filePath) {
    if (!filePath) return 99;
    const normalized = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
    return normalized.split('/').length - 1;
  }

  const entryCandidates = [];
  for (const node of nodes) {
    let score = 0;
    const fp = node.filePath || '';
    const name = node.name || '';
    const depth = pathDepth(fp);

    if (node.type === 'document') {
      const isRoot = depth === 0;
      if (name.toLowerCase() === 'readme.md' && isRoot) {
        score += 5;
      } else if (name.toLowerCase().endsWith('.md') && isRoot) {
        score += 2;
      }
    } else {
      if (entryFilenames.has(name)) score += 3;
      if (depth <= 1) score += 1;
      if ((fanOut.get(node.id) || 0) >= fanOutTop10Threshold && fanOutTop10Threshold > 0) score += 1;
      if ((fanIn.get(node.id) || 0) <= fanInBottom25Threshold) score += 1;
    }

    if (score > 0) {
      entryCandidates.push({ id: node.id, score, name: node.name, summary: node.summary });
    }
  }
  entryCandidates.sort((a, b) => b.score - a.score);
  const entryPointCandidates = entryCandidates.slice(0, 5);

  const topCodeEntry = entryCandidates.find(c => nodeById.get(c.id)?.type !== 'document');

  const adjacency = new Map();
  for (const node of nodes) adjacency.set(node.id, []);
  for (const edge of edges) {
    if (edge.type === 'imports' || edge.type === 'calls') {
      if (adjacency.has(edge.source)) adjacency.get(edge.source).push(edge.target);
    }
  }

  let bfsTraversal = { startNode: null, order: [], depthMap: {}, byDepth: {} };
  if (topCodeEntry) {
    const startNode = topCodeEntry.id;
    const visited = new Set([startNode]);
    const order = [startNode];
    const depthMap = { [startNode]: 0 };
    const queue = [startNode];
    while (queue.length) {
      const current = queue.shift();
      const currentDepth = depthMap[current];
      const neighbors = adjacency.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && nodeById.has(neighbor)) {
          visited.add(neighbor);
          depthMap[neighbor] = currentDepth + 1;
          order.push(neighbor);
          queue.push(neighbor);
        }
      }
    }
    const byDepth = {};
    for (const [id, depth] of Object.entries(depthMap)) {
      if (!byDepth[depth]) byDepth[depth] = [];
      byDepth[depth].push(id);
    }
    bfsTraversal = { startNode, order, depthMap, byDepth };
  }

  const nonCodeFiles = { documentation: [], infrastructure: [], data: [], config: [] };
  for (const node of nodes) {
    const entry = { id: node.id, name: node.name, type: node.type, summary: node.summary };
    if (node.type === 'document') nonCodeFiles.documentation.push(entry);
    else if (['service', 'pipeline', 'resource'].includes(node.type)) nonCodeFiles.infrastructure.push(entry);
    else if (['table', 'schema', 'endpoint'].includes(node.type)) nonCodeFiles.data.push(entry);
    else if (node.type === 'config') nonCodeFiles.config.push(entry);
  }

  const undirectedPairs = new Map();
  for (const edge of edges) {
    if (edge.type !== 'imports' && edge.type !== 'calls') continue;
    const key = [edge.source, edge.target].sort().join('|||');
    if (!undirectedPairs.has(key)) undirectedPairs.set(key, new Set());
    undirectedPairs.get(key).add(edge.type + ':' + edge.source + '->' + edge.target);
  }

  const reciprocalPairs = [];
  const seenDirected = new Set();
  for (const edge of edges) {
    if (edge.type !== 'imports' && edge.type !== 'calls') continue;
    seenDirected.add(edge.type + ':' + edge.source + '->' + edge.target);
  }
  for (const edge of edges) {
    if (edge.type !== 'imports' && edge.type !== 'calls') continue;
    const reverseKey = edge.type + ':' + edge.target + '->' + edge.source;
    if (seenDirected.has(reverseKey) && edge.source !== edge.target) {
      const pairKey = [edge.source, edge.target].sort().join('|||');
      reciprocalPairs.push(pairKey);
    }
  }
  const uniqueReciprocal = [...new Set(reciprocalPairs)];

  function edgeCountBetween(nodeIds) {
    const idSet = new Set(nodeIds);
    let count = 0;
    for (const edge of edges) {
      if (idSet.has(edge.source) && idSet.has(edge.target)) count++;
    }
    return count;
  }

  const clusters = [];
  const usedInCluster = new Set();
  for (const pairKey of uniqueReciprocal) {
    const [a, b] = pairKey.split('|||');
    if (usedInCluster.has(a) || usedInCluster.has(b)) continue;
    const clusterSet = new Set([a, b]);

    let expanded = true;
    while (expanded && clusterSet.size < 5) {
      expanded = false;
      for (const node of nodes) {
        if (clusterSet.has(node.id)) continue;
        let connections = 0;
        for (const edge of edges) {
          if (edge.source === node.id && clusterSet.has(edge.target)) connections++;
          if (edge.target === node.id && clusterSet.has(edge.source)) connections++;
        }
        if (connections >= 2) {
          clusterSet.add(node.id);
          expanded = true;
          if (clusterSet.size >= 5) break;
        }
      }
    }

    const clusterNodes = [...clusterSet];
    for (const id of clusterNodes) usedInCluster.add(id);
    clusters.push({ nodes: clusterNodes, edgeCount: edgeCountBetween(clusterNodes) });
  }
  clusters.sort((a, b) => b.edgeCount - a.edgeCount);
  const topClusters = clusters.slice(0, 10);

  const nodeSummaryIndex = {};
  for (const node of nodes) {
    nodeSummaryIndex[node.id] = { name: node.name, type: node.type, summary: node.summary };
  }

  const result = {
    scriptCompleted: true,
    entryPointCandidates,
    fanInRanking,
    fanOutRanking,
    bfsTraversal,
    nonCodeFiles,
    clusters: topClusters,
    layers: { count: layers.length, list: layers },
    nodeSummaryIndex,
    totalNodes: nodes.length,
    totalEdges: edges.length
  };

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  process.exit(0);
}

try {
  main();
} catch (err) {
  console.error(err.stack || String(err));
  process.exit(1);
}
