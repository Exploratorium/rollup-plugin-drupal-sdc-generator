import { cpSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const filePath = process.argv[2];
const workingDir = process.env.INIT_CWD ?? process.cwd();

const targetDirectory = filePath ? resolve(workingDir, filePath) : workingDir;

const templates = join(fileURLToPath(import.meta.url), '../../templates');

mkdirSync(targetDirectory, { recursive: true });
cpSync(templates, targetDirectory, { recursive: true });
