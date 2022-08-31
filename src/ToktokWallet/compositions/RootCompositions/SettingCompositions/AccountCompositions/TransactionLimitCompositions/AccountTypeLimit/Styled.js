/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
//FONTS AND HELPERS
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  margin-bottom: ${moderateScale(20)}px;
`;
export const TitleContainer: ComponentType<any> = styled.View`
  background-color: ${props => props.headerBackgroundColor};
  height: ${moderateScale(50)}px;
  justify-content: center;
  padding: ${moderateScale(10)}px;
`;
export const TitleText: ComponentType<any> = styled.Text`
  font-family: ${FONT.SEMI_BOLD};
  font-size: ${FONT_SIZE.M}px;
`;
export const TransactionHeaderContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  height: ${moderateScale(40)}px;
  justify-content: center;
  align-items: center;
  padding: ${moderateScale(10)}px;
  background-color: transparent;
`;
export const FlexContainer: ComponentType<any> = styled.View`
  flex: 1;
`;

export const LabelText: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.M}px;
`;
export const TransactionContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  height: ${moderateScale(40)}px;
  justify-content: center;
  align-items: center;
  padding: ${moderateScale(10)}px;
  background-color: ${props => props.backgroundColor};
`;
