/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {FlatList, Platform} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: ${props => props.theme.color.white};
`;

export const Separator: ComponentType<any> = styled.View`
  margin-horizontal: -6px;
`;

export const LoaderContainer: ComponentType<any> = styled.View`
  flex: 1;
  padding-horizontal: 7px;
  padding-top: 20px;
  background-color: ${props => props.theme.color.white};
`;

export const LoaderColumn: ComponentType<any> = styled.View`
  margin-top: 15px;
  margin-right: -10px;
`;

export const LoaderRow: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

export const ShopNameText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  textProps: {numberOfLines: 1},
  mode: 'semibold',
}))`
  width: 150px;
`;

export const ShopList: ComponentType<any> = styled(FlatList).attrs(props => ({
  ...props,
  horizontal: true,
  contentContainerStyle: {
    paddingHorizontal: Platform.OS === 'android' ? 15 : 20,
  },
  showsHorizontalScrollIndicator: false,
}))``;

export const ImageLoader: ComponentType<any> = styled(ContentLoader).attrs(props => ({
  ...props,
  activeL: true,
  title: false,
  pRows: 0,
  avatar: true,
  aShape: 'square',
  aSize: 150,
  containerStyles: {
    borderRadius: 5,
  },
}))``;
