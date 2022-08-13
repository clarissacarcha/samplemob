/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {TouchableOpacity, Dimensions} from 'react-native';
import DatePicker from 'react-native-date-picker';

const {width} = Dimensions.get('window');

export const CustomModal: ComponentType<any> = styled(Modal).attrs(props => ({
  ...props,
  transparent: true,
  animationType: 'slide',
}))`
  margin: 0px;
`;
export const ButtonOpacity: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
  activeOpacity: 1,
}))`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;
export const ButtonWithoutFeedback: ComponentType<any> = styled.TouchableWithoutFeedback``;
export const CustomDatePicker: ComponentType<any> = styled(DatePicker).attrs(props => ({
  ...props,
  mode: 'date',
}))`
  background-color: #f7f7fa;
  width: ${width};
`;
