/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {moderateScale} from 'toktokwallet/helper';
import {Image} from 'react-native';

//FONTS & COLORS & IMAGES
import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE, FONT_FAMILY, COLOR} = CONSTANTS;
import {wallet_icon, warning_icon} from 'src/ToktokLoad/assets/icons';

export const Container: ComponentType<any> = styled.View`
  padding-horizontal: ${moderateScale(16)}px;
  padding-vertical: ${moderateScale(20)}px;
`;
export const Title: ComponentType<any> = styled.Text`
  color: #525252;
  font-family: ${FONT_FAMILY.SEMI_BOLD};
  font-size: ${FONT_SIZE.M}px;
`;
export const ContentContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: ${moderateScale(15)}px;
  align-items: center;
`;
export const Description: ComponentType<any> = styled.Text`
  color: #707070;
  font-size: ${FONT_SIZE.M}px;
`;
export const TokWaContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const WalletIcon: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  source: wallet_icon,
}))`
  resize-mode: contain;
  width: ${moderateScale(35)}px;
  height: ${moderateScale(35)}px;
`;
export const TokWaWrapper: ComponentType<any> = styled.View`
  padding-left: ${moderateScale(10)}px;
`;
export const TokWaTextContaienr: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
`;
export const Toktok: ComponentType<any> = styled.Text`
  color: ${COLOR.YELLOW};
  font-size: ${FONT_SIZE.M}px;
`;
export const Wallet: ComponentType<any> = styled.Text`
  color: ${COLOR.ORANGE};
  font-size: ${FONT_SIZE.M}px;
`;
export const TokwaBalance: ComponentType<any> = styled.Text`
  color: #525252;
  font-size: ${FONT_SIZE.M}px;
`;
export const CashInContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  flex: 1;
`;
export const CashInButton: ComponentType<any> = styled.TouchableOpacity`
  border-color: #f6841f;
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(5)}px;
  padding-horizontal: ${moderateScale(10)}px;
  padding-vertical: ${moderateScale(5)}px;
`;
export const CashInText: ComponentType<any> = styled.Text`
  color: #f6841f;
  font-size: ${FONT_SIZE.XS}px;
  text-align: center;
`;
export const CreateAccountText: ComponentType<any> = styled.Text`
  color: #f6841f;
  font-size: ${FONT_SIZE.S}px;
  text-align: center;
  text-decoration-line: underline;
`;
export const InsufficientContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${moderateScale(10)}px;
`;
export const InsufficientText: ComponentType<any> = styled.Text`
  color: #ed3a19;
  font-size: ${FONT_SIZE.S}px;
  margin-left: ${moderateScale(5)}px;
`;
export const WarningIcon: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  source: warning_icon,
}))`
  resize-mode: contain;
  width: ${moderateScale(15)}px;
  height: ${moderateScale(15)}px;
`;
