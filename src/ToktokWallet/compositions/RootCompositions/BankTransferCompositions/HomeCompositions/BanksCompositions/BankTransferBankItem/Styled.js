/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Text} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import FastImage from 'react-native-fast-image';

import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const ButtonContainer: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  width: ${'33.3%'};
  align-items: center;
  margin-vertical: 8px;
`;
export const LogoContainer: ComponentType<any> = styled.View`
  justify-content: center;
`;
export const LoadingContainer: ComponentType<any> = styled.View`
  position: absolute;
  right: 0px;
  left: 0px;
`;
export const LogoImage: ComponentType<any> = styled(FastImage).attrs(props => ({
  ...props,
}))`
  height: ${moderateScale(35)}px;
  width: ${moderateScale(35)}px;
  resize-mode: 'contain';
`;
export const DetailsContainer: ComponentType<any> = styled.View`
  margin-vertical: ${moderateScale(10)}px;
`;
export const Description: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
  numberOfLines: 2,
  ellipsizeMode: 'tail',
}))`
  font-family: ${FONT.REGULAR};
  font-size: ${moderateScale(FONT_SIZE.M)}px;
  text-align: center;
  margin-top: ${moderateScale(5)}px;
  margin-horizontal: ${moderateScale(10)}px;
`;
