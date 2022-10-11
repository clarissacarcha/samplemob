/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native';

export const Container: ComponentType<any> = styled.View`
  background-color: #ffffff;
  flex: 1;
`;
export const SearchContainer: ComponentType<any> = styled.View`
  margin: 16px;
`;
export const List: ComponentType<any> = styled(FlatList).attrs(props => ({...props}))`
  flex: 1;
`;
export const LoadMoreContainer: ComponentType<any> = styled.View`
  margin-vertical: 16px;
`;
