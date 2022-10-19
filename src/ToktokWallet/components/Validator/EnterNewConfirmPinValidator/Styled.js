/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {moderateScale} from 'toktokwallet/helper';
import {Image, TouchableOpacity} from 'react-native';
import {logos} from 'toktokwallet/assets';
import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  margin-top: ${moderateScale(16)}px;
`;
export const ContentContainer: ComponentType<any> = styled.View`
  flex: 1;
  padding: ${moderateScale(16)}px;
`;
export const LogoContainer: ComponentType<any> = styled.View`
  justify-content: center;
  align-items: center;
`;
export const Logo: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  source: logos.toktokwallet_logo3,
}))`
  resize-mode: contain;
  width: ${moderateScale(72)}px;
  height: ${moderateScale(88)}px;
`;
export const Label: ComponentType<any> = styled.Text`
  font-family: ${FONT.SEMI_BOLD};
  font-size: ${FONT_SIZE.L}px;
  margin-top: ${moderateScale(25)}px;
  margin-bottom: ${moderateScale(5)}px;
  text-align: center;
`;
export const Message: ComponentType<any> = styled.Text`
  margin-horizontal: ${moderateScale(30)}px;
  text-align: center;
  margin-bottom: ${moderateScale(30)}px;
`;
export const ShowTpinButton: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  margin-vertical: ${moderateScale(20)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const ShowTpinText: ComponentType<any> = styled.Text`
  color: ${props => props.theme.color.orange};
  font-family: ${FONT.SEMI_BOLD};
`;
export const ButtonContainer: ComponentType<any> = styled.View`
  padding: ${moderateScale(16)}px;
`;
