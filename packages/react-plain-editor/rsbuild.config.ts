import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    assetPrefix: '/codemirror-lang-mustache/react-plain-editor', // Set this to your desired public path, e.g. '/static/' or './'
  },
  
});
