/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: ${props => props.theme.color.white};
`;

export const LoaderContainer: ComponentType<any> = styled.View`
  padding-top: 20px;
  padding-horizontal: ${props => (props.isFooter ? '0px' : '15px')};
  background-color: ${props => props.theme.color.white};
`;
