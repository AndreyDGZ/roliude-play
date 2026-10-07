const fs = require('fs');

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const fileNodes = input.fileNodes || [];
  const importEdges = input.importEdges || [];
  const allEdges = input.allEdges || [];

  const nodeById = new Map();
  for (const node of fileNodes) nodeById.set(node.id, node);

  const paths = fileNodes.map((node) => node.filePath || '').filter(Boolean);
  function commonPrefix(list) {
    if (list.length === 0) return '';
    let prefix = list[0];
    for (const path of list) {
      let index = 0;
      while (index < prefix.length && index < path.length && prefix[index] === path[index]) index++;
      prefix = prefix.slice(0, index);
    }
    const lastSlash = prefix.lastIndexOf('/');
    return lastSlash >= 0 ? prefix.slice(0, lastSlash + 1) : '';
  }
  const prefix = commonPrefix(paths);

  function topGroup(filePath) {
    let rest = filePath;
    if (prefix && rest.startsWith(prefix)) rest = rest.slice(prefix.length);
    const parts = rest.split('/');
    if (parts.length > 1) return parts[0];
    const name = parts[0];
    const extMatch = name.match(/\.test\.|\.spec\./);
    if (extMatch) return 'test';
    const dotIndex = name.lastIndexOf('.');
    if (dotIndex > 0) return name.slice(dotIndex + 1) + '-files';
    return 'root';
  }

  const directoryGroups = {};
  for (const node of fileNodes) {
    const group = topGroup(node.filePath || node.name || 'root');
    if (!directoryGroups[group]) directoryGroups[group] = [];
    directoryGroups[group].push(node.id);
  }

  const nodeTypeGroups = {};
  for (const node of fileNodes) {
    const type = node.type || 'file';
    if (!nodeTypeGroups[type]) nodeTypeGroups[type] = [];
    nodeTypeGroups[type].push(node.id);
  }

  const fileFanOut = {};
  const fileFanIn = {};
  const adjacency = new Map();
  for (const edge of importEdges) {
    fileFanOut[edge.source] = (fileFanOut[edge.source] || 0) + 1;
    fileFanIn[edge.target] = (fileFanIn[edge.target] || 0) + 1;
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, new Set());
    adjacency.get(edge.source).add(edge.target);
  }

  function groupOf(id) {
    for (const [group, ids] of Object.entries(directoryGroups)) {
      if (ids.includes(id)) return group;
    }
    return null;
  }

  const idToGroup = new Map();
  for (const [group, ids] of Object.entries(directoryGroups)) {
    for (const id of ids) idToGroup.set(id, group);
  }

  const interGroupCounts = {};
  const intraGroupStats = {};
  for (const group of Object.keys(directoryGroups)) {
    intraGroupStats[group] = { internalEdges: 0, totalEdges: 0 };
  }

  for (const edge of importEdges) {
    const sourceGroup = idToGroup.get(edge.source);
    const targetGroup = idToGroup.get(edge.target);
    if (!sourceGroup || !targetGroup) continue;
    if (sourceGroup === targetGroup) {
      intraGroupStats[sourceGroup].internalEdges++;
      intraGroupStats[sourceGroup].totalEdges++;
    } else {
      const key = sourceGroup + '->' + targetGroup;
      interGroupCounts[key] = (interGroupCounts[key] || 0) + 1;
      intraGroupStats[sourceGroup].totalEdges++;
      intraGroupStats[targetGroup].totalEdges++;
    }
  }

  const interGroupImports = Object.entries(interGroupCounts).map(([key, count]) => {
    const [from, to] = key.split('->');
    return { from, to, count };
  });

  const intraGroupDensity = {};
  for (const [group, stats] of Object.entries(intraGroupStats)) {
    const density = stats.totalEdges > 0 ? stats.internalEdges / stats.totalEdges : 0;
    intraGroupDensity[group] = { internalEdges: stats.internalEdges, totalEdges: stats.totalEdges, density };
  }

  const crossCategoryMap = {};
  for (const edge of allEdges) {
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    if (!sourceNode || !targetNode) continue;
    if (sourceNode.type === targetNode.type && edge.type === 'imports') continue;
    const key = sourceNode.type + '->' + targetNode.type + '->' + edge.type;
    crossCategoryMap[key] = (crossCategoryMap[key] || 0) + 1;
  }
  const crossCategoryEdges = Object.entries(crossCategoryMap).map(([key, count]) => {
    const [fromType, toType, edgeType] = key.split('->');
    return { fromType, toType, edgeType, count };
  });

  const patternTable = [
    [['routes', 'api', 'controllers', 'endpoints', 'handlers', 'router', 'controller', 'routers', 'blueprints', 'serializers'], 'api'],
    [['services', 'core', 'lib', 'domain', 'logic', 'composables', 'signals', 'internal', 'mailers', 'jobs', 'channels'], 'service'],
    [['models', 'db', 'data', 'persistence', 'repository', 'entities', 'migrations', 'sql', 'database', 'schema', 'entity'], 'data'],
    [['components', 'views', 'pages', 'ui', 'layouts', 'screens'], 'ui'],
    [['middleware', 'plugins', 'interceptors', 'guards'], 'middleware'],
    [['utils', 'helpers', 'common', 'shared', 'tools', 'templatetags', 'pkg'], 'utility'],
    [['config', 'constants', 'env', 'settings', 'management', 'commands'], 'config'],
    [['__tests__', 'test', 'tests', 'spec', 'specs'], 'test'],
    [['types', 'interfaces', 'schemas', 'contracts', 'dtos', 'dto', 'request', 'response'], 'types'],
    [['hooks'], 'hooks'],
    [['store', 'state', 'reducers', 'actions', 'slices'], 'state'],
    [['assets', 'static', 'public'], 'assets'],
    [['cmd', 'bin'], 'entry'],
    [['docs', 'documentation', 'wiki'], 'documentation'],
    [['deploy', 'deployment', 'infra', 'infrastructure', 'k8s', 'kubernetes', 'helm', 'charts', 'terraform', 'tf', 'docker'], 'infrastructure'],
    [['.github', '.gitlab', '.circleci'], 'ci-cd'],
  ];

  function matchPattern(groupName) {
    const lower = groupName.toLowerCase();
    for (const [names, label] of patternTable) {
      if (names.includes(lower)) return label;
    }
    return null;
  }

  const patternMatches = {};
  for (const group of Object.keys(directoryGroups)) {
    const match = matchPattern(group);
    if (match) patternMatches[group] = match;
  }

  const infraFiles = [];
  let hasDockerfile = false, hasCompose = false, hasK8s = false, hasTerraform = false, hasCI = false;
  for (const node of fileNodes) {
    const fp = (node.filePath || '').toLowerCase();
    const name = (node.name || '').toLowerCase();
    if (name.includes('dockerfile')) { hasDockerfile = true; infraFiles.push(node.filePath); }
    if (name.includes('docker-compose')) { hasCompose = true; infraFiles.push(node.filePath); }
    if (fp.includes('k8s') || fp.includes('kubernetes') || fp.includes('helm')) { hasK8s = true; infraFiles.push(node.filePath); }
    if (fp.endsWith('.tf') || fp.endsWith('.tfvars')) { hasTerraform = true; infraFiles.push(node.filePath); }
    if (fp.includes('.github/workflows') || name === '.gitlab-ci.yml' || name === 'jenkinsfile') { hasCI = true; infraFiles.push(node.filePath); }
    if (name === 'makefile') { infraFiles.push(node.filePath); }
  }

  const schemaFiles = [], migrationFiles = [], dataModelFiles = [], apiHandlerFiles = [];
  for (const node of fileNodes) {
    const fp = (node.filePath || '').toLowerCase();
    if (fp.endsWith('.sql') || fp.endsWith('.graphql') || fp.endsWith('.prisma') || fp.includes('schema')) schemaFiles.push(node.filePath);
    if (fp.includes('migration')) migrationFiles.push(node.filePath);
    if (fp.includes('model')) dataModelFiles.push(node.filePath);
    if (fp.includes('route') || fp.includes('controller') || fp.includes('endpoint')) apiHandlerFiles.push(node.filePath);
  }

  const groupHasDocs = {};
  const documentNodes = fileNodes.filter((node) => node.type === 'document');
  for (const group of Object.keys(directoryGroups)) {
    groupHasDocs[group] = documentNodes.some((doc) => (doc.filePath || '').toLowerCase().includes(group.toLowerCase()));
  }
  const groupsWithDocs = Object.values(groupHasDocs).filter(Boolean).length;
  const totalGroups = Object.keys(directoryGroups).length;
  const undocumentedGroups = Object.entries(groupHasDocs).filter(([, v]) => !v).map(([k]) => k);

  const dependencyDirection = [];
  const seenPairs = new Set();
  for (const edge of interGroupImports) {
    const pairKey = [edge.from, edge.to].sort().join('|');
    if (seenPairs.has(pairKey)) continue;
    seenPairs.add(pairKey);
    const reverse = interGroupImports.find((e) => e.from === edge.to && e.to === edge.from);
    const reverseCount = reverse ? reverse.count : 0;
    if (edge.count > reverseCount) dependencyDirection.push({ dependent: edge.from, dependsOn: edge.to });
    else if (reverseCount > edge.count) dependencyDirection.push({ dependent: edge.to, dependsOn: edge.from });
  }

  const filesPerGroup = {};
  for (const [group, ids] of Object.entries(directoryGroups)) filesPerGroup[group] = ids.length;
  const nodeTypeCounts = {};
  for (const [type, ids] of Object.entries(nodeTypeGroups)) nodeTypeCounts[type] = ids.length;

  const result = {
    scriptCompleted: true,
    directoryGroups,
    nodeTypeGroups,
    crossCategoryEdges,
    interGroupImports,
    intraGroupDensity,
    patternMatches,
    deploymentTopology: { hasDockerfile, hasCompose, hasK8s, hasTerraform, hasCI, infraFiles: [...new Set(infraFiles)] },
    dataPipeline: { schemaFiles, migrationFiles, dataModelFiles, apiHandlerFiles },
    docCoverage: { groupsWithDocs, totalGroups, coverageRatio: totalGroups ? groupsWithDocs / totalGroups : 0, undocumentedGroups },
    dependencyDirection,
    fileStats: { totalFileNodes: fileNodes.length, filesPerGroup, nodeTypeCounts },
    fileFanIn,
    fileFanOut,
  };

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  process.exit(0);
}

try {
  main();
} catch (error) {
  console.error(error.stack || String(error));
  process.exit(1);
}
