import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { LoadingIndicator } from 'toktokbills/components';

//UTIL
import { moderateScale, numberFormat, pesoSign } from "toktokbills/helper";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import moment from "moment";

export const ReceiptDetails = ({ route }) => {

  const { receipt, paymentData } = route.params;
  const {
    senderMobileNumber,
    destinationNumber,
    destinationIdentifier,
    amount,
    email,
    billerDetails,
    convenienceFee,
    referenceNumber,
    createdAt
  } = receipt;
  const { firstFieldName, secondFieldName } = paymentData.billItemSettings;
  const totalAmount = parseInt(amount) + convenienceFee;
  const [logo, setLogo] = useState({ height: 0, width: 0 });
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    Image.getSize(billerDetails.logo, (width, height) => {
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
      <View style={styles.line} />
      <View style={{ paddingHorizontal: moderateScale(30), marginTop: moderateScale(15) }}>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Service Reference Number: </Text>
          <Text style={styles.description}>{referenceNumber}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Transaction Date and Time: </Text>
          <Text style={styles.description}>{moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A')}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>{firstFieldName}: </Text>
          <Text style={styles.description}>{destinationNumber}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>{secondFieldName}: </Text>
          <Text style={styles.description}>{destinationIdentifier}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>toktokwallet Account Number: </Text>
          <Text style={styles.description}>+{senderMobileNumber}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Biller: </Text>
          <View style={{ justifyContent: "flex-end" }}>
            { imageLoading && (
              <View style={{ position: "absolute", right: 0, bottom: 0, top: 0 }}>
                <LoadingIndicator isLoading={true} size="small" />
              </View>
            )}
            <Image
              source={{ uri: billerDetails.logo }}
              style={{ width: moderateScale(logo.width), height: moderateScale(logo.height), resizeMode: "contain" }}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
          </View>
        </View>
      </View>
      <View style={styles.line} />
      <View style={{ paddingHorizontal: moderateScale(30), marginTop: moderateScale(15) }}>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Payment amount: </Text>
          <Text style={styles.description}>{pesoSign} {numberFormat(amount)}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Convenience Fee: </Text>
          <Text style={styles.description}>{pesoSign} {numberFormat(convenienceFee)}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Total Amount: </Text>
          <Text style={styles.description}>{pesoSign} {numberFormat(totalAmount)}</Text>
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
