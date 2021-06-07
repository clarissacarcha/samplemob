import React from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import {FONT, COLOR} from '../../res/variables'

export const HeaderTitle = ({label , headerRightIsSet}) => {
  return (
    <View style={[styles.box, {marginRight: headerRightIsSet ? 0 : 66}]}>
      <Text style={styles.outer}>
        {label[0]}
        <Text style={styles.inner}> {label[1]}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    width:"100%",
    paddingRight: Platform.OS == "android" ? 66 : 0
  },
  outer: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
  },
  inner: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
  },
});
