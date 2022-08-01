/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

export const Container: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ImageContainer: ComponentType<any> = styled.View`
  width: ${props => (props.type === 'toktokwallet' ? 27 : 40)};
  height: 22px;
  margin-right: 10px;
`;

export const Image: ComponentType<any> = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: stretch;
`;
