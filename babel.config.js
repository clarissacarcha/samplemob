module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './src/ToktokFood/assets',
            rootPathPrefix: 'assets/',
          },
          {
            rootPathSuffix: './src/res/',
            rootPathPrefix: 'res/',
          },
          {
            rootPathSuffix: './src/ToktokFood/components',
            rootPathPrefix: 'components/',
          },
        ],
      },
    ],
  ],
};
