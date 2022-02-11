import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl} from "react-native";
import {useSelector} from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

//UTIL
import { moderateScale, numberFormat } from "toktokload/helper";

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator, Separator } from "src/ToktokLoad/components";
import { PaymentMethod, PayNowButton, SummaryDetails } from "./components";
import { SomethingWentWrong } from 'toktokload/components'

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { wallet_icon } from "src/ToktokLoad/assets/icons";

//GRAPHQL & HOOKS
import { GET_MY_ACCOUNT, GET_USER_TOKTOK_WALLET_DATA } from 'toktokwallet/graphql';
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import { useAccount } from 'toktokwallet/hooks';
import { useLazyQuery } from '@apollo/react-hooks';

export const ToktokLoadSummary = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} />,
  });

  const { loads, mobileNumber } = route.params;
  const isFocused = useIsFocused();
  const { user } = useSelector((state) => state.session);
  const {getMyAccountLoading, getMyAccount, getMyAccountError} = useAccount({ isOnErrorAlert: false });
  const [refreshing, setRefreshing] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);

  const [getUserToktokWalletData, { error, loading }] = useLazyQuery(GET_USER_TOKTOK_WALLET_DATA , {
    fetchPolicy:"network-only",
    variables: {
      input: {
        userId: user.id,
      }
    },
    onCompleted: async ({getUserToktokWalletData})=> {
      //0 - Rejected 1 - Approved 2 - Pending 3 - Linked 4 -For Further Verification
      setKycStatus(getUserToktokWalletData.kycStatus)
    }
  })

  useEffect(() => {
    if(isFocused){
      getUserToktokWalletData();
    }
  }, [isFocused])

  useEffect(() => {
    if(user.toktokWalletAccountId){
      getMyAccount();
    }
  },[user]);

  useEffect(() => {
    setRefreshing(getMyAccountLoading || loading);
  },[getMyAccountLoading, loading]);

  const onRefresh = () => {
    getMyAccount();
  }

  const onCashIn = ({balance}) => {
    console.log(balance);
    getMyAccount();
  };

  if(getMyAccountLoading || loading){
    return(
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  if(getMyAccountError || error){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} error={getMyAccountError ?? error} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Payment Summary</Text>
        </View>
        <SummaryDetails
          loadDetails={loads?.loadDetails ? loads.loadDetails : loads}
          mobileNumber={mobileNumber}
        />
        <Separator />
        <PaymentMethod
          loadDetails={loads?.loadDetails ? loads.loadDetails : loads}
          getMyAccount={getMyAccount}
          onCashIn={onCashIn}
          kycStatus={kycStatus}
        />
        <Separator />
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
    marginBottom: moderateScale(30)
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
