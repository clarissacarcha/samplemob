/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Image} from 'react-native';
import DashedLine from 'react-native-dashed-line';
//HELPER
import {moderateScale} from 'toktokwallet/helper';
//FONTS & COLORS & IMAGES
import tokwa2 from 'toktokwallet/assets/images/tokwa2.png';
import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY, FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  padding-horizontal: ${moderateScale(15)}px;
  padding-top: ${moderateScale(15)}px;
`;
export const Label: ComponentType<any> = styled.Text`
  width: 50%;
  padding-right: ${moderateScale(10)}px;
  color: ${props => (props.isRefNum ? props.theme.color.orange : props.theme.color.black)};
  font-family: ${props => (props.isRefNum ? FONT_FAMILY.BOLD : FONT_FAMILY.REGULAR)};
`;
export const Value: ComponentType<any> = styled.Text`
  width: 50%;
  flex-shrink: 1;
  text-align: right;
`;
export const LineContainer: ComponentType<any> = styled.View`
  margin-vertical: ${moderateScale(20)}px;
  margin-horizontal: ${moderateScale(16)}px;
`;
export const BrokenLine: ComponentType<any> = styled(DashedLine).attrs(props => ({
  ...props,
  dashColor: props.theme.color.orange,
  dashThickness: 1,
}))``;
export const FooterContainer: ComponentType<any> = styled.View`
  align-items: center;
`;
export const FooterText: ComponentType<any> = styled.Text`
  margin-horizontal: ${moderateScale(16)}px;
  color: #525252;
  text-align: center;
  font-size: ${FONT_SIZE.S};
`;
export const Logo: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  source: tokwa2,
  resizeMode: 'contain',
}))`
  margin-vertical: ${moderateScale(16)}px;
  width: ${moderateScale(102)}px;
  height: ${moderateScale(23)}px;
`;
