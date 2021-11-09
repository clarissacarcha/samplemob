module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './src/',
            rootPathPrefix: 'src/',
          },
          {
            rootPathSuffix: './src/common/',
            rootPathPrefix: 'common/',
          },
          {
            rootPathSuffix: './src/res/',
            rootPathPrefix: 'res/',
          },
          {
            rootPathSuffix: './src/Toktok/',
            rootPathPrefix: 'toktok/',
          },
          {
            rootPathSuffix: './src/ToktokFood/',
            rootPathPrefix: 'toktokfood/',
          },
          {
            rootPathSuffix: './src/ToktokWallet/',
            rootPathPrefix: 'toktokwallet/',
          },
          {
            rootPathSuffix: './src/ToktokBills/',
            rootPathPrefix: 'toktokbills/',
          },
        ],
      },
    ],
  ],
};
