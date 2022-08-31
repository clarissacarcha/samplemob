/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native';
import StyledText from 'toktokfood/components/StyledText';

export const Separator: ComponentType<any> = styled.View`
  padding-vertical: 10px;
`;

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyListContainer: ComponentType<any> = styled.View`
  padding-bottom: 40px;
  align-items: center;
  justify-content: center;
`;

export const Image: ComponentType<any> = styled.Image`
  resize-mode: cover;
  width: 195px;
  height: 150px;
  margin-bottom: 20px;
`;

export const List: ComponentType<any> = styled(FlatList).attrs(props => ({
  ...props,
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
}))``;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
  color: props.theme.color.orange,
  fontSize: 18,
}))`
  margin-bottom: 10px;
`;
