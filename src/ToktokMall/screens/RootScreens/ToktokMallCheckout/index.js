import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions } from 'react-native';
import { COLOR, FONT } from '../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import { AddressForm, Button, Payment, Shops, Totals, Vouchers, CheckoutModal } from './Components';

import coppermask from '../../../assets/images/coppermask.png'
import suit from '../../../assets/images/coppermask.png'
const REAL_WIDTH = Dimensions.get('window').width;


const testData2 = [
  {id: 1, shops: 'Facemask PH', 
    items: [{id: 1, item_name: 'Improved Copper Mask 2.0 White or Bronze', price: 190, variation: 'bronze', quantity: 1, sale_off: 380, image: coppermask},
      {id: 2, item_name: 'Improved Copper Mask 2.0 White or Bronze', price: 190, variation: 'white', quantity: 1, sale_off: 380,  image: coppermask}
    ], delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },
  {id: 2, shops: 'The Apparel', 
    items: [{id: 1, item_name: 'Graphic Tees', price: 190, variation: 'white', quantity: 1, sale_off: 380, image: suit},
    ], delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },

]

const testDataAddress = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 0
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 1
  }
]

export const ToktokMallCheckout = ({route, navigation}) => {

  const [isVisible, setIsVisible] = useState(false)
  // const [data, setData] = useState([])
  const [addressData, setAddressData] = useState(testDataAddress)
  const [defaultAddress, setDefaultAddress] = useState(1)
  const [addressWasChanged, setAddressWasChanged] = useState(1)
  const [addressLengthChanged, setAddressLengthChanged] = useState(addressData.length)

  const [payment, setPaymentMethod] = useState(3);
  const [vouchers, setVouchers] = useState([])


  const findDefaultAddress = async () => {
    // testDataAddress.map((item, i) => {
    //   if(item.default == 1){
    //     setDefaultAddress(item)
    //   }else{
    //     // setDefaultAddress({})
    //   }
    // })
    addressData.find(function(post, index) {
      if(post.id == defaultAddress){
        // alert(JSON.stringify(post))
        setDefaultAddress(post.id)
      }
    })
  }

  const findDefaultAddress2 = async () => {
    data.find(function(post, index) {
      if(post.default == 1){
        // alert(JSON.stringify(post))
        setDefaultAddress(post.id)
      }
    })
  }

  useEffect(() => {
    findDefaultAddress();
    // setAddressData(testDataAddress);
  },[])
  
  useEffect(() => {
    // findDefaultAddress();
    // setAddressData(testDataAddress);
    setVouchers(route.params.vouchers)
  },[vouchers])


  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Checkout', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  return (
    
    <>
      <ScrollView>
        <CheckoutModal navigation = {navigation} isVisible = {isVisible} setIsVisible = {setIsVisible} />
        <View style ={{paddingBottom: 0}}>
        <AddressForm navigation = {navigation} data = {addressData[defaultAddress-1]} addressData = {addressData} setAddressData = {setAddressData}
          defaultAddress = {defaultAddress} setDefaultAddress= {setDefaultAddress} addressLengthChanged = {addressLengthChanged} 
          setAddressLengthChanged={setAddressLengthChanged}
        />
        <Shops data = {route.params.data} />
        <Vouchers navigation = {navigation} vouchers = {vouchers} setVouchers = {setVouchers} />
        <Payment  payment = {payment} setPaymentMethod = {setPaymentMethod} />
        <Totals data = {route.params.data}/>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button data = {route.params.data} isVisible = {isVisible} setIsVisible = {setIsVisible} unSelectedItemsArr = {route.params.unSelectedItemsArr} />
      </View>
    </>
    
  );
};


const styles = StyleSheet.create({

  footer: {
    position: 'absolute',
    // top: REAL_WIDTH * 0.9,
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
})