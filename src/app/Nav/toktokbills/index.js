import React from 'react';
import GlobalScreens from './GlobalScreens';
import LandingScreens from './LandingScreens';
import RootScreens  from './RootScreens';
export default ({Navigator}) => {
  return (
    <>
      {GlobalScreens({Navigator})}
      {LandingScreens({Navigator})}
      {RootScreens({Navigator})}
    </>
  );
};
