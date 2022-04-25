import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, Image } from "react-native";

//UTIL
import { moderateScale } from "toktokbills/helper";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { bills_logo } from "toktokbills/assets/images";

export const Header = () => {
  console.log(bills_logo)
  return (
    <View style={{ alignItems: "center" }}>
      <Image source={bills_logo} style={styles.logo} />
      <View style={styles.logoTextContainer}>
        <Text>
          <Text style={styles.headerText} >Thank you for using </Text>
          <Text style={styles.toktokText}>toktok</Text>
          <Text style={styles.loadText}>bills!</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: moderateScale(60),
    height: moderateScale(60),
    marginBottom: moderateScale(20)
  },
  logoTextContainer: {
    flexDirection: "row",
  },
  headerText: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  toktokText: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  loadText: {
    color: COLOR.YELLOW,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
})
