/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Image} from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';

import styled from 'styled-components/native';
import {FloatingMenu} from 'react-native-floating-action-menu';

export const Container: ComponentType<any> = styled.View``;

export const FAB: ComponentType<any> = styled(FloatingMenu).attrs(props => ({
  ...props,
  position: 'bottom-right',
  backgroundDownColor: props.theme.color.lightgray,
  borderColor: 'white',
}))``;

export const FABIcon: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  resizeMode: 'contain',
}))`
  height: 25px;
  width: 30px;
`;

export const CloseIcon: ComponentType<any> = styled(IconFA).attrs(props => ({
  ...props,
  name: 'times',
  size: 25,
}))`
  /* margin-right: 10px; */
  /* padding: 12px; */
  color: ${props => props.color || props.theme.color.yellow};
`;
