import React, {useState, useEffect, useContext} from 'react';
import {Platform, StyleSheet, View, Image, Text, FlatList, TouchableOpacity} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import {VerifyContext} from './VerifyContextProvider';
import { GET_MY_ACCOUNT } from 'toktokwallet/graphql';
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import { useLazyQuery } from '@apollo/react-hooks';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';
import {useSelector} from 'react-redux';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';
import {arrow_right, terms_and_conditions_ic, policy_ic, contact_support_ic, wallet_ic} from 'toktokfood/assets/images';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

const DATA = [
  {
    title: 'toktokwallet',
  },
  {
    title: 'Terms and Conditions',
    icon: terms_and_conditions_ic,
    screen: 'ToktokFoodTermsAndConditions'
  },
  {
    title: 'Privacy Policy',
    icon: policy_ic,
    screen: 'ToktokFoodPrivacyPolicy'
  },
  {
    title: 'Contact Us',
    icon: contact_support_ic,
    screen: 'ToktokFoodContactUs'
  }
]

export const HelpCentre = ({ getMyAccount }) => {

  const navigation = useNavigation();
  const {location} = useSelector((state) => state.toktokFood);
  const {user} = useSelector((state) => state.session);
  const { showHelpCentreList, setShowHelpCentreList, walletBalance, setWalletBalance } = useContext(VerifyContext);
  
  const onCashIn = ({ balance })=> {
    // do something here
    console.log(balance)
    getMyAccount()
  }

  const onPressTopUp = () => {
    navigation.navigate('ToktokWalletPaymentOptions' , {
        amount: 0,
        onCashIn: onCashIn,
    })
  }

  const onPress = (screen) => {
    navigation.navigate(screen)
  }

  const renderItem = ({ item }) => {
    if(item.title == 'toktokwallet'){
      return (
        <>
        {walletBalance != null && (
          <View style={[styles.shadow, styles.boxContainer]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, flexWrap: 'wrap' }}>
              <Image source={wallet_ic} style={{ height: 25, width: 25, resizeMode: 'contain', marginRight: 10 }} />
              <Text>
                <Text style={{ fontSize: FONT_SIZE.XL, fontFamily: FONT.REGULAR, color: '#fdba1a' }} >toktok</Text>
                <Text style={{ fontSize: FONT_SIZE.XL, fontFamily: FONT.REGULAR, color: '#f6841f' }}>wallet</Text>
              </Text>
              <Text style={{ color: '#929191', fontSize: FONT_SIZE.M, paddingHorizontal: 5, marginVertical: 10 }}>
                (Balance: PHP {walletBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.00)
              </Text>
            </View>
            <TouchableOpacity onPress={onPressTopUp}>
              <Text style={{ color: '#FCB81A', fontSize: FONT_SIZE.M, paddingHorizontal: 5 }}>
                Top up
              </Text>
            </TouchableOpacity>
          </View>
        )}
        </>
      )
    }
    return (
      <TouchableOpacity onPress={() => onPress(item.screen)} style={[styles.shadow, styles.boxContainer]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={item.icon} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
          <Text style={{ fontSize: FONT_SIZE.L, paddingHorizontal: 5 }}>{item.title}</Text>
        </View>
        <Image source={arrow_right} style={{ height: 15, width: 15, resizeMode: 'contain' }} />
      </TouchableOpacity>
    )
  }

  // if(!showHelpCentreList){ return null }
  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  shadow: {
    backgroundColor:"white",
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16
  },
  boxContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
