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
  resize-mode: cover;
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
`;
