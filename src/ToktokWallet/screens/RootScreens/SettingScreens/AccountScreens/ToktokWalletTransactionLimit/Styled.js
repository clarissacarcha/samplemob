/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

export const List: ComponentType<any> = styled(FlatList).attrs(props => ({
  ...props,
  contentContainerStyle: {padding: 16},
  showsVerticalScrollIndicator: false,
}))`
  background-color: #fff;
`;
