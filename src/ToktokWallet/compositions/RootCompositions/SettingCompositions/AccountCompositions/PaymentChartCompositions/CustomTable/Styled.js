/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

import {moderateScale} from 'toktokwallet/helper';

import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  margin-top: ${moderateScale(20)}px;
`;

export const ContentContainer: ComponentType<any> = styled.View`
  margin-bottom: ${moderateScale(20)}px;
`;

export const ServiceText: ComponentType<any> = styled.Text`
  font-family: ${FONT.BOLD};
  margin-bottom: ${moderateScale(10)}px;
`;
