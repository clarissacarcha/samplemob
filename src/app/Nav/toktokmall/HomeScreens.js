import React from 'react';
import {
  ToktokMallLandingScreen,
  ToktokMallStore
} from '../../../ToktokMall/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokMallStore" component={ToktokMallStore} />
  </>
);
