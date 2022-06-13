import React from 'react';
import GlobalScreens from './GlobalScreens';
import RootScreens from './RootScreens';
export default ({Navigator}) => {
  return (
    <>
      {GlobalScreens({Navigator})}
      {RootScreens({Navigator})}
    </>
  );
};
