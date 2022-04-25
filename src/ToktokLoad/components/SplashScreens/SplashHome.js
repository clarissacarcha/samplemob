import React from 'react'
import { View , StyleSheet , Image , Dimensions } from 'react-native'
import { toktokload_sq_logo } from 'toktokload/assets/images'
import { verticalScale } from 'toktokwallet/helper'

const {width,height} = Dimensions.get("window")

export const SplashHome = ()=> (
  <View style={styles.container}>
    <Image
      style={styles.loadLogo}
      source={toktokload_sq_logo}
      resizeMode="contain"
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: "#FBFAE3"
  },
  loadLogo: {
    height: width * 0.4,
    width: width * 0.4,
    marginTop: 20,
  },
})