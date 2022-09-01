/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {moderateScale} from 'toktokwallet/helper';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: ${props => props.theme.color.white};
`;
export const ContentWrapper: ComponentType<any> = styled.View`
  flex: 1;
  padding: ${moderateScale(16)}px;
`;
