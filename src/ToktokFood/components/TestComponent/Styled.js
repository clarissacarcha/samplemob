/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

import StyledText from 'toktokfood/components/StyledText';
import Header from 'toktokfood/components/Header';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
`;

export const Subtitle: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.red,
  mode: 'bold',
}))`
  margin: 10px;
`;
