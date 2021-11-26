import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl} from "react-native";
import {useLazyQuery} from '@apollo/react-hooks';
import {useSelector} from 'react-redux';

//UTIL
import { moderateScale, numberFormat } from "toktokload/helper";

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator } from "src/ToktokLoad/components";
import { PaymentMethod, PayNowButton, SummaryDetails } from "./components";
import { SomethingWentWrong } from 'src/components'

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { wallet_icon } from "src/ToktokLoad/assets/icons";

//GRAPHQL & HOOKS
import {GET_MY_ACCOUNT} from 'toktokwallet/graphql';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import { useAccount } from 'toktokwallet/hooks';

export const ToktokLoadSummary = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} />,
    headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
  });

  const loads = route.params?.loads;
  const mobileNumber = route.params?.mobileNumber ? route.params.mobileNumber : loads?.mobileNumber ;
  
  const { user } = useSelector((state) => state.session);
  const {getMyAccountLoading, getMyAccount, getMyAccountError} = useAccount();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if(user.toktokWalletAccountId){
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
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Load Summary</Text>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <SummaryDetails loadDetails={loads?.loadDetails ? loads.loadDetails : loads} mobileNumber={mobileNumber} />
        <View style={styles.separator} />
        <PaymentMethod loadDetails={loads?.loadDetails ? loads.loadDetails : loads} getMyAccount={getMyAccount} />
      </ScrollView>
      <PayNowButton loadDetails={loads?.loadDetails ? loads.loadDetails : loads } mobileNumber={mobileNumber} />
    </View>
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
