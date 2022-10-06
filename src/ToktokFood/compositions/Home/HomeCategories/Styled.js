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
  background-color: ${props => props.theme.color.white};
  padding-top: 20px;
  padding-bottom: 10px;
  padding-horizontal: 15px;
`;

export const TitleContainer: ComponentType<any> = styled.View`
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 20px;
  /* padding-vertical: 5px; */
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
  margin-right: ${scale(13)};
  width: ${(getDeviceWidth - scale(60)) / 4 - 1};
  align-items: center;
  justify-content: space-evenly;
  /* height: 80px; */
`;

export const CategoryImg: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
}))`
  border-radius: 10px;
  width: ${scale(72)};
  height: ${scale(70)};
`;

export const CategoryText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
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
