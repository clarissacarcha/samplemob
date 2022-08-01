/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Icon} from 'react-native-elements';
import styled from 'styled-components/native';

import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  background-color: ${props => props.theme.color.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  height: 100;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  /* align-items: center; */
  padding: 20px;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

export const Column: ComponentType<any> = styled.View`
  flex: 1;
  padding-horizontal: 7px;
`;

export const Row: ComponentType<any> = styled.View`
  /* flex: 1px; */
  align-items: center;
  flex-direction: row;
`;

export const InfoContainer: ComponentType<any> = styled.TouchableOpacity``;

export const InfoIcon: ComponentType<any> = styled(Icon).attrs(props => ({
  name: props.icon,
  type: 'ionicon',
  color: props.color || props.theme.color.orange,
  size: 15,
}))``;

export const InfoText: ComponentType<any> = styled(StyledText).attrs(props => ({
  fontSize: 11,
  ...props,
}))`
  margin-horizontal: 5px;
`;
