import { exec } from 'node:child_process';
import { readFile, rm, stat } from 'node:fs/promises';

import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';

describe('examples', () => {
  beforeAll(async () => {
    await new Promise((resolve, reject) => {
      exec(`npm run build`, (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });

    {
      const promises = [];
      for (const group of ['react', 'vanilla']) {
        const nodeModules = `examples/${group}/node_modules`;
        promises.push(
          stat(nodeModules)
            .then(() => rm(nodeModules, { recursive: true }))
            .catch((reason) => {
              if (reason.code !== 'ENOENT') {
                throw reason;
              }
            }),
        );

        const packageLock = `examples/${group}/package-lock.json`;
        promises.push(
          stat(packageLock)
            .then(() => rm(packageLock, { recursive: true }))
            .catch((reason) => {
              if (reason.code !== 'ENOENT') {
                throw reason;
              }
            }),
        );
      }

      await Promise.all(promises);
    }
  });

  ['react', 'vanilla'].forEach((group) => {
    describe(group, () => {
      beforeEach(async () => {
        const promises = [];
        for (const group of ['react', 'vanilla']) {
          promises.push(
            new Promise((resolve, reject) => {
              exec(`cd examples/${group} && npm install`, (error) => {
                if (error) {
                  reject(error);
                }
                resolve();
              });
            }),
          );
        }
        await Promise.all(promises);
      }, 10_000);

      test(`can build the "${group}" example`, async () => {
        await new Promise((resolve, reject) => {
          exec(
            `cd examples/${group} && npm install && npm run build`,
            (error) => {
              if (error) {
                reject(error);
              }
              resolve();
            },
          );
        });

        const sdc = `examples/${group}/components/my-component`;
        expect(async () => await stat(sdc)).not.toThrow();

        expect(
          async () => await stat(`${sdc}/my-component.component.yml`),
        ).not.toThrow();
        expect(async () => await stat(`${sdc}/my-component.js`)).not.toThrow();
        expect(
          async () => await stat(`${sdc}/my-component.twig`),
        ).not.toThrow();

        const yamlFilePath = `${sdc}/my-component.component.yml`;
        const content = await readFile(yamlFilePath, 'utf8');
        expect(content).toMatch(/\n\s*name:\s+My Component\n/);
      }, 10_000);
    });
  });
});
