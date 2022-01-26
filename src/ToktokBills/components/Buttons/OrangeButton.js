import React from 'react'
import {View,Text, TouchableOpacity, StyleSheet} from 'react-native'
import CONSTANTS from 'common/res/constants'
import { useThrottle } from 'src/hooks'
//util
import { moderateScale } from "toktokbills/helper";

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

export const OrangeButton = ({label, disabled, onPress, btnStyle})=> {

  const onThrottledPress = useThrottle(onPress , 200)

  return (
    <TouchableOpacity
      onPress={onThrottledPress}
      disabled={disabled}
      style={[
        styles.container,
        {  backgroundColor: disabled ? "#DADADA" : "#F6841F" },
        btnStyle
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent:"center",
    alignItems:"center",
    height: moderateScale(50),
    borderRadius: 5
  },
  label: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    color: "white"
  }
})