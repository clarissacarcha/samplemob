/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: ${props => props.theme.color.white};
`;
