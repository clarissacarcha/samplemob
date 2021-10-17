import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, AsyncStorage} from 'react-native';
import { Price, FormatToText } from '../../../../helpers/formats';
import Spinner from 'react-native-spinkit';
import { FONT } from '../../../../../res/variables';
// import { COLOR, FONT } from '../../../../../../res/variables';
// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'
const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]
const REAL_WIDTH = Dimensions.get('window').width;

export const Button = ({enabled, loading, shipping, balance, shippingRates, total, onPress}) => {

  const onCheckout = () => {
    // let stringyfiedArr = JSON.stringify(unSelectedItemsArr)
    // AsyncStorage.setItem('MyCart', stringyfiedArr)
    // setIsVisible(true)
  }

  const isDisabled = () => {

    // if(!total) return true
    // else if(total > 0) return false
    // else if(loading) return true
    // else if(!loading) return false
    // else if(!shipping) return false
    // else if(shippingRates.length == 0) return true
    // else if(shippingRates.length > 0) return false

    if(total > 0 && !loading && shipping && shippingRates.length > 0 && balance >= total) return false
    else return true
  }
    
  return (
    <>
        {/* <View style={styles.footer}> */}
          <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15}}>
            <View>
              <Text style = {{fontWeight: 'bold'}}>Total Payment</Text>
              <Text style = {{fontWeight: 'bold', color: '#F6841F' }}>{
                !total ? FormatToText.currency(0) : FormatToText.currency(total)
              }</Text>
            </View>
            <TouchableOpacity disabled={isDisabled()} style={isDisabled() ? styles.invalidButton : styles.activeButton} onPress={() => {
              if(enabled) onPress()
            }}>
                {!loading && <Text style={styles.buttonText}>Place Order</Text>}
                {loading && <Spinner type="ThreeBounce" size={30} color="#fff" isVisible={loading} />}
            </TouchableOpacity>
          </View>
        {/* </View> */}
    </>
    )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 15, backgroundColor: 'white', marginTop: 15,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'  },
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
  activeButton: { backgroundColor: '#F6841F', height: 47, width: 140, borderRadius: 5, alignItems: 'center', justifyContent: 'center'},
  invalidButton: { backgroundColor: '#D7D7D7', height: 47, width: 140, borderRadius: 5, alignItems: 'center', justifyContent: 'center'},
  buttonText: {color: 'white', fontFamily: FONT.BOLD, fontSize: 13}
})