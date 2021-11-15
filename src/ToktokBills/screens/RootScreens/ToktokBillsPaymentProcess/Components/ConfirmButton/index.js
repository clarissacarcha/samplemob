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

export const ConfirmButton = ({ }) => {

  const prompt = usePrompt();
  const navigation = useNavigation();
  const {
    toktokWallet,
    accountNo,
    accountName,
    amount,
    email,
    emailError,
    accountNoError,
    amountError
  } = useContext(VerifyContext);

  const onPressConfirm = () => {
    navigation.navigate("ToktokBillsEnterOTP")
  }
 
  const checkIsDisabled = () => {
    return (parseFloat(amount) > parseFloat(toktokWallet?.balance))
      || !accountName || !accountNo || emailError || accountNoError || amountError
  }

  return (
    <View style={styles.container}>
      <Text style={styles.terms}>
        <Text>Please read our </Text>
        <Text style={styles.paymentPolicy}>Payment Policy</Text>
        <Text> and </Text>
        <Text style={styles.paymentPolicy}>Terms and Condition </Text>
        <Text>before you proceed with your transaction</Text>
      </Text>
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
    marginBottom: moderateScale(15),
    textAlign: "center"
  },
  paymentPolicy: {
    color: "#F6841F"
  }
})
