/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {ImageBackground} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE} = CONSTANTS;

export const BackgroundContainer: ComponentType<any> = styled.View``;
export const Container: ComponentType<any> = styled.View`
  align-items: center;
  margin-top: ${moderateScale(15)}px;
  margin-bottom: ${moderateScale(15)}px;
`;
export const LogoContainer: ComponentType<any> = styled.View`
  justify-content: center;
`;
export const LogoLoadingContainer: ComponentType<any> = styled.View`
  position: absolute;
  right: 0px;
  left: 0px;
`;
export const Logo: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  resizeMode: 'contain',
}))`
  width: ${moderateScale(130)}px;
  height: ${moderateScale(60)}px;
`;
export const Description: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.M}px;
  ${props => (props.noLogo ? `margin-vertical: ${moderateScale(20)}px;` : `margin-top: ${moderateScale(10)}px;`)}
`;
