import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from "react-native";
import {useLazyQuery} from '@apollo/react-hooks';
import {useSelector} from 'react-redux';

//UTIL
import { moderateScale, numberFormat } from "toktokload/helper";

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator } from "src/ToktokLoad/components";
import { PaymentMethod, PayNowButton, SummaryDetails, VerifyContext, VerifyContextProvider } from "./components";
import { SomethingWentWrong } from 'src/components'

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { wallet_icon } from "src/ToktokLoad/assets/icons";

//GRAPHQL
import {GET_MY_ACCOUNT} from 'toktokwallet/graphql';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';

export const MainComponent = ({ navigation, route }) => {

  const { amount } = route.params?.loads;
  const mobileNo = route.params?.mobileNo;

  const {user} = useSelector((state) => state.session);
  const { toktokWallet, setToktokWallet, hasToktokWallet, setHasToktokWallet } = useContext(VerifyContext);

  const [getMyAccount, {loading, error}] = useLazyQuery(GET_MY_ACCOUNT, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({getMyAccount}) => {
      let {wallet, person} = getMyAccount;
      setToktokWallet({
        balance: numberFormat(wallet.balance),
        toktokuser_id: user.id,
        currency: wallet.currency.code,
        name: `${person.firstName} ${person.lastName}`,
        notes: 'Payment by toktokfood customer',
      });
    },
    onError: (error) => {
      setToktokWallet(null);
    },
  });

  useEffect(() => {
    if (user) {
      if (user.toktokWalletAccountId) {
        setHasToktokWallet(true);
        getMyAccount();
      } else {
        setHasToktokWallet(false);
      }
    }
  }, [user]);

  if(loading){
    return(
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  if(error){
    return ( <SomethingWentWrong /> )
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Load Summary</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <SummaryDetails amount={amount} mobileNo={mobileNo} />
        <View style={styles.separator} />
        <PaymentMethod amount={amount} getMyAccount={getMyAccount} />
      </ScrollView>
      <PayNowButton amount={amount} />
    </View>
  );
};
export const ToktokLoadSummary = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} />,
    headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
  });

  return (
    <VerifyContextProvider>
      <MainComponent navigation={navigation} route={route} />
    </VerifyContextProvider>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    alignItems: "center",
    marginTop: moderateScale(20),
    marginBottom: moderateScale(10)
  },
  headerText: {
    color: "#F6841F",
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD
  },
  separator: {
    height: moderateScale(30),
    backgroundColor: "#F7F7FA"
  }
})
