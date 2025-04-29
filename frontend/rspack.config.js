const { defineConfig } = require('@rspack/cli');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');

module.exports = defineConfig({
  context: __dirname,
  entry: {
    main: './src/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    refresh: true,
                  },
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [new ReactRefreshPlugin()],
  devServer: {
    port: 3001,
    historyApiFallback: true,
  },
});
