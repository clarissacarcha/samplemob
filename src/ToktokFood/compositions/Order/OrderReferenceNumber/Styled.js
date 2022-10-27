/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

export const Container: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.color.lightYellow};
  padding-horizontal: 20px;
  padding-vertical: 15px;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const ImageContainer: ComponentType<any> = styled.View`
  width: 20px;
  height: 20px;
`;

export const Image: ComponentType<any> = styled.Image`
  width: 18px;
  height: 18px;
  resize-mode: stretch;
`;
