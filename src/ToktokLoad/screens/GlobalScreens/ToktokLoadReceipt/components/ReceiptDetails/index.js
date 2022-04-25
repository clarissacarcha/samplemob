import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";

//UTIL
import { moderateScale, numberFormat, currencyCode } from "toktokload/helper";

//IMAGES
import { check_fill_icon } from "toktokload/assets/icons";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import moment from "moment";

export const ReceiptDetails = ({ route }) => {

  const { receipt } = route.params;
  const { amount, referenceNumber, destinationNumber, createdAt, discount, convenienceFee, loadDetails } = receipt;
  const transactionDateTime = `${moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A')}`;
  const totalAmount = parseFloat(amount) + parseFloat(convenienceFee);

  return (
    <>
      <View style={styles.line} />
      <View style={{ paddingHorizontal: moderateScale(30) }}>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Service Reference Number </Text>
          <Text style={styles.description}>{referenceNumber}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Transaction Date </Text>
          <Text style={styles.description}>{transactionDateTime}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={[styles.title, { textTransform: "capitalize" }]}>Load Provider </Text>
          <Text style={styles.description}>{loadDetails.networkDetails.name}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Total Amount </Text>
          <Text style={styles.description}>{currencyCode}{numberFormat(totalAmount)}</Text>
        </View>
        { discount > 0 && (
          <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
            <Text style={styles.title}>Discount </Text>
            <Text style={styles.description}>{currencyCode}{numberFormat(discount)}</Text>
          </View> 
        )}
        <View style={[ styles.bodyContainer ]}>
          <Text style={styles.title}>Status </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={check_fill_icon} style={styles.icon} />
            <Text style={[styles.description, styles.colorGreen]}>Success</Text>
          </View>
        </View>
      </View>
      <View style={styles.line} />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#F6841F",
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    width: "50%"
  },
  description: {
    fontSize: FONT_SIZE.M,
    flexShrink: 1,
    textAlign: "right",
    marginLeft: moderateScale(7)
  },
  bodyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  marginBottom15: {
    marginBottom: moderateScale(15)
  },
  line: {
    height: 1,
    backgroundColor: "#F6841F",
    marginVertical: moderateScale(20),
    marginHorizontal: moderateScale(16)
  },
  colorGreen: {
    color: "#198754",
  },
  icon: {
    width: moderateScale(15),
    height: moderateScale(15),
    tintColor: "#198754"
  }
})
