import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RaisedTextButton, TextButton} from 'react-native-material-buttons';
import {COLOR, LIGHT, FONT_COLOR, FONT_SIZE, FONT_FAMILY} from '../../res/constants';

export const Button = props => {
  const style = {
    titleColor: props.text ? FONT_COLOR : 'white',
    titleStyle: styles.titleStyle,
    color: props.text ? null : COLOR,
    style: props.extend ? styles.extend : {},
    ...props,
  };

  const Output = props.text ? (
    <TextButton {...style} shadeColor={COLOR} rippleColor={COLOR} />
  ) : (
    <RaisedTextButton {...style} disabledColor={LIGHT}/>
  );

  return <View style={props.containerStyle}>{Output}</View>;
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY,
    fontWeight: 'normal',
  },
  extend: {
    flex: 1,
  },
});
