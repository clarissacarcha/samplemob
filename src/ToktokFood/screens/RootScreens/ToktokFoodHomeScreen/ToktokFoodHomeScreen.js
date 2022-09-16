/**
 * @format
 * @flow
 */

import React from 'react';
// import {useTheme} from 'styled-components';

import type {PropsType} from './types';
import {Container, ScrollContainer} from './Styled';

// Components
import HomeHeader from 'toktokfood/compositions/Home/HomeHeader';
import HomeSearchBar from 'toktokfood/compositions/Home/HomeSearchBar';
import HomeFab from 'toktokfood/compositions/Home/HomeFab';
import HomeCategories from 'toktokfood/compositions/Home/HomeCategories';
import HomeBanner from 'toktokfood/compositions/Home/HomeBanner/HomeBanner';
// Hooks
// import {useUserLocation} from 'toktokfood/hooks';

const ToktokFoodHomeScreen = (props: PropsType): React$Node => {
  // const theme = useTheme();

  return (
    <Container>
      <ScrollContainer>
        <HomeHeader />
        <HomeSearchBar />
        <HomeBanner />
        <HomeCategories />
      </ScrollContainer>

      <HomeFab />
    </Container>
  );
};

export default ToktokFoodHomeScreen;
