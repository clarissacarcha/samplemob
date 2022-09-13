/**
 * @format
 * @flow
 */

import React from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import {useTheme} from 'styled-components';

import type {PropsType} from './types';
import {Container} from './Styled';

// Components
// import Header from 'toktokfood/components/Header';
// import StyledText from 'toktokfood/components/StyledText';
import HomeHeader from 'toktokfood/compositions/Home/HomeHeader';
import HomeSearchBar from 'toktokfood/compositions/Home/HomeSearchBar';
// Hooks
// import {useUserLocation} from 'toktokfood/hooks';

const ToktokFoodHomeScreen = (props: PropsType): React$Node => {
  // const theme = useTheme();

  return (
    <Container>
      <HomeHeader />
      <HomeSearchBar />
    </Container>
  );
};

export default ToktokFoodHomeScreen;
