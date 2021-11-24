import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native'

//UTIL
import { moderateScale, numberFormat } from "toktokbills/helper";
import { usePrompt } from 'src/hooks'

//COMPONENTS
import { OrangeButton } from "toktokbills/components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { VerifyContext } from "../VerifyContextProvider";

export const ConfirmButton = ({ billType, billItemSettings = {}, tokwaBalance = 0 }) => {

  const prompt = usePrompt();
  const navigation = useNavigation();
  const {
    firstField,
    firstFieldError,
    secondField,
    secondFieldError,
    amount,
    email,
    emailError,
    amountError
  } = useContext(VerifyContext);
  const { commissionRateDetails, itemDocumentDetails } = billItemSettings;
  const convenienceFee = commissionRateDetails?.providerOnTopValue + commissionRateDetails?.systemOnTopValue; //CONVENIENCE FEE

  const onPressConfirm = () => {
    let paymentData = {
      firstField,
      secondField,
      amount,
      email,
      billType,
      convenienceFee,
      billItemSettings
    }
    navigation.navigate("ToktokBillsPaymentSummary", { paymentData })
  }
 
  const checkIsDisabled = () => {
    return !firstField || !secondField || firstFieldError || secondFieldError || emailError || !amount ||amountError
  }

  const onPressTermsAndContidions = () => {
    let { termsAndConditions } = itemDocumentDetails
    navigation.navigate("ToktokWalletTermsConditions", { termsAndConditions })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.terms}>
        <Text>Please read our </Text>
        <Text style={styles.tnc} onPress={onPressTermsAndContidions}>Terms and Condition </Text>
        <Text>before you proceed with your transaction</Text>
      </Text>
      <Text style={styles.paymentPolicy}>*Payments made beyond 8:00 PM will be posted the next day</Text>
      <OrangeButton
        onPress={onPressConfirm}
        disabled={checkIsDisabled()}
        label="Confirm"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    backgroundColor: "white",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(20)
  },
  terms: {
    textAlign: "center"
  },
  tnc: {
    color: "#F6841F"
  },
  paymentPolicy: {
    color: "#F6841F",
    fontSize: FONT_SIZE.S,
    textAlign: "center",
    marginVertical: moderateScale(15),
  }
})
