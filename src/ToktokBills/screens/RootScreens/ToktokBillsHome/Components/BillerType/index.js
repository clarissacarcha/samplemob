import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { moderateScale } from 'toktokbills/helper';
import { useNavigation } from '@react-navigation/native';
import { useThrottle } from 'src/hooks';

import CONSTANTS from 'common/res/constants';
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW} = CONSTANTS;
const {width,height} = Dimensions.get("window");

export const BillerType = ({ item, index })=> {
  const navigation = useNavigation();
  const onPress = ()=> {
    navigation.navigate("ToktokBiller" , {billType: item})
  }

  const onThrottledPress = useThrottle(onPress , 2000)
 
  return (
    <TouchableOpacity
      onPress={onThrottledPress}
      style={styles.container}
    >
      <View style={styles.item}>
        <Image
          source={{ uri: item.icon }}
          style={styles.itemLogo}
        />
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: moderateScale(118.5),
    width: moderateScale(118.5),
    justifyContent:"center",
  },
  item: {
    flex: 1,
    justifyContent:"center",
    alignItems: "center",
    margin: 5,
    ...SHADOW,
    backgroundColor: "white",
    borderRadius: 5
  },
  itemLogo: {
    height: moderateScale(60),
    width: moderateScale(60)
  },
  itemName: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(FONT_SIZE.M),
    textAlign:"center",
    marginTop: moderateScale(5)
  }
})