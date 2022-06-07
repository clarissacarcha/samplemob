/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

export const Container: ComponentType<any> = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

export const TitleContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

export const Image: ComponentType<any> = styled.Image`
  width: 15;
  height: 15;
  resize-mode: contain;
  tint-color: ${props => props.theme.color.yellow};
  margin-right: 10px;
`;
