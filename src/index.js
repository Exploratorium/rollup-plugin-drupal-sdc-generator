import { readdir, readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseDocument, stringify, visit } from 'yaml';

const FILE_PATH = fileURLToPath(import.meta.url);
const DIRECTORY_NAME = dirname(FILE_PATH);

function drupalSdcGenerator({
  directory: _directory,
  label: _label = 'My Component',
} = {}) {
  const directory = _directory || join(DIRECTORY_NAME, '../templates');
  const label = _label || 'My Component';

  return {
    name: 'rollup-plugin-drupal-sdc-generator',
    async generateBundle(options, bundle) {
      for (const bundleId in bundle) {
        const { isEntry, name, fileName, type } = bundle[bundleId];
        this.debug(
          `Working on ${bundleId} isEntry=${isEntry}, name=${name}, fileName=${fileName}, type=${type}`,
        );

        if (Object.hasOwn(bundle, 'style.css')) {
          const bundleId = 'style.css';
          const cssFileName = basename(options.dir);
          this.debug({
            message: `Renaming ${bundleId} to ${cssFileName}.css`,
          });
          bundle[bundleId].fileName = `${cssFileName}.css`;
        }

        if (type !== 'chunk' || !isEntry) {
          this.debug({ message: `Skipping ${bundleId}` });
          continue;
        }

        const templateDirectory =
          typeof directory === 'object' ? directory[name] : directory;
        const files = await readdir(templateDirectory);

        const templateLabel = typeof label === 'object' ? label[name] : label;

        await Promise.all(
          files.map(async (file) => {
            const source = await readFile(
              join(templateDirectory, file),
              'utf8',
            );

            const emittedFileName = file.replace('[name]', name);
            this.debug(`emitted filename is ${emittedFileName}`);

            const vars = { name, label: templateLabel };

            const reducer = (acc, key) => {
              return acc
                .replaceAll(
                  new RegExp(`(?<!\\[)\\[${key}](?!])`, 'g'),
                  vars[key],
                )
                .replaceAll(new RegExp(`\\[\\[${key}\\]]`, 'g'), `[${key}]`);
            };

            const sourceDoc = parseDocument(source);

            const applyVars = (str) => Object.keys(vars).reduce(reducer, str);
            const processComments = (node) => {
              if (!node) return;
              if (node.commentBefore != null) {
                node.commentBefore = applyVars(node.commentBefore);
              }
              if (node.comment != null) {
                node.comment = applyVars(node.comment);
              }
            };

            visit(sourceDoc, {
              Pair(_, pair) {
                if (pair.key) {
                  processComments(pair.key);
                  if (typeof pair.key.value === 'string') {
                    pair.key.value = applyVars(pair.key.value);
                  }
                }
                if (pair.value) {
                  processComments(pair.value);
                  if (typeof pair.value.value === 'string') {
                    pair.value.value = applyVars(pair.value.value);
                  }
                }
              },
            });

            const emittedSource = stringify(sourceDoc);

            const emittedFile = {
              type: 'asset',
              fileName: emittedFileName,
              source: emittedSource,
            };

            this.debug({
              message: `Emitting ${bundleId} => ${emittedFile.fileName}`,
            });
            this.emitFile(emittedFile);
          }),
        );
      }
    },
  };
}

export default drupalSdcGenerator;
