/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {View, Text} from 'react-native';
//FONTS AND HELPERS
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  margin-vertical: ${moderateScale(10)}px;
`;
export const ContentContainer: ComponentType<any> = styled(View).attrs(props => ({
  ...props,
}))`
  align-items: center;
  flex-direction: row;
  padding-horizontal: ${moderateScale(10)}px;
  padding-vertical: ${moderateScale(20)}px;
  border-radius: ${moderateScale(5)}px;
  background-color: ${props => (props.index % 2 === 1 ? props.theme.color.white : '#FFF4EB')};
`;
export const CellContainer: ComponentType<any> = styled.View`
  width: ${props => props.width};
`;
export const ContentText: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
  numberOfLines: 1,
  adjustsFontSizeToFit: true,
}))`
  font-size: ${FONT_SIZE.S}px;
  margin-horizontal: ${moderateScale(5)}px;
  ${props => props.isTextCenter && 'text-align: center'}
`;
export const PaymentRangesContainer: ComponentType<any> = styled(View).attrs(props => ({
  ...props,
}))`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => (props.index === props.lastItemIndex ? 0 : moderateScale(5))}px;
`;
