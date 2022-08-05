/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import Header from 'toktokfood/components/Header';
import StyledText from 'toktokfood/components/StyledText';
import {TabBar} from 'react-native-tab-view';

export const TabBarTextContainer: ComponentType<any> = styled.View`
  background-color: ${props => (props.focused ? props.theme.color.orange : props.theme.color.white)};
  padding-vertical: 3px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  width: 78px;
  border-width: 1px;
  border-color: ${props => props.theme.color.orange};
`;

export const ActivitiesHeader: ComponentType<any> = styled(Header).attrs(props => ({
  ...props,
  title: 'Activities',
  titleStyle: {
    fontSize: 17,
  },
  centerContainerStyle: {
    top: Platform.OS === 'ios' ? 5 : 8,
  },
  hasBack: true,
}))``;

export const ActivitiesTabBar: ComponentType<any> = styled(TabBar).attrs(props => ({
  ...props,
  indicatorStyle: {
    backgroundColor: props.theme.color.white,
  },
  tabStyle: {
    paddingHorizontal: 10,
    width: 90,
  },
  scrollEnabled: true,
  bounces: true,
}))`
  background-color: ${props => props.theme.color.white};
  margin-vertical: 2px;
  padding-horizontal: 10px;
  padding-vertical: 5px;
`;

export const TabBarText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: props.focused ? 'semibold' : 'regular',
  color: props.focused ? props.theme.color.white : props.theme.color.orange,
  fontSize: 11,
}))``;
