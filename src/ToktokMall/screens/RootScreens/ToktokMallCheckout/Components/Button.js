import React, {useCallback, useState, useEffect, useRef, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, AsyncStorage, Animated} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Price, FormatToText } from '../../../../helpers/formats';
import Spinner from 'react-native-spinkit';
import { FONT } from '../../../../../res/variables';
// import { COLOR, FONT } from '../../../../../../res/variables';
// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'

import {CheckoutContext} from '../ContextProvider';
import { RoundOffValue, useDebounce } from '../../../../helpers';
import { EventRegister } from 'react-native-event-listeners';

const REAL_WIDTH = Dimensions.get('window').width;

export const Button = ({enabled, loading, shipping, balance, shippingRates, total, onPress}) => {

  const CheckoutContextData = useContext(CheckoutContext)
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [btnPressed, setBtnPressed] = useState(false)

  const isDisabled = () => {
    if(total > 0 && !loading && shipping && CheckoutContextData.shippingFeeRates.length > 0 && balance >= total && CheckoutContextData.voucherErrors.length === 0) return false
    else return true
  }
    
  const onPressPlaceOrder = () => {
    let isInvalid = isDisabled()

    if(!shipping || CheckoutContextData.shippingFeeRates.length == 0){
      CheckoutContextData.setAnimateAddress(true)
      return
    }

    if(balance <= total){
      //INSUFFICIENT FUNDS
      CheckoutContextData.setAnimatePayments(true)
      return
    }

    if(!isInvalid && enabled){
      onPress()
      return
    }else{
      setBtnDisabled(true)
    }
  }

  const debouncePressPlaceOrder = useDebounce(value => onPressPlaceOrder(), 500)

  return (
    <>
        {/* <View style={styles.footer}> */}
          <View style = {styles.placeOrderContainer}>
            <View style= {styles.totalContainer}>
              <Text style = {styles.totalTitle}>Total</Text>
              <Text style = {styles.totalText}>{
                !total ? FormatToText.currency(0) : FormatToText.currency(RoundOffValue(total))
              }</Text>
            </View>
            <TouchableOpacity 
              disabled={btnDisabled || loading} 
              // style={btnDisabled ? styles.invalidButton : styles.activeButton} 
              style={styles.activeButton}
              onPress={() => {
                debouncePressPlaceOrder()
              }}
            >
                {!loading && <Text style={styles.buttonText}>Place Order</Text>}
                {loading && <Spinner type="ThreeBounce" size={30} color="#fff" isVisible={loading} />}
            </TouchableOpacity>
          </View>
        {/* </View> */}
    </>
    )
}

const styles = StyleSheet.create({
  body: {
    flex: 1, 
    backgroundColor: '#F7F7FA', 
  },
  container: {
    padding: 15, 
    backgroundColor: 'white', 
    marginTop: 15,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'  
  },
  footer: {
    position: 'absolute',
    // top: REAL_HEIGHT * 0.9,
    // bottom: -10,
    bottom: 0,
    left: 0,
    right: 0,
    // height: REAL_HEIGHT * 0.096,
    height: 80,
    width: REAL_WIDTH,
    backgroundColor: 'white',
    justifyContent: 'center',
    // alignItems: 'center',
    zIndex: 1,
  },
  activeButton: { 
    backgroundColor: '#F6841F', 
    height: 47, 
    width: 140,
    borderRadius: 5, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  invalidButton: { 
    backgroundColor: '#D7D7D7', 
    height: 47, 
    width: 140, 
    borderRadius: 5, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white', 
    fontFamily: FONT.BOLD, 
    fontSize: 13
  },
  placeOrderContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15
  },
  totalContainer: {
    flexDirection: 'row'
  },
  totalTitle: {
    fontSize: 18, 
    fontFamily: FONT.BOLD, 
    marginRight: 5, 
    color: '#F6841F'
  },
  totalText: {
    fontSize: 18, 
    fontFamily: FONT.BOLD, 
    color: '#F6841F' 
  },
})