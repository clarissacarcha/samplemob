/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {moderateScale} from 'toktokwallet/helper';
//FONTS & COLORS & IMAGES
import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${moderateScale(15)}px;
`;
export const Label: ComponentType<any> = styled.Text`
  width: 50%;
  padding-right: ${moderateScale(10)}px;
`;
export const Value: ComponentType<any> = styled.Text`
  width: 50%;
  flex-shrink: 1;
  text-align: right;
  color: ${props => (props.isRefNum ? props.theme.color.orange : props.theme.color.black)};
  font-family: ${props => (props.isRefNum ? FONT_FAMILY.SEMI_BOLD : FONT_FAMILY.REGULAR)};
`;
