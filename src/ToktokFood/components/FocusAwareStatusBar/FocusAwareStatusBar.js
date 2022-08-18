/**
 * @format
 * @flow
 */

import React from 'react';
import type {PropsType} from './types';
import {} from './Styled';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useTheme} from 'styled-components';

const FocusAwareStatusBar = (props: PropsType): React$Node => {
  const isFocused = useIsFocused();
  const theme = useTheme();
  return isFocused ? <StatusBar barStyle="dark-content" backgroundColor={theme.color.white} /> : null;
};

export default FocusAwareStatusBar;
