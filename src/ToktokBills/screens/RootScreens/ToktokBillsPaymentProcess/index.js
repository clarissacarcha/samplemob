import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, FlatList, Dimensions, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import { useHeaderHeight } from '@react-navigation/stack';

//HELPER
import { moderateScale, numberFormat } from 'toktokbills/helper'

//COMPONENTS
import { HeaderBack, HeaderTitle, Separator, LoadingIndicator } from 'toktokbills/components'
import { ConfirmButton, PaymentForm, VerifyContextProvider, VerifyContext } from './Components';
import { SomethingWentWrong } from 'src/components'

// FONTS AND COLORS
import CONSTANTS from 'common/res/constants'
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS
const {width,height} = Dimensions.get("window")

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_BILL_ITEM_SETTINGS } from 'toktokbills/graphql/model';

const MainComponent = ({navigation, route})=> {

  const { billItemId, billType } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const {data: billItemSettings, loading, error, refetch} = useQuery(GET_BILL_ITEM_SETTINGS, {
    variables: {
      input: {
        billItemId
      }
    },
    fetchPolicy: "cache-and-network",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT
  });
 
  if(loading){
    return(
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  if(error){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={refetch} />
      </View>
    )
  }
  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(80) : moderateScale(-100)}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <Image source={{ uri: billItemSettings?.getBillItemSettings.logo }} style={styles.logo} />
            <Text style={styles.billerName}>{billItemSettings?.getBillItemSettings?.name}</Text>
          </View>
          <PaymentForm billItemSettings={billItemSettings?.getBillItemSettings} />
          <ConfirmButton billItemSettings={billItemSettings?.getBillItemSettings} billType={billType} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}
export const ToktokBillsPaymentProcess = ({ navigation, route }) => {
  const { billType } = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={billType.name} />,
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
  },
  headerContainer: {
    alignItems: "center",
    marginTop: moderateScale(30),
    marginBottom: moderateScale(15)
  },
  logo: {
    width: moderateScale(130),
    height: moderateScale(50),
    resizeMode: "contain"
  },
  billerName: {
    fontSize: FONT_SIZE.M,
    marginTop: moderateScale(10)
  }
})
