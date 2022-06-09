const pkg = require('./package.json');
const path = require('path');

const nodeExternals = require('webpack-node-externals');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const babelConfig = require('./babel.config');

const plugins = [];

if (process.env.BUNDLE_ANALYZE) {
  plugins.push(new BundleAnalyzerPlugin());
}

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

plugins.push(new MiniCssExtractPlugin());

module.exports = {
  plugins,
  entry: {
    index: `${__dirname}/src/index.js`,
  },
  output: {
    library: pkg.name,
    libraryTarget: 'commonjs2',
    path: `${__dirname}/dist`,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      '@eeacms/search': path.resolve('./src'),
    },
    // mainFields: ['main', 'module'], // https://github.com/webpack/webpack/issues/5756#issuecomment-405468106
  },
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  externals: [
    'classnames',
    'd3-array',
    'deep-equal',
    'downshift',
    'luxon',
    'react',
    'react-dom',
    'react-motion',
    'react-select',
    'react-toastify',
    // 'regenerator-runtime',
    'elasticsearch',
    'semantic-ui-react',
    'superagent',
    'react-compound-slider',
    'redux',
    'd3-scale',
    nodeExternals()
  ], //nodeExternals()    // , 'semantic-ui-react'
};

// "build": "yarn build-csj && yarn build-es && yarn build-esm && yarn build-umd",
// "build-cjs": "BABEL_ENV=production LIB_BABEL_ENV=cjs yarn babel --root-mode upward src --ignore */*.test.js,**/*.test.js,*/*.stories.js,**/stories.js --out-dir dist/cjs",
// "build-esm": "BABEL_ENV=production LIB_BABEL_ENV=esm yarn babel --root-mode upward src --ignore */*.test.js,**/*.test.js,*/*.stories.js,**/stories.js --out-dir dist/esm",
// "build-es": "BABEL_ENV=production LIB_BABEL_ENV=es yarn babel --root-mode upward src --ignore */*.test.js,**/*.test.js,*/*.stories.js,**/stories.js --out-dir dist/es",
// "build-umd": "webpack --mode=production"
