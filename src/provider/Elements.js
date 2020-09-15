import React from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import {COLOR, FONT_SIZE, FONT_COLOR, FONT_FAMILY} from '../res/constants'
import { ThemeProvider } from 'react-native-elements';

// Set Text and TextInput fontSize not affected by the device's fontSize settings
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

export const ElementsProvider = ({children}) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const theme = {
  colors: {
    primary: COLOR
  },
  Text: {
    style: {
      color: FONT_COLOR,
      fontSize: 10
    }
  },
  Button: {
    titleStyle: {
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMILY
    },
    containerStyle: {
      width: '100%'
    }
  },
  Input: {
    inputStyle: {
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMILY,
      height: 50,
      textAlignVertical: 'bottom',
      paddingBottom: 2,
      margin: 0,
    },
    inputContainerStyle: {
      height: 50,
      borderBottomColor: COLOR,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    containerStyle: {
      height: 50,
      paddingHorizontal: 0,
    }
  }
}
