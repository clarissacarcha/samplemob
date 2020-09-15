import React from 'react';
import {Provider} from 'react-redux';
import configureStore from '../store/redux/configureStore';

// Set Text and TextInput fontSize not affected by the device's fontSize settings
import {Text, TextInput} from 'react-native';
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

export const ReduxProvider = ({children}) => <Provider store={configureStore()}>{children}</Provider>;
