/**
 * @flow
 */

import type {ComponentType} from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import styled from 'styled-components/native';

import StyledText from 'toktokfood/components/StyledText';

import {getDeviceWidth, scale} from 'toktokfood/helper/scale';

export const Container: ComponentType<any> = styled.View`
  padding-horizontal: ${scale(15)};
  background-color: ${props => props.theme.color.white};
  margin-bottom: 10px;
`;

export const TitleContainer: ComponentType<any> = styled.View`
  justify-content: space-between;
  flex-direction: row;
  /* border-width: 1px; */
  padding-vertical: 5px;
  /* padding-horizontal: 15px; */
`;

export const SeeAllContainer: ComponentType<any> = styled.TouchableOpacity`
  justify-content: space-between;
  flex-direction: row;
  width: 60px;
`;

export const RightIcon: ComponentType<any> = styled(Icon).attrs(props => ({
  ...props,
  name: props.icon || 'chevron-forward-outline',
  type: 'ionicon',
  color: props.color || props.theme.color.orange,
  size: 15,
}))``;

export const CategoryTouchable: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  margin-right: ${scale(11)};
  width: ${(getDeviceWidth - scale(60)) / 4 - 1};
`;

export const CategoryImg: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
}))`
  border-radius: 10px;
  width: ${scale(75)};
  height: ${scale(55)};
`;

export const CategoryText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  text-align: center;
  flex-wrap: wrap;
  padding-vertical: 5px;
`;

export const CategoryList: ComponentType<any> = styled(FlatList).attrs(props => ({
  ...props,
  scrollEnabled: false,
  horizontal: true,
  contentContainerStyle: {
    alignItems: 'center',
    paddingVertical: 5,
  },
}))``;
