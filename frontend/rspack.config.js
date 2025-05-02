const { defineConfig } = require('@rspack/cli');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const path = require('path');
const HtmlRspackPlugin = require('@rspack/core').HtmlRspackPlugin;

module.exports = defineConfig({
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  context: __dirname,
  entry: {
    main: './src/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'tailwindcss',
                  'autoprefixer',
                ],
              },
            },
          },
        ],
        type: 'css',
      },
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
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  plugins: [
    new ReactRefreshPlugin(),
    new HtmlRspackPlugin({
      template: './public/index.html',
      inject: true
    })
  ],
  devServer: {
    port: 3001,
    host: '0.0.0.0',
    allowedHosts: 'all',
    historyApiFallback: true,
  },
});
