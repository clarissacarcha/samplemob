import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native'

//UTIL
import { moderateScale, numberFormat } from "toktokbills/helper";
import { ErrorUtility } from 'toktokbills/util';

//COMPONENTS
import { OrangeButton } from "toktokbills/components";
import { AlertOverlay } from 'src/components';

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { VerifyContext } from "../VerifyContextProvider";

//GRAPHQL & HOOKS
import { useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { POST_BILLS_VALIDATE_TRANSACTION } from 'toktokbills/graphql/model';
import { useAccount } from 'toktokwallet/hooks';
import { usePrompt } from 'src/hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { useSelector } from 'react-redux';

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
  const { commissionRateDetails, itemDocumentDetails, providerId } = billItemSettings;
  const { termsAndConditions, paymentPolicy1, paymentPolicy2 } = itemDocumentDetails;

  //CONVENIENCE FEE
  const convenienceFee = parseFloat(commissionRateDetails?.providerServiceFee) + parseFloat(commissionRateDetails?.systemServiceFee); 

  const [postBillsValidateTransaction, {loading, error}] = useMutation(POST_BILLS_VALIDATE_TRANSACTION, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        title: ""
      });
    },
    onCompleted: ({ postBillsValidateTransaction }) => {
      let { referenceNumber } = postBillsValidateTransaction;
      let paymentData = {
        firstField,
        secondField,
        amount,
        email,
        billType,
        convenienceFee,
        billItemSettings,
        referenceNumber
      }
      navigation.navigate("ToktokBillsPaymentSummary", { paymentData })
    }
  })

  const onPressConfirm = () => {
    postBillsValidateTransaction({
      variables: {
        input: {
          name: billItemSettings.name,
          destinationNumber: firstField,
          destinationIdentifier: secondField,
          type: 1,
          amount: parseFloat(amount),
          providerId
        }
      }
    })
  }
 
  const checkIsDisabled = () => {
    return !firstField || !secondField || firstFieldError || secondFieldError || emailError || !amount ||amountError
  }

  const onPressTermsAndContidions = () => {
    navigation.navigate("ToktokBillsTermsAndConditions", { termsAndConditions })
  }

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading}/>
      <Text style={styles.terms}>
        <Text>Please read our </Text>
        <Text style={styles.tnc} onPress={onPressTermsAndContidions}>Terms and Conditions </Text>
        <Text>before you proceed with your transaction</Text>
      </Text>
      { !!paymentPolicy1 && <Text style={styles.paymentPolicy1}>*{paymentPolicy1}</Text> }
      { !!paymentPolicy2 && <Text style={styles.paymentPolicy2}>*{paymentPolicy2}</Text> }
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
