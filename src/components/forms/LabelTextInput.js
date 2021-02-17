import React from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import {DARK, LIGHT, MEDIUM} from '../../res/constants';

import {SizedBox} from '../widgets/SizedBox';

const Widget = ({label, value, onChange, placeholder, keyboardType = 'default', marginTop, marginBottom}) => {
  return (
    <>
      {marginTop && <SizedBox />}
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={LIGHT}
        keyboardType={keyboardType}
      />

      {marginBottom && <SizedBox />}
    </>
  );
};

export const LabelTextInput = Widget;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
    height: 50,
    color: DARK,
    backgroundColor: 'white',
  },
  label: {
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
});
