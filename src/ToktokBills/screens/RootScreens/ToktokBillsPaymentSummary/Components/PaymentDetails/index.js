import React, { useContext, useRef, useState, useEffect } from 'react'
import { View, Text, Dimensions, StyleSheet, TextInput, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useThrottle } from 'src/hooks'
import validator from 'validator'
import { LoadingIndicator } from 'toktokbills/components';

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
  const [logo, setLogo] = useState({ height: 0, width: 0 });
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    Image.getSize(billItemSettings.logo, (width, height) => {
      let size = height > width ? height - width : width - height;
      if(size > 10){
        if(width > moderateScale(80) || height > moderateScale(40)){
          setLogo({ width: 80, height: 50 });
        } else {
          setLogo({ width, height });
        }
      } else {
        setLogo({ width: 50, height: 50 });
      }
    })
  }, [])
  
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
          { imageLoading && (
            <View style={{ position: "absolute", right: 0, bottom: 0, top: 0 }}>
              <LoadingIndicator isLoading={true} size="small" />
            </View>
          )}
          <Image
            source={{ uri: billItemSettings.logo }}
            style={{ width: moderateScale(logo.width), height: moderateScale(logo.height), resizeMode: "contain" }}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
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
    width: null,
    flex: 1
  }
})