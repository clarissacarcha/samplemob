import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";

//UTIL
import { moderateScale, numberFormat } from "toktokload/helper";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

export const ReceiptDetails = ({ paymentData, refNum = 12345678910 }) => {

  const { accountNo, accountName, amount, email, billerType, convenienceFee } = paymentData;
  const totalAmount = parseInt(amount) + convenienceFee;

  return (
    <>
      <View style={styles.line} />
      <View style={{ paddingHorizontal: moderateScale(30), marginTop: moderateScale(15) }}>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Service Reference Number: </Text>
          <Text style={styles.description}>{refNum}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Transaction Date and Time: </Text>
          <Text style={styles.description}>Oct 20, 2021 - 11:00 AM</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Account number: </Text>
          <Text style={styles.description}>{accountNo}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Account name: </Text>
          <Text style={styles.description}>{accountName}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Biller: </Text>
          <View style={{ justifyContent: "flex-end" }}>
            <Image source={billerType.logo} style={styles.logo} />
          </View>
        </View>
      </View>
      <View style={styles.line} />
      <View style={{ paddingHorizontal: moderateScale(30), marginTop: moderateScale(15) }}>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Payment amount: </Text>
          <Text style={styles.description}>₱ {numberFormat(amount)}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Convenience Fee: </Text>
          <Text style={styles.description}>₱ {numberFormat(convenienceFee)}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Total Amount: </Text>
          <Text style={styles.description}>₱ {numberFormat(totalAmount)}</Text>
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
    alignItems: "center"
  },
  marginBottom15: {
    marginBottom: moderateScale(15)
  },
  line: {
    height: 1,
    backgroundColor: "#F6841F",
    marginVertical: moderateScale(20)
  },
  logo: {
    width: moderateScale(80),
    height: moderateScale(50),
    resizeMode: "contain"
  }
})
