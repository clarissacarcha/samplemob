import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

export const SummaryDetails = ({ loadDetails, mobileNumber }) => {
  const { amount }  = loadDetails;

  return (
    <>
      <View style={{ paddingHorizontal: moderateScale(30), marginTop: moderateScale(15) }}>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Mobile Number</Text>
          <Text style={styles.description}>{mobileNumber}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Load Amount</Text>
          <Text style={styles.description}>PHP {amount.toFixed(2)}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Discount</Text>
          <Text style={styles.description}>PHP 0.00</Text>
        </View>
      </View>
      <View style={styles.line} />
      <View style={{ paddingHorizontal: moderateScale(30), paddingVertical: moderateScale(20) }}>
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>Total Amount</Text>
          <Text style={styles.description}>PHP {amount.toFixed(2)}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#F6841F",
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M
  },
  description: {
    color: "#707070",
    fontSize: FONT_SIZE.M,
  },
  bodyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  marginBottom15: {
    marginBottom: moderateScale(15)
  },
  line: {
    height: 1,
    backgroundColor: "#DDDDDD"
  },
})
