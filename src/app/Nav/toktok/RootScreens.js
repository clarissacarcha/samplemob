import React from 'react';
import {ToktokProfile, ToktokSearch} from 'toktok/screens';

const fadeCardStyle = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const fadeOptions = {headerShown: false, cardStyleInterpolator: fadeCardStyle};

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokSearch" component={ToktokSearch} options={fadeOptions} />
    <Navigator.Screen name="ToktokProfile" component={ToktokProfile} />
  </>
);
