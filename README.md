# Vite Plugin for Drupal to Generate Single Directory Components (SDCs)

This is a [vite](https://vitejs.dev) plugin that creates
[single directory components](https://www.drupal.org/docs/develop/theming-drupal/using-single-directory-components)
for embedding your app in a [Drupal](https://www.drupal.org) module or theme.

## Installation

```shell
npm install --save-dev rollup-plugin-drupal-sdc-generator
```

## Usage

```javascript
import { defineConfig } from 'vite'
import rollupPluginDrupalSdcGenerator from 'vite-plugin-react-drupal-interface-translations'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    rollupPluginDrupalSdcGenerator(),
  ],
  root: 'js',
  build: {
    rollupOptions: {
      input: 'js/main.js',
    },
  }
})
```

## Options

### directory

Type
: `string | object = { "{component-name}": string }`

Default
: `"node_modules/rollup-plugin-drupal-sdc-generator/templates"`

The directory where your SDC's `[{component-name}].component.yml`,
`[{component-name}].twig`, and other files that will be included
with the built single directory component.

When a string is provided, the templates in the directory passed in are used
on all generated single directory components.

When an object is provided, the templates in the directory passed in are used
for the component names specified by the object's keys.

In your templates, `[name]` will be replaced with the value
of `{component-name}` too. Use `\[name\]` if you want the string `[name]`
included verbatim.

```javascript
rollupPluginDrupalSdcGenerator({ directory: 'vite/shared'})

rollupPluginDrupalSdcGenerator({
  directory: {
    'my-component': 'vite/my-component',
  }
})
```
