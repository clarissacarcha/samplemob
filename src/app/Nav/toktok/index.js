import React from 'react';
import RootScreens from './RootScreens';
import LandingScreens from './LandingScreens';

export default ({Navigator}) => {
  return (
    <>
      {LandingScreens({Navigator})}
      {RootScreens({Navigator})}
    </>
  );
};
