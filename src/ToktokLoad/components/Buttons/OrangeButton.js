import React from 'react'
import {View,Text, TouchableOpacity, StyleSheet} from 'react-native'
import CONSTANTS from 'common/res/constants'
//util
import { moderateScale } from "toktokload/helper";

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

export const OrangeButton = ({label, disabled, onPress})=> {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        {  backgroundColor: disabled ? "#F6841F70" : "#F6841F" }
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