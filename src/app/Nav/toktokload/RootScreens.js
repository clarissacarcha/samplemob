import React from 'react';
import {ToktokLoadHome} from '../../../ToktokLoad/screens';
export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokLoadHome" component={ToktokLoadHome} options={{ headerTitleAlign: 'center' }} />
  </>
);
