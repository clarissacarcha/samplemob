import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MEDIUM, LIGHT} from '../../res/constants';
import {YellowIcon} from '../../components/ui';

export const CardRow = ({title, value, iconSet, iconName, iconSize = 16, minHeight = 50, iconMarginTop = 11}) => {
  return (
    <View style={[styles.cardRow, {minHeight}]}>
      <View style={[styles.cardRowIcon, {marginTop: iconMarginTop}]}>
        <YellowIcon set={iconSet} name={iconName} size={iconSize} />
      </View>
      <View style={styles.cardRowBody}>
        {title && <Text style={styles.cardRowTitle}>{title}</Text>}
        {value && <Text style={styles.cardRowValue}>{value}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardRow: {
    paddingVertical: 2,
    flexDirection: 'row',
  },
  cardRowIcon: {
    marginRight: 10,
  },
  cardRowBody: {
    flex: 1,
    justifyContent: 'center',
  },
  cardRowTitle: {
    fontFamily: 'Rubik-Medium',
  },
  cardRowValue: {
    fontFamily: 'Rubik-Medium',
    color: MEDIUM,
    fontSize: 12,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: LIGHT,
  },
});
