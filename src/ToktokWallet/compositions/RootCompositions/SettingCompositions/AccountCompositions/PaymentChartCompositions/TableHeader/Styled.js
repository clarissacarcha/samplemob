/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
//FONTS AND HELPERS
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const HeaderContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  flex-shrink: 1;
  align-items: center;
  background-color: ${props => props.theme.color.orange};
  border-top-left-radius: ${moderateScale(5)}px;
  border-top-right-radius: ${moderateScale(5)}px;
  padding: ${moderateScale(10)}px;
`;

export const HeaderText: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.S}px;
  font-family: ${FONT.SEMI_BOLD};
  margin-horizontal: ${moderateScale(5)}px;
  color: ${props => props.theme.color.white};
`;
