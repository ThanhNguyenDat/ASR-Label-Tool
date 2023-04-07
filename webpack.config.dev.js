const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const config = require('./config/development');

const CSSModuleLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    // localIdentName: '[local]__[hash:base64:8]',
  },
};

const CSSLoader = {
  loader: 'css-loader',
  options: {
    modules: false,
  },
};

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
  },
};

const lessLoader = {
  loader: 'less-loader',
  options: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
};

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.png', '.jpg', '.gif', '.jpeg'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@containers': path.resolve(__dirname, 'src/containers/'),
      '@redux': path.resolve(__dirname, 'src/redux/'),
      '@services': path.resolve(__dirname, 'src/services/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@constants': path.resolve(__dirname, 'src/constants/'),
      '@helpers': path.resolve(__dirname, 'src/helpers/'),
      '@resources': path.resolve(__dirname, 'src/resources/'),
    },
  },
  mode: 'development',
  devtool: 'inline-source-map',
  entry: [path.join(__dirname, 'src', 'index.js')],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'main.js',
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          filename: 'vender.bundle.js',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ['style-loader', CSSLoader, postCSSLoader, 'sass-loader'],
      },
      {
        test: /\.module\.scss$/,
        use: ['style-loader', CSSModuleLoader, postCSSLoader, 'sass-loader'],
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: ['style-loader', CSSLoader, postCSSLoader, lessLoader],
      },
      {
        test: /\.module\.less$/,
        use: ['style-loader', CSSModuleLoader, postCSSLoader, lessLoader],
      },
      {
        test: /\.css$/i,
        exclude: [/\.module\.css$/],
        use: ["style-loader", "css-loader"],
        // use: [
        //   'css-loader',
        //   'style-loader',
        //   // {
        //   //   loader: require.resolve('style-loader'),
        //   //   options: {
        //   //     importLoaders: 1,
        //   //   },
        //   // },
        //   // {
        //   //   options: {
        //   //     // Necessary for external CSS imports to work
        //   //     // https://github.com/facebookincubator/create-react-app/issues/2677
        //   //     ident: 'postcss',
        //   //     plugins: () => [
        //   //       require('postcss-flexbugs-fixes'),
        //   //       autoprefixer({
        //   //         overrideBrowserslist: [
        //   //           '>1%',
        //   //           'last 4 versions',
        //   //           'Firefox ESR',
        //   //           'not ie < 9', // React doesn't support IE8 anyway
        //   //         ],
        //   //         flexbox: 'no-2009',
        //   //       }),
        //   //     ],
        //   //   },
        //   // },
        // ],
      },
      { 
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader',
        options: {
          limit: 100000,
        } 
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name]-[hash:8].[ext]',
            },
          },
          // { loader: "url-loader" }
        ],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    // new webpack.DefinePlugin(config),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin({paths: [/node_modules/, /\.log$/,]}),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  watch: false,
  watchOptions: {
    aggregateTimeout: 1000,
    poll: 2000,
    ignored: /node_modules/,
  },
  devServer: {
    static: './dist',
    hot: true,
    compress: true,
    host: process.env.REACT_APP_HOST,
    port: process.env.REACT_APP_DEVELOPMENT_PORT,
    historyApiFallback: true,
  },
};