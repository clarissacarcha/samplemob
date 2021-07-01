import React from 'react';
import {ToktokSearch} from 'toktok/screens';
// import {} from '../../../Toktok/screens';

const forFade = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokSearch"
      component={ToktokSearch}
      options={{headerShown: false, cardStyleInterpolator: forFade}}
    />
  </>
);
