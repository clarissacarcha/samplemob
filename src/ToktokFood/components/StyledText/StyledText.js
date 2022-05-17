/**
 * @format
 * @flow
 */

import React from 'react';
import {Text, Platform} from 'react-native';

import type {PropsType} from './types';

import {moderateScale} from 'toktokfood/helper/scale';

const StyledText = (props: PropsType): React$Node => {
  const {children, mode = 'regular', isItalic, style, fontSize = 15, textProps} = props;

  const scaledFontSize = moderateScale(fontSize);

  const fontResolver = (): string => {
    let font = 'FiraSans-Regular';

    switch (mode) {
      case 'medium':
        font = 'FiraSans-ExtraBold';
        break;

      case 'heavy':
        font = 'FiraSans-ExtraBold';
        break;

      case 'bold':
        font = 'FiraSans-Bold';
        break;

      case 'black':
        font = 'FiraSans-Black';
        break;

      case 'semibold':
        font = 'FiraSans-SemiBold';
        break;

      default:
        break;
    }

    return `${font}${isItalic ? 'Italic' : ''}`;
  };

  const getExtraStyle = () => {
    let tmpStyle = {};

    if (Platform.OS === 'android') {
      tmpStyle = {lineHeight: scaledFontSize + scaledFontSize * 0.2};
    }

    return tmpStyle;
  };

  return (
    <Text
      style={[
        {
          fontFamily: fontResolver(),
          fontSize: scaledFontSize,
        },
        style,
        getExtraStyle(),
      ]}
      {...textProps}>
      {children}
    </Text>
  );
};

export default StyledText;
