import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";

//UTIL
import { moderateScale, numberFormat } from "toktokload/helper";

//IMAGES
import { check_fill_icon } from "toktokload/assets/icons";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import moment from "moment";

export const ReceiptDetails = ({ route }) => {

  const { receipt } = route.params;
  const { amount, referenceNumber, destinationNumber, createdAt, discount } = receipt;
  const transactionDateTime = `${moment(createdAt).format("lll")}`;

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
          <Text style={styles.description}>PHP {numberFormat(amount)}</Text>
        </View>
        { discount > 0 && (
          <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
            <Text style={styles.title}>Discount </Text>
            <Text style={styles.description}>PHP {numberFormat(discount)}</Text>
          </View> 
        )}
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Status </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={check_fill_icon} style={{ width: moderateScale(15), height: moderateScale(15) }} />
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
    fontSize: FONT_SIZE.M
  },
  description: {
    fontSize: FONT_SIZE.M,
    flexShrink: 1,
    textAlign: "right",
    marginLeft: moderateScale(7)
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
  colorGreen: {
    color: "#1AD74F",
  }
})
