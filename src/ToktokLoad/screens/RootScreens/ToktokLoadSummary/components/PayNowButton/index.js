import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native'

//UTIL
import { moderateScale } from "toktokload/helper";
import { ErrorUtility } from 'toktokload/util';

//COMPONENTS
import { OrangeButton } from "src/ToktokLoad/components";
import { AlertOverlay } from 'src/components';

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

//GRAPHQL & HOOKS
import { useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { POST_TOKTOKWALLET_REQUEST_MONEY } from 'toktokload/graphql/model';
import { usePrompt, useAlert, useThrottle } from 'src/hooks';
import { onErrorAlert } from 'src/util/ErrorUtility';
import { useAccount } from 'toktokwallet/hooks';
import { useSelector } from 'react-redux';

export const PayNowButton = ({ loadDetails, mobileNumber }) => {

  const { user } = useSelector((state) => state.session);
  const prompt = usePrompt();
  const navigation = useNavigation();
  const { tokwaAccount, getMyAccount } = useAccount();
  const { amount, commissionRateDetails }  = loadDetails;
  const totalAmount = parseFloat(amount) + parseFloat(commissionRateDetails.systemServiceFee);
  const tokwaBalance = user.toktokWalletAccountId ? parseFloat(tokwaAccount?.wallet?.balance) : 0;

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
        loadDetails,
        tokwaBalance,
        mobileNumber,
        requestMoneyDetails: postToktokWalletRequestMoney.data
      }
      navigation.navigate("ToktokLoadEnterPinCode", { paymentSummary })
    }
  });
 
  const onPressPayNow = () => {
    postToktokWalletRequestMoney({
      variables: {
        input: {
          amount: parseFloat(totalAmount),
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

  const onPressTermsAndContidions = () => {
    let { termsAndConditions } = loadDetails;
    navigation.navigate("ToktokLoadTermsAndConditions", { termsAndConditions });
  }

  return (
    <>
      <AlertOverlay visible={loading}/>
      <View style={styles.container}>
        <Text style={styles.terms}>
          <Text>
            Please review the accuracy of the details provided and read our
          </Text>
          <Text style={styles.paymentPolicy} onPress={onPressTermsAndContidions}> Terms and Conditions </Text>
          <Text>before you proceed with your transaction.</Text>
        </Text>
        <OrangeButton
          onPress={onPressThrottled}
          disabled={parseFloat(totalAmount) > tokwaBalance}
          label="Pay Now"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16)
  },
  terms: {
    fontSize: FONT_SIZE.M,
    marginBottom: moderateScale(15),
  },
  paymentPolicy: {
    color: "#F6841F"
  },
  review: {
    marginVertical: moderateScale(15),
  },
})
