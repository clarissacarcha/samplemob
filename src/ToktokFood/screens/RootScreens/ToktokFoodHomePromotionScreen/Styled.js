/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Platform, FlatList} from 'react-native';
import Header from 'toktokfood/components/Header';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: ${props => props.theme.color.white};
`;

export const PromotionHeader: ComponentType<any> = styled(Header).attrs(props => ({
  ...props,
  titleStyle: {
    fontSize: 17,
  },
  centerContainerStyle: {
    top: Platform.OS === 'ios' ? 5 : 8,
  },
  hasBack: true,
}))``;

export const ShopList: ComponentType<any> = styled(FlatList).attrs(props => ({
  ...props,
  contentContainerStyle: {
    paddingVertical: 10,
    paddingLeft: 8,
  },
  numColumns: 2,
}))``;
