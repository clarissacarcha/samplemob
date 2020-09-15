import React from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';

export const KeyboardProvider = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
