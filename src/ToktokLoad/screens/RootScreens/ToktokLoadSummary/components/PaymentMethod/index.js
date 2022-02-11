import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from "react-native";
import {useNavigation} from '@react-navigation/native';

//HELPER
import { moderateScale, numberFormat } from 'toktokload/helper';

//COMPONENTS
import { LoadingIndicator } from "src/ToktokLoad/components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { wallet_icon } from "src/ToktokLoad/assets/icons";

//GRAPHQL & HOOKS
import { useAccount } from 'toktokwallet/hooks';
import { useSelector } from 'react-redux';

export const PaymentMethod = ({ loadDetails, onCashIn, kycStatus }) => {

  const { user } = useSelector((state) => state.session);
	const navigation = useNavigation();
  const { tokwaAccount } = useAccount({ isOnError: false });
  const { amount, commissionRateDetails }  = loadDetails;
  const totalAmount = parseFloat(amount) + parseFloat(commissionRateDetails.systemServiceFee);
  const tokwaBalance = user.toktokWalletAccountId ? tokwaAccount?.wallet?.balance : "0.00";

  const onPressTopUp = () => {
    navigation.navigate('ToktokWalletPaymentOptions', {
      amount: 0,
      onCashIn: onCashIn,
    });
  };

  const onPressCreateAccount = () => {
    navigation.navigate('ToktokWalletLoginPage'); //ToktokWalletVerification
  }
 
  const displayInsufficientBalance = () => {
    if(parseFloat(totalAmount) > parseFloat(tokwaBalance)) {
      return (
        <View style={styles.errorContainer}>
          <TouchableOpacity activeOpacity={1} onPress={onPressTopUp}>
            <Text style={styles.errorText}>
              {`Insufficient balance.\nPlease click here to cash in.`}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
    return
  }

  const displayNoToktokWalletAccount = () => {
    if(kycStatus == 2){
      return (
        <>
          <View style={{ paddingHorizontal: moderateScale(30) }}>
            <Text style={styles.pendingMessage}>
              We are currently assessing your application for toktokwallet. Kindly wait for confirmation.
            </Text>
          </View>
        </>
      )
    } else {
      return (
        <>
          <View style={{ paddingHorizontal: moderateScale(30) }}>
            <Text style={styles.noTokWaMessage}>
              Sorry, you don’t have a toktokwallet yet. Please create an account to proceed with payment.
            </Text>
          </View>
          <Text style={styles.createAccount} onPress={onPressCreateAccount}>
            Create toktokwallet account
          </Text>
        </>
      )
    }
  }


  return (
    <>
    	<View style={styles.container}>
        <View style={[ styles.bodyContainer, { alignItems: "center" } ]}>
          <Text style={styles.title}>Payment Method</Text>
          <View style={styles.shadow}>
            <View style={user.toktokWalletAccountId ? styles.tokwaButtonWithAccount : styles.tokwaButtonWithoutAccount}>
              <Image style={styles.walletIcon} source={wallet_icon} />
              <View style={styles.pmContainer}>
                <View style={styles.pmWrapper}>
                  <View style={styles.tokwaButtonTextWrapper}>
                    <Text style={styles.toktokText}>toktok</Text>
                    <Text style={styles.walletText}>wallet</Text>
                  </View>
                  { user.toktokWalletAccountId && (
                    <Text style={styles.balance}>
                      Balance: PHP {numberFormat(tokwaBalance)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
		  </View>
      { user.toktokWalletAccountId ? displayInsufficientBalance() : displayNoToktokWalletAccount() }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(30),
    paddingVertical: moderateScale(30)
  },
  title: {
    color: "#F6841F",
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M
  },
  description: {
    color: "#707070",
    fontSize: FONT_SIZE.M,
  },
  bodyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  marginBottom15: {
    marginBottom: moderateScale(15)
  },
  walletIcon: {
    resizeMode: "contain",
    width: moderateScale(35),
    height: moderateScale(35)
  },
  tokwaButtonWithAccount: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(10),
    backgroundColor: COLOR.WHITE,
  },
  tokwaButtonWithoutAccount: {
    borderRadius: 10,
    flexDirection: "row",
    padding: moderateScale(10),
    backgroundColor: COLOR.WHITE,
    opacity: 0.5
  },
  tokwaButtonTextWrapper: {
    flexDirection: "row",
  },
  toktokText: {
    color: COLOR.YELLOW,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  walletText: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  shadow: {
    backgroundColor:"white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  pmContainer: {
    // justifyContent: "center",
    // alignItems: "center",
    flexDirection: "row"
  },
  pmWrapper: {
    // alignItems: "center",
    paddingLeft: moderateScale(10)
  },
  balance: {
    color: "#707070",
    fontSize: FONT_SIZE.XS
  },
  errorContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: moderateScale(30),
    marginBottom: moderateScale(20)
  },
  errorText: {
    color: "#F6841F",
    fontSize: FONT_SIZE.S,
    textAlign: "center"
  },
  createAccount: {
    color: "#F6841F",
    textAlign: "center",
    fontSize: FONT_SIZE.M,
    textDecorationLine: "underline",
    marginBottom: moderateScale(25),
  },
  noTokWaMessage: {
    textAlign: "center",
    fontSize: FONT_SIZE.M,
    marginBottom: moderateScale(15),
  },
  pendingMessage: {
    textAlign: "center",
    fontSize: FONT_SIZE.M,
    marginBottom: moderateScale(25),
  }
})
