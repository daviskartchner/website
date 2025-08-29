#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const args = process.argv.slice(2);

function parseArgs(argv) {
  const opts = { file: 'qrcode/generate.html', type: 'patch', dry: false, commit: false, set: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--file' && argv[i+1]) { opts.file = argv[++i]; continue; }
    if (a === '--type' && argv[i+1]) { opts.type = argv[++i]; continue; }
    if (a === '--dry-run' || a === '--dry') { opts.dry = true; continue; }
    if (a === '--commit') { opts.commit = true; continue; }
    if (a === '--set' && argv[i+1]) { opts.set = argv[++i]; continue; }
    if (a === '-h' || a === '--help') { opts.help = true; }
  }
  return opts;
}

function printHelp() {
  console.log(`Usage: node scripts/bump-version.mjs [--type patch|minor|major] [--file <path>] [--commit] [--dry-run] [--set <x.y.z>]

Options:
  --type    Which part to bump (default: patch)
  --file    File to update (default: qrcode/generate.html)
  --commit  Stage and commit the change with a message
  --dry-run Show changes but do not write file
  --set     Set an explicit version (overrides --type)
`);
}

function bump({ major, minor, patch }, type) {
  if (type === 'major') return { major: major + 1, minor: 0, patch: 0 };
  if (type === 'minor') return { major, minor: minor + 1, patch: 0 };
  return { major, minor, patch: patch + 1 }; // patch
}

function parseVersion(str) {
  const m = str.match(/v?(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return { major: parseInt(m[1], 10), minor: parseInt(m[2], 10), patch: parseInt(m[3], 10) };
}

function formatVersion(v) { return `v${v.major}.${v.minor}.${v.patch}`; }

async function run() {
  const opts = parseArgs(args);
  if (opts.help) { printHelp(); return; }
  const filePath = path.resolve(process.cwd(), opts.file);
  let content;
  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (e) {
    console.error(`Error: cannot read file ${filePath}`);
    process.exit(1);
  }

  const versionRegex = /v(\d+)\.(\d+)\.(\d+)/g;
  const match = versionRegex.exec(content);
  if (!match) {
    console.error('Error: no version string like vX.Y.Z found in file.');
    process.exit(1);
  }

  const current = { major: parseInt(match[1], 10), minor: parseInt(match[2], 10), patch: parseInt(match[3], 10) };
  let next;
  if (opts.set) {
    const parsed = parseVersion(opts.set);
    if (!parsed) {
      console.error('Error: --set expects a semantic version like 1.10.0');
      process.exit(1);
    }
    next = parsed;
  } else {
    next = bump(current, ['major','minor','patch'].includes(opts.type) ? opts.type : 'patch');
  }

  const currentStr = formatVersion(current);
  const nextStr = formatVersion(next);
  const updated = content.replace(new RegExp(currentStr.replace(/\./g, '\\.'), 'g'), nextStr);

  if (opts.dry) {
    console.log(`[dry-run] ${opts.file}: ${currentStr} -> ${nextStr}`);
    return;
  }

  await fs.writeFile(filePath, updated, 'utf8');
  console.log(`${opts.file}: ${currentStr} -> ${nextStr}`);

  if (opts.commit) {
    try {
      execSync(`git add ${JSON.stringify(opts.file)}`, { stdio: 'inherit' });
      execSync(`git commit -m ${JSON.stringify(`chore: bump version to ${nextStr}`)}`, { stdio: 'inherit' });
    } catch (e) {
      console.warn('Warning: git commit failed. Is this a git repo?');
    }
  }
}

run();
