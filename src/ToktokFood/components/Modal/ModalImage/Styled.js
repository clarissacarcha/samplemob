/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

export const Image: ComponentType<any> = styled.Image`
  width: ${props => props.width || props.size};
  height: ${props => props.height || props.size};
  resize-mode: cover;
  border-radius: ${props => props.borderRadius};
  margin-bottom: 20px;
`;
