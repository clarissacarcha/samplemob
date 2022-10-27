/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {View} from 'react-native';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: #fff;
  z-index: 2;
`;
export const ProgressBarContainer: ComponentType<any> = styled(View).attrs(props => ({
  ...props,
}))`
  height: 10px;
  width: 100%;
  flex-direction: row;
  background-color: #fff1d2;
`;

export const ProgressBarItem: ComponentType<any> = styled.View`
  flex: 1;
  background-color: ${props => (props.donePage ? props.theme.color.orange : 'transparent')};
`;
