import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const targetDirectory = process.argv[2] ?? 'src';
const scannedExtensions = new Set(['.ts', '.tsx', '.css']);
const bannedPatterns = [
  { pattern: /\bany\b/, label: 'any' },
  { pattern: /as\s+any/, label: 'as any' },
  { pattern: /@ts-ignore/, label: '@ts-ignore' },
  { pattern: /@ts-expect-error/, label: '@ts-expect-error' },
  { pattern: /console\.log/, label: 'console.log' },
  { pattern: /\/\//, label: 'line comment' },
  { pattern: /\/\*/, label: 'block comment' }
];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(entries.map(entry => collectEntry(directory, entry)));

  return nestedFiles.flat();
}

async function collectEntry(directory, entry) {
  const entryPath = join(directory, entry.name);

  if (entry.isDirectory()) {
    return collectFiles(entryPath);
  }

  if (entry.isFile() && scannedExtensions.has(extname(entry.name))) {
    return [entryPath];
  }

  return [];
}

async function findViolations(filePath) {
  const content = await readFile(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  return lines.flatMap((line, lineIndex) =>
    bannedPatterns
      .filter(({ pattern }) => pattern.test(line))
      .map(({ label }) => `${filePath}:${lineIndex + 1} contains ${label}`)
  );
}

const files = await collectFiles(targetDirectory);
const violationGroups = await Promise.all(files.map(filePath => findViolations(filePath)));
const violations = violationGroups.flat();

if (violations.length > 0) {
  process.stderr.write(`${violations.join('\n')}\n`);
  process.exit(1);
}
