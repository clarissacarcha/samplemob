/* eslint-disable no-nested-ternary */
/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

export const Container: ComponentType<any> = styled.View`
  background-color: ${props => props.theme.divider.active};
  width: ${props => (props.horizontal ? '100%' : 2)};
  height: ${props => (props.height === 0 ? (props.horizontal ? 2 : '100%') : props.height)};
  margin-vertical: ${props => props.marginVertical};
`;
