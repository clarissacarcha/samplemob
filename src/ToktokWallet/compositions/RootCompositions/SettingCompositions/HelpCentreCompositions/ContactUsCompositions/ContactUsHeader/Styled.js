/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Image, TouchableOpacity} from 'react-native';

import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  margin-top: ${moderateScale(10)}px;
  align-items: center;
`;
export const Title: ComponentType<any> = styled.Text`
  font-family: ${FONT.BOLD};
  font-size: ${FONT_SIZE.XL + 5}px;
  color: ${props => props.theme.color.orange};
  margin-bottom: ${moderateScale(10)}px;
`;
export const SubText: ComponentType<any> = styled.Text`
  padding-horizontal: ${moderateScale(15)}px;
  font-size: ${FONT_SIZE.S + 1}px;
  font-family: ${FONT.REGULAR};
  text-align: center;
`;
export const SupportContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  margin-vertical: ${moderateScale(15)}px;
  justify-content: center;
`;
export const SupportButton: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  flex-direction: row;
  background-color: ${props => props.theme.color.white};
  align-items: center;
  padding: ${moderateScale(10)}px;
  border-radius: ${moderateScale(5)}px;
  margin-vertical: ${moderateScale(5)}px;
`;
export const SupportImage: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  resizeMode: 'contain',
}))`
  height: ${moderateScale(15)}px;
  width: ${moderateScale(15)}px;
`;
export const SupportLabel: ComponentType<any> = styled.Text`
  margin-left: ${moderateScale(7)}px;
  color: ${props => props.theme.color.darkgray};
`;
