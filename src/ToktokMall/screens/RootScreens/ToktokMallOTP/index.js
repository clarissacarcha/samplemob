import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Platform, ImageBackground, Dimensions, StatusBar, Image, TouchableOpacity, FlatList, TextInput, ScrollView} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Header, LoadingOverlay} from '../../../Components';
import {COLOR, FONT, FONT_SIZE} from '../../../../res/variables';
import {otpicon, otpbg, otpicon2} from '../../../assets';
import CustomIcon from '../../../Components/Icons';
import Toast from "react-native-simple-toast";
import { FONT_REGULAR } from '../../../../res/constants';
import {
  ApiCall, 
  PaypandaApiCall, 
  BuildPostCheckoutBody, 
  BuildTransactionPayload, 
  WalletApiCall,
  ToktokWalletRawApiCall
} from "../../../helpers";
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../graphql';
import { POST_VERIFY_TOKTOKWALLET_PIN } from '../../../../graphql/toktokmall/virtual';

import {OTP, TPIN} from './Components'

import { TPINOTPContextProvider } from './ContextProvider';
import {ToktokMallOTPScreen} from './screen';

export const ToktokMallOTP =  ({navigation, route}) => {

  return (
    <>
      <TPINOTPContextProvider>
        <ToktokMallOTPScreen route={route} navigation={navigation} />
      </TPINOTPContextProvider>
    </>
  )
  
}
