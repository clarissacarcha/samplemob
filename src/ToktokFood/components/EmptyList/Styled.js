/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';

import StyledText from 'toktokfood/components/StyledText/StyledText';

import {empty_search_2} from 'toktokfood/assets/images';

export const Container: ComponentType<any> = styled.View.attrs(props => ({
  ...props,
}))`
  align-items: center;
  justify-content: center;
  /* flex: 1; */
  background-color: ${props => props.theme.color.white};
  padding-vertical: 30px;
`;

export const EmptyImg: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  source: props.source || empty_search_2,
}))`
  height: 160px;
  width: 190px;
  margin-bottom: 20px;
`;

// Title
export const EmptyTitle: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 18,
  color: props.theme.color.orange,
  mode: 'semibold',
}))``;
