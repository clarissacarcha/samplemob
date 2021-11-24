import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native'

//UTIL
import { moderateScale } from "toktokload/helper";
import { ErrorUtility } from 'toktokload/util';

//COMPONENTS
import { OrangeButton } from "src/ToktokLoad/components";
import { VerifyContext } from "../VerifyContextProvider";
import { AlertOverlay } from 'src/components';

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

//GRAPHQL & HOOKS
import { useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { POST_TOKTOKWALLET_REQUEST_MONEY } from 'toktokload/graphql/model';
import { usePrompt, useAlert, useThrottle } from 'src/hooks';
import { onErrorAlert } from 'src/util/ErrorUtility';
export const PayNowButton = ({ loadDetails, mobileNumber }) => {

  const prompt = usePrompt();
  const navigation = useNavigation();
  const { toktokWallet } = useContext(VerifyContext);
  const { amount }  = loadDetails;
  const tokwaBalance = parseFloat(toktokWallet?.balance);

  const [postToktokWalletRequestMoney, {loading, error}] = useMutation(POST_TOKTOKWALLET_REQUEST_MONEY, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      console.log(error)
      // ErrorUtility.StandardErrorHandling({
      //   error,
      //   navigation,
      //   prompt,
      //   title: ""
      // });
    },
    onCompleted: ({ postToktokWalletRequestMoney }) => {
      let paymentSummary = { 
        loadDetails,
        tokwaBalance,
        mobileNumber,
        requestMoneyDetails: postToktokWalletRequestMoney.data
      }
      console.log(paymentSummary)

      navigation.navigate("ToktokLoadEnterPinCode", { paymentSummary })
    }
  });
 
  const onPressPayNow = () => {
    postToktokWalletRequestMoney({
      variables: {
        input: {
          amount: parseFloat(amount),
          note: "Load Payment",
          transactionType: "load",
          details: {
            Load: loadDetails.name,
            Network: loadDetails.networkDetails.name
          }
        }
      }
    });
  }

  const onPressThrottled = useThrottle(() => {
    onPressPayNow();
  }, 1000);

  return (
    <>
      <AlertOverlay visible={loading}/>
      <View style={styles.container}>
        <Text style={styles.terms}>
          <Text>Please read our </Text>
          <Text style={styles.paymentPolicy}>Terms and Conditions </Text>
          <Text>before you proceed with your transaction</Text>
        </Text>
        <OrangeButton
          onPress={onPressThrottled}
          disabled={parseFloat(amount) > tokwaBalance}
          label="Pay Now"
        />
      </View>
    </>
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
