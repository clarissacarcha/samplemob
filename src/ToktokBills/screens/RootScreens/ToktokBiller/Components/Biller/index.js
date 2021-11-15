import React from 'react'
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { moderateScale } from 'toktokbills/helper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW} = CONSTANTS
const {width,height} = Dimensions.get("window")

import toktokwalletlogo from 'toktokwallet/assets/images/tokwa.png'

export const Biller = ({
  item,
  index
})=> {
  const navigation = useNavigation();
  const route = useRoute();

  const onPress = ()=> {
    navigation.navigate("ToktokBillsPaymentProcess" , {
      billerTypes: item,
      billerName: route.params.biller.name
    })
  }

  const onThrottledPress = useThrottle(onPress , 2000)

  return (
    <TouchableOpacity
      onPress={onThrottledPress}
      style={styles.container}
    >
      <View style={styles.item}>
        <Image
          source={toktokwalletlogo}
          style={styles.itemLogo}
        />
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
    ...SHADOW,
    backgroundColor: "white",
    borderRadius: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(5)
  },
  itemLogo: {
    height: moderateScale(70),
    width: moderateScale(70),
    resizeMode: "cover"
  },
  itemName: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(FONT_SIZE.M),
    flexShrink: 1,
    marginRight: moderateScale(15),
  }
})