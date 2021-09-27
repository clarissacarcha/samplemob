import React, {useState, useEffect, useContext} from 'react';
import {Platform, StyleSheet, View, Image, Text, FlatList, TouchableOpacity} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import { clearTemporaryCart } from 'toktokfood/helper/TemporaryCart';
import {VerifyContext} from './VerifyContextProvider';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';
import {useSelector} from 'react-redux';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';
import {arrow_right, help_centre_ic, wallet_ic} from 'toktokfood/assets/images';
import { GET_MY_ACCOUNT } from 'toktokwallet/graphql';
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

export const Me = () => {
  const {user} = useSelector((state) => state.session);
  const navigation = useNavigation();
  const { showHelpCentreList, setShowHelpCentreList, walletBalance, setWalletBalance } = useContext(VerifyContext);
  
  const onPress = () => {
    setShowHelpCentreList(true)
  }

  const onCashIn = ({ balance })=> {
    // do something here
    console.log(balance)
  }

  const onPressTopUp = () => {
    navigation.navigate('ToktokWalletPaymentOptions' , {
        amount: 0,
        onCashIn: onCashIn,
    })
  }

  if(showHelpCentreList){ return null }
  return (
    <View style={{ padding: 16 }}>
      {!!walletBalance && (
        <View style={[styles.shadow, styles.boxContainer]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, flexWrap: 'wrap' }}>
            <Image source={wallet_ic} style={{ height: 25, width: 25, resizeMode: 'contain', marginRight: 10 }} />
            <Text>
              <Text style={{ fontSize: FONT_SIZE.XL, fontFamily: FONT.REGULAR, color: '#fdba1a' }} >toktok</Text>
              <Text style={{ fontSize: FONT_SIZE.XL, fontFamily: FONT.REGULAR, color: '#f6841f' }}>wallet</Text>
            </Text>
            <Text style={{ color: '#929191', fontSize: FONT_SIZE.M, paddingHorizontal: 5, marginVertical: 10 }}>
              (Balance: PHP {walletBalance.toFixed(2)})
            </Text>
          </View>
          <TouchableOpacity onPress={onPressTopUp}>
            <Text style={{ color: '#FCB81A', fontSize: FONT_SIZE.M, paddingHorizontal: 5 }}>
              Top up
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity onPress={onPress} style={[styles.shadow, styles.boxContainer]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={help_centre_ic} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
          <Text style={{ fontSize: FONT_SIZE.L, paddingHorizontal: 5 }}>Help Centre</Text>
        </View>
        <Image source={arrow_right} style={{ height: 15, width: 15, resizeMode: 'contain' }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  shadow: {
    backgroundColor:"whitesmoke",
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
  }
});
