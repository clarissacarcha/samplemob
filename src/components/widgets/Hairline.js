import React from 'react';
import {View, StyleSheet} from 'react-native';
import {LIGHT} from '../../res/constants';

export const Hairline = () => <View style={styles.hairline} />;

const styles = StyleSheet.create({
  hairline: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: LIGHT,
  },
});
