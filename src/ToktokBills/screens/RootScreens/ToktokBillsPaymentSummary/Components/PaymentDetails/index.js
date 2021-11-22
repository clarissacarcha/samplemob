import React, { useContext, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, TextInput, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useThrottle } from 'src/hooks'
import validator from 'validator'

//HELPER
import { moderateScale, formatAmount, numberFormat } from 'toktokbills/helper'

// COLORS AND FONTS
import CONSTANTS from 'common/res/constants';
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW, SIZE} = CONSTANTS
const {width,height} = Dimensions.get("window")

export const PaymentDetails = ({ paymentData })=> {

  const navigation = useNavigation();
  const { firstField, secondField, amount, email, billType, convenienceFee, billItemSettings } = paymentData;
  const totalAmount = parseInt(amount) + convenienceFee;
  console.log(billType)
  return (
    <>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Account number: </Text>
        <Text style={styles.description}>{firstField}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Account name: </Text>
        <Text style={styles.description}>{secondField}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Biller: </Text>
        <View style={{ justifyContent: "flex-end" }}>
          <Image source={{ uri: billItemSettings.logo }} style={styles.logo} />
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Payment amount: </Text>
        <Text style={styles.description}>₱ {numberFormat(amount)}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Convenience Fee: </Text>
        <Text style={styles.description}>₱ {numberFormat(convenienceFee)}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Total Amount: </Text>
        <Text style={styles.description}>₱ {numberFormat(totalAmount)}</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(30),
    paddingVertical: moderateScale(25),
    borderBottomColor: "#F6841F",
    borderBottomWidth: 0.5
  },
  label: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    color: "#F6841F"
  },
  description: {
    textAlign: "right",
    flexShrink: 1,
    fontSize: FONT_SIZE.M
  },
  logo: {
    width: moderateScale(80),
    height: moderateScale(50),
    resizeMode: "contain"
  }
})