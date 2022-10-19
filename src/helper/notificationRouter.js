export const NotificationRouter = ({data, navigation}) => {
  if (data.param == 'TOKTOKGO_HOME') {
    navigation.replace('RootDrawer', {
      screen: 'AuthenticatedStack',
      params: {
        screen: 'ConsumerLanding',
      },
    });
  }
};
