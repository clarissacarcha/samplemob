import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, FlatList, Dimensions, Image, ScrollView, KeyboardAvoidingView, RefreshControl } from 'react-native'
import { useHeaderHeight } from '@react-navigation/stack';
import { useLazyQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';

//HELPER
import { moderateScale, numberFormat } from 'toktokbills/helper'

//COMPONENTS
import { HeaderBack, HeaderTitle, Separator, LoadingIndicator } from 'toktokbills/components'
import { ConfirmButton, PaymentDetails, VerifyContextProvider, VerifyContext, PaymentMethod } from './Components';
import { SomethingWentWrong } from 'src/components'

// FONTS AND COLORS
import CONSTANTS from 'common/res/constants'
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS
const {width,height} = Dimensions.get("window")

//HOOKS
import { useAccount } from 'toktokbills/hooks';

export const ToktokBillsPaymentSummary = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokbills Payment Summary"} />,
    headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
  });

  const { paymentData } = route.params;
  const { user } = useSelector((state) => state.session);
  const {getMyAccountLoading, getMyAccount, getMyAccountError} = useAccount();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if(user?.toktokWalletAccountId){
      getMyAccount();
    }
  },[user]);

  useEffect(() => {
    setRefreshing(getMyAccountLoading);
  },[getMyAccountLoading]);

  const onRefresh = () => {
    getMyAccount();
  }

  if(getMyAccountLoading){
    return(
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  if(getMyAccountError){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <PaymentDetails paymentData={paymentData} />
        <PaymentMethod paymentData={paymentData} />
        <ConfirmButton paymentData={paymentData} />
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor:"white",
  }
})
