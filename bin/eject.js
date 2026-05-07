#!/usr/bin/env node
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Error: Please provide a target directory');
  console.error('');
  console.error('Usage:');
  console.error('  npx drupal-sdc-eject {directory}');
  console.error('  drupal-sdc-eject ./vite');
  console.error('');
  console.error('Examples:');
  console.error('  drupal-sdc-eject ./vite');
  console.error('  drupal-sdc-eject ../custom-templates');
  process.exit(1);
}

// Use current working directory
// Note: DDEV_APPROOT points to /var/www/html which is the project root,
// but we want to write relative to where the user ran the command
const workingDir = process.cwd();

const targetDirectory = resolve(workingDir, filePath);

// Templates are relative to the bin script location
const scriptDir = dirname(fileURLToPath(import.meta.url));
const templates = join(scriptDir, '../templates');

try {
  mkdirSync(targetDirectory, { recursive: true });
  cpSync(templates, targetDirectory, { recursive: true, force: true });

  console.log('');
  console.log('✓ Templates ejected successfully!');
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Edit the template files in ${targetDirectory}`);
  console.log('  2. Configure the plugin to use your templates:');
  console.log('');
  console.log('     drupalSdcGenerator({');
  console.log(`       directory: '${filePath}',`);
  console.log('     })');
  console.log('');
} catch (error) {
  console.error('');
  console.error('✗ Failed to eject templates');
  console.error('  Error:', error.message);
  process.exit(1);
}
