import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from "react-native";
import {useNavigation} from '@react-navigation/native';

//HELPER
import { moderateScale, numberFormat } from 'toktokbills/helper';

//COMPONENTS
import { LoadingIndicator } from "src/ToktokBills/components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { wallet_img } from "src/ToktokBills/assets/images";

//HOOKS
import { useAccount } from 'toktokbills/hooks';

export const PaymentMethod = ({ paymentData }) => {

	const navigation = useNavigation();
  const { tokwaAccount, getMyAccount } = useAccount();
  const { amount, convenienceFee } = paymentData;
  const totalAmount = parseInt(amount) + convenienceFee;

	const onCashIn = ({balance}) => {
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
		<View style={styles.container}>
			<View style={[ styles.bodyContainer, { alignItems: "center" } ]}>
				<Text style={styles.title}>Payment Method</Text>
				<View style={[ styles.tokwaButton, styles.shadow ]}>
					<Image style={styles.walletIcon} source={wallet_img} />
					<View style={styles.pmContainer}>
						<View style={styles.pmWrapper}>
							<View style={styles.tokwaButtonTextWrapper}>
								<Text style={styles.toktokText}>toktok</Text>
								<Text style={styles.walletText}>wallet</Text>
							</View>
							<Text style={styles.balance}>
								Balance: PHP {numberFormat(tokwaAccount?.wallet?.balance)}
							</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={styles.errorContainer}>
			{(parseFloat(totalAmount) > parseFloat(tokwaAccount?.wallet?.balance)) && (
				<TouchableOpacity onPress={onPressTopUp}>
					<Text style={styles.errorText}>
						{`Insufficient balance.\nPlease click here to cash in.`}
					</Text>
				</TouchableOpacity>
			)}
			</View>
		</View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(30),
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
  pmContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  pmWrapper: {
    alignItems: "center",
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
    marginTop: moderateScale(10)
  },
  errorText: {
    color: "#F6841F",
    fontSize: FONT_SIZE.S,
    textAlign: "center"
  }
})
