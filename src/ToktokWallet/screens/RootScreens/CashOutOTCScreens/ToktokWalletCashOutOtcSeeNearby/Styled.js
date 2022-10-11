/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {TouchableOpacity, Dimensions} from 'react-native';
import DatePicker from 'react-native-date-picker';

const {width} = Dimensions.get('window');

export const Container: ComponentType<any> = styled.View`
  background-color: #fff;
  flex: 1;
`;
