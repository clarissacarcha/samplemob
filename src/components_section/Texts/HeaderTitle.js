import React from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import CONSTANTS from '../../common/res/constants';

export const HeaderTitle = ({label}) => {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
  },
});

/** ====================== HEADER OPTION ====================== */

export const headerOptions = {
  headerTitleAlign: 'center',
  headerStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
};
