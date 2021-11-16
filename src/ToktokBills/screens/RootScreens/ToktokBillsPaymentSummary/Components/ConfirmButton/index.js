import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native'

//UTIL
import { moderateScale, numberFormat } from "toktokbills/helper";

//HOOKS
import { usePrompt } from 'src/hooks'
import { useAccount } from 'toktokbills/hooks'

//COMPONENTS
import { OrangeButton } from "toktokbills/components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

export const ConfirmButton = ({ paymentData, convenienceFee = 0 }) => {

  const { tokwaAccount } = useAccount();
  const navigation = useNavigation();
  const { accountNo, accountName, amount, email, billerType } = paymentData;
  const totalAmount = parseInt(amount) + convenienceFee;

  const onPressConfirm = () => {
    navigation.navigate("ToktokBillsEnterOTP", { paymentData })
  }
 
  const checkIsDisabled = () => {
    return (parseFloat(totalAmount) > parseFloat(tokwaAccount?.wallet?.balance))
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
