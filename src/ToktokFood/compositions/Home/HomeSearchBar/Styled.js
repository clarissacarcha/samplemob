/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {ImageBackground} from 'react-native';

import SearchBar from 'toktokfood/components/SearchBar';

import {home_bg} from 'toktokfood/assets/images';

export const Container: ComponentType<any> = styled.View`
  /* flex: 1; */
  /* border-width: 1px; */
`;

export const SearchBg: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  source: props.source ? {uri: props.source} : home_bg,
}))`
  align-items: center;
  justify-content: center;
  height: 75px;
  padding-horizontal: 20px;
`;

// Searchbar
export const SearchBox: ComponentType<any> = styled(SearchBar).attrs(props => ({
  ...props,
  color: props.theme.color.orange,
}))`
  border-width: 1px;
  border-color: ${props => props.theme.color.lightgray};
`;
