module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './src/res/',
            rootPathPrefix: 'res/',
          },
          {
            rootPathSuffix: './src/ToktokFood/assets',
            rootPathPrefix: 'assets/',
          },
          {
            rootPathSuffix: './src/ToktokFood/components',
            rootPathPrefix: 'components/',
          },
          {
            rootPathSuffix: './src/ToktokFood/helper',
            rootPathPrefix: 'toktokfood-helper',
          },
          {
            rootPathSuffix: './src/ToktokFood/util',
            rootPathPrefix: 'toktokfood-util',
          },
        ],
      },
    ],
  ],
};
