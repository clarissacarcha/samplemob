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
            rootPathSuffix: './src/ToktokFood/',
            rootPathPrefix: 'toktokfood/',
          },
        ],
      },
    ],
  ],
};
