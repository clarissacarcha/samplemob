import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";

//UTIL
import { moderateScale, numberFormat, currencyCode } from "toktokload/helper";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

export const SummaryDetails = ({ loadDetails, mobileNumber, discount = 0 }) => {
  const { amount, commissionRateDetails }  = loadDetails;
  const totalAmount = parseFloat(amount) + parseFloat(commissionRateDetails.systemServiceFee);

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Load Amount</Text>
          <Text style={styles.description}>{currencyCode}{numberFormat(amount)}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Service Fee</Text>
          <Text style={styles.description}>{currencyCode}{numberFormat(commissionRateDetails.systemServiceFee)}</Text>
        </View>
        { discount > 0 && (
          <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
            <Text style={styles.title}>Discount</Text>
            <Text style={styles.description}>{currencyCode}{numberFormat(discount)}</Text>
          </View>
        )}
      </View>
      <View style={styles.line} />
      <View style={styles.totalAmountContainer}>
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>Total Amount</Text>
          <Text style={styles.description}>{currencyCode}{numberFormat(totalAmount)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#F6841F",
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  description: {
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
    height: 1.2,
    backgroundColor: "#F6841F"
  },
  totalAmountContainer: {
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(30),
  },
  container: {
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(15)
  },
  detailsContainer: {
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(10)
  }
})
