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

//HOOKS
import { useAccount } from 'toktokbills/hooks';

const MainComponent = ({navigation, route})=> {

  const { billerType, biller } = route.params;
 
  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(80) : moderateScale(-100)}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Separator/>
          <View style={styles.headerContainer}>
            <Image source={billerType.logo} style={styles.logo} />
            <Text style={styles.billerName}>{billerType.name}</Text>
          </View>
          <PaymentForm />
          <ConfirmButton billerType={billerType} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}
export const ToktokBillsPaymentProcess = ({ navigation, route }) => {
  const { biller } = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={biller.name} />,
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
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: moderateScale(30)
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
