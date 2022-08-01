/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

export const LoaderContainer: ComponentType<any> = styled.View`
  margin-bottom: 20px;
  left: 29%;
`;

export const AnimatedImage: ComponentType<any> = styled.Image`
  resize-mode: contain;
  width: ${props => (props?.animationContainerHeight < 210 ? 90 : 150)}px;
  height: ${props => (props?.animationContainerHeight < 210 ? 90 : 150)}px;
  margin-top: ${props => (props?.animationContainerHeight < 210 ? -30 : 0)}px;
  margin-bottom: 20px;
`;
