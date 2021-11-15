import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, FlatList, Dimensions, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import { useHeaderHeight } from '@react-navigation/stack';
import { useLazyQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';

//HELPER
import { moderateScale, numberFormat } from 'toktokbills/helper'

//COMPONENTS
import { HeaderBack, HeaderTitle, Separator, LoadingIndicator } from 'toktokbills/components'
import { ConfirmButton, PaymentForm, VerifyContextProvider, VerifyContext, PaymentMethod } from './Components';
import { SomethingWentWrong } from 'src/components'

// FONTS AND COLORS
import CONSTANTS from 'common/res/constants'
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS
const {width,height} = Dimensions.get("window")

//GRAPHQL
import {GET_MY_ACCOUNT} from 'toktokwallet/graphql';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';

const MainComponent = ({navigation, route})=> {

  const { billerTypes, billerName } = route.params;
  const { user } = useSelector((state) => state.session);
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
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(80) : moderateScale(-100)}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Separator/>
          <View style={{ alignItems: "center" }}>
            <Image source={billerTypes.logo} style={{ width: moderateScale(100), height: moderateScale(100), resizeMode: "contain" }} />
            <Text style={{ fontSize: FONT_SIZE.M }}>{billerTypes.name}</Text>
          </View>

          <PaymentForm />

          <PaymentMethod />
          <ConfirmButton />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}
export const ToktokBillsPaymentProcess = ({ navigation, route }) => {
  const { billerName } = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={billerName} />,
    headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
  });

  return (
    <VerifyContextProvider>
      <MainComponent navigation={navigation} route={route} />
    </VerifyContextProvider>
  );
};

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor:"white",
  }
})
