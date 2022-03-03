import React from 'react';
import LandingScreens from './LandingScreens';
import RootScreens from './RootScreens';

export default ({Navigator}) => {
  return (
    <>
      {LandingScreens({Navigator})}
      {RootScreens({Navigator})}
    </>
  );
};
