import { readdir, readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE_PATH = fileURLToPath(import.meta.url);
const DIRECTORY_NAME = dirname(FILE_PATH);

function drupalSdcGenerator({ directory: _directory } = {}) {
  const directory = _directory || join(DIRECTORY_NAME, '../templates');

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

        await Promise.all(
          files.map(async (file) => {
            const source = await readFile(
              join(templateDirectory, file),
              'utf8',
            );

            const emittedFileName = file.replace('[name]', name);
            this.debug(`emitted filename is ${emittedFileName}`);

            const emittedSource = source
              .replaceAll(/(?<!\[)\[name](?!])/g, name)
              .replaceAll(/\[\[name]]/g, '[name]');

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
