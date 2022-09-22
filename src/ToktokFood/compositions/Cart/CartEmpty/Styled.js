/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Image: ComponentType<any> = styled.Image`
  width: 150px;
  height: 120px;
  resize-mode: cover;
  margin-top: -60px;
`;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
  fontSize: 18,
  color: props.theme.color.orange,
}))`
  margin-vertical: 10px;
`;
