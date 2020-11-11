import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DARK, MEDIUM, ORANGE} from '../../res/constants';
import {YellowIcon} from '../../components/ui';

export const CardHeader = ({label, iconSet, iconName, iconSize = 16}) => {
  return (
    <View style={styles.headerContainer}>
      <YellowIcon set={iconSet} name={iconName} size={iconSize} darkIcon />

      <Text style={styles.headerTitle}>
        {label[0]} <Text style={{color: ORANGE}}>{label[1]}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: MEDIUM,
  },
  headerTitle: {
    marginLeft: 10,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
});
