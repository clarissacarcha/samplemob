import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from "react-native";
import {useNavigation} from '@react-navigation/native';

//HELPER
import { moderateScale, numberFormat } from 'toktokload/helper';

//COMPONENTS
import { LoadingIndicator } from "src/ToktokLoad/components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { wallet_icon, warning_icon } from "src/ToktokLoad/assets/icons";

//GRAPHQL & HOOKS
import { useAccount } from 'toktokwallet/hooks';
import { useSelector } from 'react-redux';

export const PaymentMethod = ({ loadDetails, onCashIn }) => {

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
 
  const displayCashIn = () => {
    return (
      <View style={styles.cashinContainer}>
        <TouchableOpacity style={styles.cashinBtn} onPress={onPressTopUp}>
          <Text style={styles.cashinText}>Cash In</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const displayNoToktokWalletAccount = () => {
    return (
      <TouchableOpacity onPress={onPressCreateAccount}>
        <Text style={styles.createAccount}>{`Create your toktokwallet\naccount now!`}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      <View style={[ styles.bodyContainer, { alignItems: "center" } ]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image style={styles.walletIcon} source={wallet_icon} />
          <View style={styles.pmContainer}>
            <View style={styles.pmWrapper}>
              <View style={styles.tokwaButtonTextWrapper}>
                <Text style={styles.toktokText}>toktok</Text>
                <Text style={styles.walletText}>wallet</Text>
              </View>
              { user.toktokWalletAccountId && (
                <Text style={styles.balance}>
                  Balance: ₱{numberFormat(tokwaBalance)}
                </Text>
              )}
            </View>
          </View>
        </View>
        { user.toktokWalletAccountId ? displayCashIn() : displayNoToktokWalletAccount() }
      </View>
      { user.toktokWalletAccountId && parseFloat(totalAmount) > parseFloat(tokwaBalance) && (
        <View style={styles.insufficientContainer}>
          <Image style={styles.warningIcon} source={warning_icon} />
          <Text style={styles.insufficientText}>Insufficient balance</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(25),
    paddingVertical: moderateScale(20)
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
    paddingTop: moderateScale(15)
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
    flexDirection: "row"
  },
  pmWrapper: {
    paddingLeft: moderateScale(10)
  },
  balance: {
    color: "#525252",
    fontSize: FONT_SIZE.XS
  },
  cashinContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  cashinText: {
    color: "#F6841F",
    fontSize: FONT_SIZE.XS,
    textAlign: "center"
  },
  createAccount: {
    color: "#F6841F",
    textAlign: "center",
    fontSize: FONT_SIZE.S,
    textDecorationLine: "underline",
  },
  pendingMessage: {
    textAlign: "center",
    fontSize: FONT_SIZE.M,
    marginBottom: moderateScale(25),
  },
  warningIcon: {
    resizeMode: "contain",
    width: moderateScale(15),
    height: moderateScale(15)
  },
  cashinBtn: {
    borderColor: "#F6841F",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5)
  },
  insufficientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(10)
  },
  insufficientText: {
    color: "#ED3A19",
    fontSize: FONT_SIZE.S,
    marginLeft: moderateScale(5)
  }
})
