/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {ImageBackground, Platform, Image, TouchableOpacity} from 'react-native';
import {HeaderBack} from 'toktokwallet/components';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {ICON_SET, VectorIcon} from 'src/revamp';

import {backgrounds, logos} from 'toktokwallet/assets';
import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

export const BackgroundImage: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  source: backgrounds.gradient_tpin,
}))`
  flex: 1;
`;
export const BackContainer: ComponentType<any> = styled.View`
  margin-top: ${Platform.OS === 'ios' ? moderateScale(16) : getStatusbarHeight + moderateScale(16)}px;
`;
export const Back: ComponentType<any> = styled(HeaderBack).attrs(props => ({
  ...props,
  color: props.theme.color.orange,
}))``;

export const ContentContainer: ComponentType<any> = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${moderateScale(16)}px;
`;
export const Logo: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  source: logos.toktokwallet_logo2,
}))`
  width: ${moderateScale(200)}px;
  height: ${moderateScale(80)}px;
  resize-mode: contain;
`;
export const Label: ComponentType<any> = styled.Text`
  font-family: ${FONT.SEMI_BOLD};
  font-size: ${FONT_SIZE.L}px;
  margin-bottom: ${moderateScale(5)}px;
`;
export const MessageContainer: ComponentType<any> = styled.View`
  align-items: center;
  margin-bottom: ${moderateScale(20)}px;
  flex-direction: row;
`;
export const Icon: ComponentType<any> = styled(VectorIcon).attrs(props => ({
  ...props,
  iconSet: ICON_SET.AntDesign,
  name: 'exclamationcircle',
  size: 15,
  color: props.theme.color.yellow,
}))`
  margin-right: ${moderateScale(5)}px;
`;
export const ForgotButton: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  margin-vertical: ${moderateScale(20)}px;
`;
export const ForgotText: ComponentType<any> = styled.Text`
  color: ${props => props.theme.color.orange};
`;
export const ErrorMessage: ComponentType<any> = styled.Text`
  color: ${props => props.theme.color.red};
  margin-horizontal: ${moderateScale(16)}px;
  text-align: center;
  margin-top: ${moderateScale(10)}px;
  font-size: ${FONT_SIZE.S}px;
`;
