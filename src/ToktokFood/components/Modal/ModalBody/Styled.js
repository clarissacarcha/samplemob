/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

export const Container: ComponentType<any> = styled.View`
  padding: 15px;
  padding-top: 30px;
  background-color: ${props => props.theme.color.white};
`;
