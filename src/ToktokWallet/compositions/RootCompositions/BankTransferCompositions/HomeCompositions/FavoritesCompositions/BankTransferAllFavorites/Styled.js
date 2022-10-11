/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Text, TouchableOpacity} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import FastImage from 'react-native-fast-image';
import FIcon5 from 'react-native-vector-icons/FontAwesome';

import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${moderateScale(16)}px;
`;
export const ButtonContainer: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  flex-direction: row;
  align-items: center;
  flex-shrink: 1;
  flex: 1;
`;
export const ContentContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${moderateScale(10)}px;
  flex-shrink: 1;
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
  font-size: ${FONT_SIZE.M}px;
  font-family: ${FONT.BOLD};
`;
export const Description: ComponentType<any> = styled.Text`
  color: #525252;
  font-size: ${FONT_SIZE.S}px;
`;
export const HeartButton: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  padding-left: ${moderateScale(15)}px;
`;
export const HeartIcon: ComponentType<any> = styled(FIcon5).attrs(props => ({
  ...props,
  name: props.isFavorite ? 'heart' : 'heart-o',
  size: moderateScale(17),
  color: props.theme.color.orange,
  hitSlop: {left: moderateScale(30), top: moderateScale(30), right: moderateScale(30), bottom: moderateScale(30)},
}))`
  z-index: 1;
`;
