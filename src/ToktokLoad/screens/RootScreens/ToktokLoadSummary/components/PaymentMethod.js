import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from "react-native";
import {useLazyQuery} from "@apollo/react-hooks";
import {useSelector} from "react-redux";
import {useNavigation} from '@react-navigation/native';

//UTIL
import { moderateScale, numberFormat } from "toktokload/helper";

//COMPONENTS
import { LoadingIndicator } from "src/ToktokLoad/components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { wallet_icon } from "src/ToktokLoad/assets/icons";

//GRAPHQL
import {GET_MY_ACCOUNT} from "toktokwallet/graphql";
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from "src/graphql";
import { VerifyContext } from "./VerifyContextProvider";

export const PaymentMethod = ({ amount, getMyAccount }) => {

	const navigation = useNavigation();
  const { toktokWallet } = useContext(VerifyContext);

	const onCashIn = ({balance}) => {
    // do something here
    console.log(balance);
    getMyAccount();
  };

  const onPressTopUp = () => {
    navigation.navigate('ToktokWalletPaymentOptions', {
      amount: 0,
      onCashIn: onCashIn,
    });
  };

  return (
		<View style={{ paddingHorizontal: moderateScale(30), paddingVertical: moderateScale(20) }}>
			<View style={[ styles.bodyContainer, { alignItems: "center" } ]}>
				<Text style={styles.title}>Payment Method</Text>
				<View style={[ styles.tokwaButton, styles.shadow ]}>
					<Image style={styles.walletIcon} source={wallet_icon} />
					<View style={{justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
						<View style={{ alignItems: "center", paddingLeft: moderateScale(10) }}>
							<View style={styles.tokwaButtonTextWrapper}>
								<Text style={styles.toktokText}>toktok</Text>
								<Text style={styles.walletText}>wallet</Text>
							</View>
							<Text style={{color: "#707070", fontSize: FONT_SIZE.XS}}>
								Balance: PHP {numberFormat(toktokWallet?.balance)}
							</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={{ flex: 1, justifyContent: "flex-end", flexDirection: "row", marginTop: moderateScale(10) }}>
			{(amount > numberFormat(toktokWallet?.balance)) && (
				<TouchableOpacity onPress={onPressTopUp}>
					<Text style={{color: "#F6841F", fontSize: FONT_SIZE.S, textAlign: "center"}}>
						{`Insufficient balance.\nPlease click here to cash in.`}
					</Text>
				</TouchableOpacity>
			)}
			</View>
		</View>
  );
};

const styles = StyleSheet.create({
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
  tokwaButton: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(10),
    backgroundColor: COLOR.WHITE,
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
})
