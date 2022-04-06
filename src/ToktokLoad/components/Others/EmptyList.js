import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { moderateScale } from "toktokload/helper";

//FONTS & COLORS
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

export const EmptyList = ({ imageSrc, label, message })=> {
  return (
    <View style={styles.container}>
      <Image source={imageSrc} style={styles.img} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(30)
  },
  img: {
    width: moderateScale(180),
    height: moderateScale(180),
    resizeMode: "contain"
  },
  label: {
    color: "#F6841F",
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
    textAlign: "center",
    paddingTop: moderateScale(10)
  },
  message: {
    fontSize: FONT_SIZE.M,
    marginTop: moderateScale(8),
    textAlign: "center"
  }
})  