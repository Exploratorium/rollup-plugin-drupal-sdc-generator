import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE_PATH = fileURLToPath(import.meta.url);
const DIRECTORY_NAME = dirname(FILE_PATH);

function drupalSdcGenerator({ directory: _directory } = {}) {
  const directory = _directory || join(DIRECTORY_NAME, 'templates');

  return {
    name: 'rollup-plugin-drupal-sdc-generator',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const { isEntry, name, type } = bundle[fileName];

        if (fileName === 'style.css') {
          bundle[fileName].fileName = `${basename(options.dir)}.css`;
          continue;
        }

        if (type !== 'chunk') {
          continue;
        }

        if (isEntry) {
          const templateDirectory =
            typeof directory === 'object' ? directory[name] : directory;
          const files = readdirSync(templateDirectory);

          files.forEach((file) => {
            const source = readFileSync(join(templateDirectory, file), 'utf8');

            const emittedFile = {
              type: 'asset',
              fileName: join(dirname(fileName), file.replace('[name]', name)),
              source: source
                .replaceAll(/(?<!\[)\[name](?!])/g, name)
                .replaceAll(/\[\[name]]/g, '[name]'),
            };
            this.emitFile(emittedFile);
          });
        }
      }
    },
  };
}

export default drupalSdcGenerator;
