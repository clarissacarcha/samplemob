import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale, moderateScale} from 'toktokfood/helper/scale';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

export const TransactionTabs = ({ focusTab, setFocusTab }) => {

  const navigation = useNavigation();

  return (
    <View style={styles.filterContainer}>
      <View style={styles.filterWrapper}>
        <TouchableWithoutFeedback onPress={() => setFocusTab(1)}>
          <View style={[styles.filterButton, {borderBottomWidth: focusTab === 1 ? 2 : 0}]}>
            <Text style={styles.filterText}>Ongoing</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setFocusTab(2)}>
          <View
            style={[styles.filterButton, {marginHorizontal: scale(18), borderBottomWidth: focusTab === 2 ? 2 : 0}]}>
            <Text style={styles.filterText}>Completed</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setFocusTab(3)}>
          <View style={[styles.filterButton, { borderBottomWidth: focusTab === 3 ? 2 : 0}]}>
            <Text style={styles.filterText}>Cancelled</Text>
          </View>
        </TouchableWithoutFeedback>
        {/* <TouchableWithoutFeedback onPress={() => setFocusTab(4)}>
          <View style={[styles.filterButton, {marginHorizontal: scale(18), borderBottomWidth: focusTab === 4 ? 2 : 0}]}>
            <Text style={styles.filterText}>Decline</Text>
          </View>
        </TouchableWithoutFeedback> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    height: 50,
    paddingHorizontal: moderateScale(14),
  },
  filterWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.LIGHT,
  },
  filterButton: {
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: COLOR.ORANGE,
  },
  filterText: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
  },
});

