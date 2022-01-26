import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { moderateScale } from 'toktokbills/helper';
import { useNavigation } from '@react-navigation/native';
import { useThrottle } from 'src/hooks';

import CONSTANTS from 'common/res/constants';
import moment from 'moment';
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW} = CONSTANTS;
const {width,height} = Dimensions.get("window");

export const BillerType = ({ item, index })=> {
  const navigation = useNavigation();
  const onPress = ()=> {
    navigation.navigate("ToktokBiller" , {billType: item})
  }

  const onThrottledPress = useThrottle(onPress , 2000)
  console.log(item.billerDetails)
  return (
    <TouchableOpacity
      onPress={onThrottledPress}
      style={styles.container}
      activeOpacity={.8}
    >
      <View style={styles.item}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.itemName}>{item.billerDetails.descriptions}</Text>
          <Text style={styles.amount}>PHP{item.amount}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.itemName}>{item.senderName}</Text>
          <Text style={styles.dateTime}>{moment(item.createdAt).format("lll")}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent:"center",
    borderBottomColor: "#F6841F",
    borderBottomWidth: 0.5,
    paddingHorizontal: moderateScale(15)
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
    marginTop: moderateScale(5),
    color: "#F6841F"
  },
  dateTime: {
    fontSize: moderateScale(FONT_SIZE.M),
    marginTop: moderateScale(5),
    color: "#929191"
  },
  amount: {
    fontSize: moderateScale(FONT_SIZE.M),
    marginTop: moderateScale(5),
  },
})