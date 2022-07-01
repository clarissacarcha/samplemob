/* eslint-disable no-nested-ternary */
/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import {TouchableOpacity} from 'react-native';
import {scale, verticalScale, moderateScale} from 'toktokfood/helper/scale';

export const Container: ComponentType<any> = styled.View`
  width: 100%;
  border-radius: 5px;
  background-color: ${props =>
    props.type === 'primary'
      ? props.disabled
        ? props.theme.color.lightgray
        : props.theme.color.orange
      : props.disabled
      ? props.theme.color.lightgray
      : props.theme.color.white};
  border-color: ${props => (props.disabled ? props.theme.color.lightgray : props.theme.color.orange)};
  border-width: 1px;
  height: ${props => verticalScale(props.height)}px;
  align-items: center;
  justify-content: center;
`;

export const Button: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
  activeOpacity: 0.9,
}))`
  /* flex: 1; */
`;

export const ButtonText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'medium',
  fontSize: scale(15),
}))`
  color: ${props =>
    props.type === 'primary'
      ? props.disabled
        ? props.theme.color.gray
        : props.theme.color.white
      : props.disabled
      ? props.theme.color.gray
      : props.theme.color.orange};
`;
