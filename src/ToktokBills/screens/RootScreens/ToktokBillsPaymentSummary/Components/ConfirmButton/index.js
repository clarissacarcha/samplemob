import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native'

//UTIL
import { moderateScale, numberFormat } from "toktokbills/helper";
import { ErrorUtility } from 'toktokbills/util';

//GRAPHQL & HOOKS
import { useAccount } from 'toktokbills/hooks'
import { useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { POST_TOKTOKWALLET_REQUEST_MONEY } from 'toktokbills/graphql/model';
import { usePrompt } from 'src/hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert, useThrottle } from 'src/hooks'

//COMPONENTS
import { OrangeButton, SplashLoading } from "toktokbills/components";
import { AlertOverlay } from 'src/components';

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

export const ConfirmButton = ({ paymentData }) => {

  const { tokwaAccount } = useAccount();
  const alert = useAlert();
  const prompt = usePrompt();
  const navigation = useNavigation();
  const { firstField, secondField, amount, email, billType, convenienceFee, billItemSettings } = paymentData;
  const totalAmount = parseFloat(amount) + parseFloat(convenienceFee);
  const tokwaBalance = tokwaAccount?.wallet?.balance;
  const { termsAndConditions, paymentPolicy1, paymentPolicy2 } = billItemSettings.itemDocumentDetails;
 
  const [postToktokWalletRequestMoney, {loading, error}] = useMutation(POST_TOKTOKWALLET_REQUEST_MONEY, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        title: ""
      });
    },
    onCompleted: ({ postToktokWalletRequestMoney }) => {
      let paymentSummary = { 
        paymentData,
        totalAmount,
        tokwaBalance,
        requestMoneyDetails: postToktokWalletRequestMoney.data
      }
      navigation.navigate("ToktokBillsEnterPinCode", { paymentSummary })
    }
  })

  const onPressConfirm = () => {
    postToktokWalletRequestMoney({
      variables: {
        input: {
          amount: parseFloat(totalAmount),
          note: "Bills payment",
          transactionType: "bills",
          details: {
            Biller: paymentData.billItemSettings.name,
            Category: paymentData.billType.name,
          }
        }
      }
    });
  }
 
  const checkIsDisabled = () => {
    return (parseFloat(totalAmount) > parseFloat(tokwaBalance))
  }

  const onPressThrottled = useThrottle(() => {
    onPressConfirm();
  }, 1000);

  const onPressTermsAndContidions = () => {
    navigation.navigate("ToktokWalletTermsConditions", { termsAndConditions })
  }
  
  return (
    <>
      <AlertOverlay visible={loading}/>
      <View style={styles.container}>
      <Text style={styles.terms}>
        <Text>Please read our </Text>
        <Text style={styles.tnc} onPress={onPressTermsAndContidions}>Terms and Condition </Text>
        <Text>before you proceed with your transaction</Text>
      </Text>
      { !!paymentPolicy1 && <Text style={styles.paymentPolicy1}>*{paymentPolicy1}</Text> }
      { !!paymentPolicy2 && <Text style={styles.paymentPolicy2}>*{paymentPolicy2}</Text> }
      <OrangeButton
        onPress={onPressThrottled}
        disabled={checkIsDisabled()}
        label="Confirm"
      />
      </View>
    </>
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
    textAlign: "center",
    marginBottom: moderateScale(15),
  },
  tnc: {
    color: "#F6841F"
  },
  paymentPolicy1: {
    color: "#F6841F",
    fontSize: FONT_SIZE.S,
    textAlign: "center",
  },
  paymentPolicy2: {
    color: "#F6841F",
    fontSize: FONT_SIZE.S,
    textAlign: "center",
    marginBottom: moderateScale(30),
    marginTop: moderateScale(10)
  },
})
