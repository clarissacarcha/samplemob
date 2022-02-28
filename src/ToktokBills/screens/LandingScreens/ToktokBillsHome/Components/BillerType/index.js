import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { moderateScale } from 'toktokbills/helper';
import { useNavigation } from '@react-navigation/native';
import { useThrottle } from 'src/hooks';

import { LoadingIndicator } from 'toktokbills/components';

import CONSTANTS from 'common/res/constants';
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW} = CONSTANTS;
const {width,height} = Dimensions.get("window");

export const BillerType = ({ item, index })=> {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);

  const onPress = ()=> {
    navigation.navigate("ToktokBiller" , {billType: item})
  }

  const onThrottledPress = useThrottle(onPress , 2000)

  return (
    <TouchableOpacity
      onPress={onThrottledPress}
      style={styles.container}
      activeOpacity={.8}
    >
      <View style={styles.item}>
        <View style={{ justifyContent: "center" }}>
          { imageLoading && (
            <View style={{ position: "absolute", right: 0, left: 0 }}>
              <LoadingIndicator isLoading={true} size="small" />
            </View>
          )}
          <Image
            source={{ uri: item.icon }}
            style={styles.itemLogo}
            // onProgress={progress => console.log( Math.abs(progress.nativeEvent.loaded / progress.nativeEvent.total))}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: width * .315,
    width: width * .315,
    justifyContent:"center",
  },
  item: {
    flex: 1,
    justifyContent:"center",
    alignItems: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: "white",
    borderRadius: 5,
    padding: moderateScale(10)
  },
  itemLogo: {
    height: moderateScale(50),
    width: moderateScale(50)
  },
  itemName: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(FONT_SIZE.M),
    textAlign:"center",
    marginTop: moderateScale(5)
  }
})