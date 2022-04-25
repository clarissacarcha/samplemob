import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, Image } from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { load_logo } from "src/ToktokLoad/assets/images";

export const Header = ({ mobileNumber }) => {

  return (
    <View style={{ alignItems: "center" }}>
      {/* <Image source={load_logo} style={styles.logo} />
      <View style={styles.logoTextContainer}>
        <Text>
          <Text style={styles.headerText} >Thank you for using </Text>
          <Text style={styles.toktokText}>toktok</Text>
          <Text style={styles.loadText}>load!</Text>
        </Text>
      </View> */}
      <Text style={styles.headerText}>Successfully loaded to</Text>
      <Text style={styles.mobile}>{mobileNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
    color: "#F6841F",
    paddingTop: moderateScale(30)
  },
  mobile: {
    fontSize: FONT_SIZE.XL,
    padding: moderateScale(10),
  },
})
