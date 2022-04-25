import React, { useState } from 'react'
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { moderateScale } from 'toktokbills/helper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useThrottle } from 'src/hooks'

import { LoadingIndicator } from 'toktokbills/components';

import CONSTANTS from 'common/res/constants'
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW} = CONSTANTS
const {width,height} = Dimensions.get("window")

export const Biller = ({
  item,
  index
})=> {
  const navigation = useNavigation();
  const route = useRoute();
  const [imageLoading, setImageLoading] = useState(true);

  const onPress = ()=> {
    navigation.navigate("ToktokBillsPaymentProcess" , {
      billItemId: item.id,
      billType: route.params.billType
    })
  }

  const onThrottledPress = useThrottle(onPress , 2000)
  
  return (
    <TouchableOpacity
      onPress={onThrottledPress}
      style={styles.container}
    >
      <View style={styles.item}>
        <View style={{ justifyContent: "center" }}> 
          { imageLoading && (
            <View style={{ position: "absolute", right: 0, left: 0 }}>
              <LoadingIndicator isLoading={true} size="small" />
            </View>
          )}
          <Image
            source={{ uri: item.logo }}
            style={styles.itemLogo}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>
        <Text style={styles.itemName}>{item.descriptions}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(15),
  },
  itemLogo: {
    height: moderateScale(50),
    width: moderateScale(70),
    resizeMode: "contain"
  },
  itemName: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(FONT_SIZE.M),
    flexShrink: 1,
    marginLeft: moderateScale(15),
  }
})