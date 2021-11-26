import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import moment from "moment";

export const ReceiptDetails = ({ route }) => {

  const { receipt } = route.params;
  const { amount, referenceNumber, destinationNumber, createdAt } = receipt;
  const transactionDateTime = moment(createdAt).format("lll");

  return (
    <>
      <View style={styles.line} />
      <View style={{ paddingHorizontal: moderateScale(30), marginTop: moderateScale(15) }}>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Service Reference Number </Text>
          <Text style={styles.description}>{referenceNumber}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Transaction Date and Time </Text>
          <Text style={styles.description}>{transactionDateTime}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Mobile Number </Text>
          <Text style={styles.description}>{destinationNumber}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Load Amount </Text>
          <Text style={styles.description}>{amount.toFixed(2)}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Discount </Text>
          <Text style={styles.description}>0.00</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Status </Text>
          <Text style={styles.description}>Success</Text>
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
    color: "black",
    fontSize: FONT_SIZE.M,
    flexShrink: 1,
    textAlign: "right"
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
    backgroundColor: "#F6841F",
    marginVertical: moderateScale(20)
  },
})
