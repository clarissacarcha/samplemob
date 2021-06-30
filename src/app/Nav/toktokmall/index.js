import React from 'react';
import LandingScreens from './LandingScreens';
import RootScreens from './RootScreens';
import CartScreens from './CartScreens';
import CategoriesScreens from './CategoriesScreens';
import HomeScreens from './HomeScreens';
import MeScreens from './MeScreens';
import NotificationScreens from './NotificationScreens';

export default ({Navigator}) => {
  return (
    <>
      {LandingScreens({Navigator})}
      {RootScreens({Navigator})}
      {CategoriesScreens({Navigator})}
      {MeScreens({Navigator})}
    </>
  );
};
