import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

// HELPER & UTIL
import { moderateScale, numberFormat } from 'toktokbills/helper';
import { useThrottle } from 'src/hooks';

//COMPONENTS
import { Details } from './Details';

import CONSTANTS from 'common/res/constants';
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW} = CONSTANTS;

const {width,height} = Dimensions.get("window");

export const NotificationItem = ({ item, index })=> {

  const navigation = useNavigation();

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={.8}
      >
        <View style={styles.item}>
          <View style={styles.contentContainer}>
            <Text style={styles.itemName}>Bills Payment</Text>
            <Text style={styles.dateTime}>{moment(item.createdAt).format("lll")}</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.name}>{item.body}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
    
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent:"center",
    borderBottomColor: "#F6841F",
    borderBottomWidth: 0.5,
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(5)
  },
  item: {
    flex: 1,
    // alignItems: "center",
    margin: 5,
    backgroundColor: "white",
    borderRadius: 5,
    padding: moderateScale(10)
  },
  itemLogo: {
    height: moderateScale(50),
    width: moderateScale(50)
  },
  itemName: {
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(FONT_SIZE.M),
    color: "#F6841F",
    flexShrink: 1,
  },
  dateTime: {
    fontSize: moderateScale(FONT_SIZE.S),
    color: "#929191"
  },
  amount: {
    fontSize: moderateScale(FONT_SIZE.M),
    color: "#EC4A4E"
  },
  name: {
    fontSize: moderateScale(FONT_SIZE.M),
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
})