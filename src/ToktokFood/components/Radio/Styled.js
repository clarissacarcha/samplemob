/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {CheckBox} from 'react-native-elements';

export const RadioButton: ComponentType<any> = styled(CheckBox).attrs(props => ({
  ...props,
  checkedIcon: 'dot-circle-o',
  uncheckedIcon: 'circle-thin',
  checkedColor: props.theme.color.yellow,
  uncheckedColor: props.theme.color.yellow,
  textStyle: {
    fontWeight: '400',
    marginLeft: 15,
  },
  containerStyle: {
    padding: 0,
    margin: 0,
    backgroundColor: props.theme.color.white,
    borderWidth: 0,
    marginVertical: 10,
    marginLeft: 0,
  },
  size: 18,
}))``;
