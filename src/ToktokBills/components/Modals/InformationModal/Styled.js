/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {FlatList, Platform, TouchableOpacity, Dimensions} from 'react-native';
import {SearchInput} from 'toktokwallet/components';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
const {width} = Dimensions.get('window');

export const CustomModal: ComponentType<any> = styled(Modal).attrs(props => ({
  ...props,
  transparent: true,
  animationType: 'fade',
}))`
  margin: 0px;
`;
export const Container: ComponentType<any> = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
`;
export const ContentContainer: ComponentType<any> = styled.View`
  background-color: #fff;
  width: ${width * 0.8}px;
  border-radius: ${moderateScale(10)}px;
  padding: ${moderateScale(25)}px;
`;
export const Information: ComponentType<any> = styled.Text`
  text-align: center;
  padding-bottom: ${moderateScale(20)}px;
`;
