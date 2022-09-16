/**
 * @flow
 */

import type {ComponentType} from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

import StyledText from 'toktokfood/components/StyledText';

import {getDeviceWidth, scale} from 'toktokfood/helper/scale';

export const Container: ComponentType<any> = styled.View`
  padding-horizontal: ${scale(15)};
  background-color: ${props => props.theme.color.white};
  border-width: 1px;
  margin-bottom: 10px;
`;

export const TitleContainer: ComponentType<any> = styled.View`
  justify-content: space-between;
  flex-direction: row;
  /* border-width: 1px; */
  padding-vertical: 5px;
  /* padding-horizontal: 15px; */
`;

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
