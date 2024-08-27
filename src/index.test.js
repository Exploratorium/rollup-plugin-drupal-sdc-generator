import { jest } from '@jest/globals';
import { describe, expect, test } from '@jest/globals';

import drupalSdcGenerator from './index.js';

describe('drupalSdcGenerator', () => {
  test('plugin has a name', () => {
    const instance = drupalSdcGenerator();

    expect(instance).toHaveProperty('name');
  });

  test('generates a bundle', async () => {
    const instance = {
      // eslint-disable-next-line no-undef
      ...console,
      debug: () => {},
      ...drupalSdcGenerator(),
    };
    instance.emitFile = jest.fn();

    const options = {
      dir: 'baz',
    };

    const bundle = {
      'baz.js': { isEntry: true, name: 'baz', type: 'chunk' },
      'style.css': {
        isEntry: undefined,
        name: 'style.css',
        type: 'asset',
      },
    };

    await instance.generateBundle(options, bundle);

    expect(instance.emitFile).toHaveBeenCalledTimes(2);

    ['baz.component.yml', 'baz.twig'].forEach((fileName) => {
      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'asset',
          fileName,
          source: expect.any(String),
        }),
      );
    });

    expect(bundle['style.css'].fileName).toEqual('baz.css');
  });
});
