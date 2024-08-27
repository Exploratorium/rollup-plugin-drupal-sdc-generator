import { jest } from '@jest/globals';
import { describe, expect, test } from '@jest/globals';

import drupalSdcGenerator from './index.js';

describe('drupalSdcGenerator', () => {
  const instance = {
    // eslint-disable-next-line no-undef
    ...console,
    debug: () => {},
    ...drupalSdcGenerator(),
  };

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

  test('plugin has a name', () => {
    expect(instance).toHaveProperty('name');
  });

  ['baz.component.yml', 'baz.twig'].forEach((fileName) => {
    test(`generateBundle emits ${fileName}`, async () => {
      instance.emitFile = jest.fn();

      await instance.generateBundle(options, bundle);

      expect(instance.emitFile).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'asset',
          fileName,
          source: expect.any(String),
        }),
      );
    });
  });

  test('generateBundle renames style.css to {component_name}.css', async () => {
    await instance.generateBundle(options, bundle);

    expect(bundle['style.css'].fileName).toEqual('baz.css');
  });
});
