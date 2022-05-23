/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Animated} from 'react-native';
import styled from 'styled-components/native';
import {TabBar} from 'react-native-tab-view';

import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View``;

export const AnimatedTabBar: ComponentType<any> = styled(Animated.View).attrs(props => ({
  ...props,
}))`
  top: 50;
  z-index: 1;
  position: absolute;
  width: 100%;
`;

export const ShopTabBar: ComponentType<any> = styled(TabBar).attrs(props => ({
  ...props,
  indicatorStyle: {
    // backgroundColor: props.theme.color.orange,
    borderWidth: 2,
    borderColor: props.theme.color.yellow,
  },
  contentContainerStyle: {
    // borderWidth: 0.3,
    // borderColor: props.theme.color.lightgray,
  },
  scrollEnabled: true,
  tabStyle: {
    width: 'auto',
    marginHorizontal: 20,
  },
}))`
  elevation: 10;
  background-color: ${props => props.theme.color.white};
`;

export const TabBarTitle: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
  fontSize: 13,
}))`
  color: ${props => (props.focused ? props.theme.color.orange : props.theme.color.black)};
`;
