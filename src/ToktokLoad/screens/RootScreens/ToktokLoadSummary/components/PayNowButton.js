import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native'

//UTIL
import { moderateScale } from "toktokload/helper";

//COMPONENTS
import { OrangeButton } from "src/ToktokLoad/components";
import { VerifyContext } from "./VerifyContextProvider";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

//HOOKS
import { usePrompt } from 'src/hooks';

export const PayNowButton = ({ amount }) => {

  const prompt = usePrompt();
  const navigation = useNavigation();
  const { toktokWallet } = useContext(VerifyContext);

  const onPressPayNow = () => {
    //success
    prompt({
      type: "success",
      title: "Thank you",
      message: `₱ ${amount.toFixed(2)} prepaid credit was loaded to your mobile number`,
      onPress: ()=> { navigation.navigate("ToktokLoadReceipt") }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.terms}>
        <Text>Please read our </Text>
        <Text style={styles.paymentPolicy}>Terms and Conditions </Text>
        <Text>before you proceed with your transaction</Text>
      </Text>
      <OrangeButton
        onPress={onPressPayNow}
        disabled={amount > toktokWallet?.balance}
        label="Pay Now"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    backgroundColor: "#F7F7FA",
    paddingHorizontal: moderateScale(30),
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
