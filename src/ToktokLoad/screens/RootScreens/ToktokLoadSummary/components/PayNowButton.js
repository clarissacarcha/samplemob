import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native'

//UTIL
import { moderateScale } from "toktokload/helper";

//COMPONENTS
import { OrangeButton, PromptModal } from "src/ToktokLoad/components";
import { VerifyContext } from "./VerifyContextProvider";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

export const PayNowButton = ({ amount }) => {

  const navigation = useNavigation();
  const { toktokWallet } = useContext(VerifyContext);
  const [showPrompt, setShowPrompt] = useState({ show: false, title: "", message: "", event: "" });

  const onPressPayNow = () => {
    //success
    setShowPrompt({
      show: true,
      title: "Thank you",
      message: `₱ ${amount.toFixed(2)} prepaid credit was loaded to your mobile number`,
      event: "success"
    });
    // error
    // setShowPrompt({
    //   show: true,
    //   title: "Transaction Failed",
    //   message: "Please try again",
    //   event: "error"
    // });
  }

  return (
    <View style={styles.container}>
      <PromptModal
        visible={showPrompt.show}
        onPress={() => {
          setShowPrompt({ show: false });
          navigation.navigate("ToktokLoadReceipt");
        }}
        title={showPrompt.title}
        message={showPrompt.message}
        event={showPrompt.event}
      />
      <Text style={styles.terms}>
        <Text>Please read our </Text>
        <Text style={styles.paymentPolicy}>Payment Policy </Text>
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
