/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {ImageBackground, Image} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE, COLOR, FONT_FAMILY} = CONSTANTS;
import {banner, cash_out_providers} from 'toktokwallet/assets';

export const BackgroundContainer: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  source: banner.banner_logo,
  resizeMode: 'cover',
}))``;
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
export const ContentContainer: ComponentType<any> = styled.View`
  margin-vertical: ${moderateScale(10)}px;
`;

export const DetailsContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-horizontal: ${moderateScale(16)}px;
  margin-vertical: ${moderateScale(8)}px;
`;
export const Label: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.M}px;
  width: 50%;
  padding-right: ${moderateScale(10)}px;
`;
export const Value: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.M}px;
  text-align: right;
  flex-shrink: 1;
`;
export const TotalSeparator: ComponentType<any> = styled.View`
  height: 2px;
  margin-horizontal: ${moderateScale(16)}px;
  background-color: ${COLOR.LIGHT};
`;
export const Total: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.M}px;
  font-family: ${FONT_FAMILY.BOLD};
  color: ${props => props.theme.color.orange};
  margin-vertical: ${moderateScale(8)}px;
`;
export const TncContainer: ComponentType<any> = styled.View`
  justify-content: flex-end;
  background-color: #fff;
  padding-horizontal: ${moderateScale(16)}px;
  padding-vertical: ${moderateScale(30)}px;
`;
export const TncText: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.S}px;
  color: ${props => props.theme.color.orange};
`;
export const TermsText: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.S}px;
`;
export const ProviderLogo: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  resizeMode: 'contain',
  source: props.type === 'Pesonet' ? cash_out_providers.pesonet : cash_out_providers.instapay,
}))`
  width: ${moderateScale(70)}px;
  height: ${moderateScale(30)}px;
`;
