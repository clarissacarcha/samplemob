/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Text, TouchableOpacity} from 'react-native';
import {moderateScale} from 'toktokbills/helper';
import FastImage from 'react-native-fast-image';

import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const ButtonContainer: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))``;
export const ContentContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${moderateScale(25)}px;
  padding-vertical: ${moderateScale(10)}px;
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
  height: ${moderateScale(60)}px;
  width: ${moderateScale(60)}px;
  resize-mode: 'contain';
`;
export const DetailsContainer: ComponentType<any> = styled.View`
  margin-left: ${moderateScale(18)}px;
  padding-vertical: ${moderateScale(4)}px;
  flex-shrink: 1;
`;
export const Title: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
  numberOfLines: 1,
  ellipsizeMode: 'tail',
}))`
  color: #525252;
  fontsize: ${FONT_SIZE.M};
  fontfamily: ${FONT.BOLD};
`;
export const Description: ComponentType<any> = styled.Text`
  color: #525252;
  fontsize: ${FONT_SIZE.S};
`;
