import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, AsyncStorage} from 'react-native';
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

export const Button = ({data, isVisible, setIsVisible, unSelectedItemsArr}) => {
  
  const computeTotal = () => {
    // let totalShipping = 0
    // let totalMerch = 0
    // let total = 0
    // for (let i = 0; i < data.length; i++){
    //     totalShipping = totalShipping + data[i].delivery_fee
    // }
    // data.map((item, i) => {
    //     for (let i = 0; i < item.items.length; i++){
    //         totalMerch = totalMerch + item.items[i].price
    //     }
    // })
    // return total = totalMerch + totalShipping
    let a = 0;
    for (var x = 0; x < data.length; x++) {
      for (var y = 0; y < data[x].cart.length; y++) {
        let item = data[x].cart[y];
        a += item.price * item.qty;
        console.log(a);
      }
    }
    return a
    // setSubTotal(a);
  }  

  const onCheckout = () => {
    let stringyfiedArr = JSON.stringify(unSelectedItemsArr)
    AsyncStorage.setItem('MyCart', stringyfiedArr)
    setIsVisible(true)
  }
    
  return (
    <>
        {/* <View style={styles.footer}> */}
          <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15}}>
            <View>
              <Text style = {{fontWeight: 'bold'}}>Total Payment</Text>
              <Text style = {{fontWeight: 'bold', color: '#F6841F' }}>Php {computeTotal()}.00</Text>
            </View>
            <TouchableOpacity style = {styles.button} onPress ={() => {onCheckout()}}>
                <Text style = {styles.buttonText}>Checkout</Text>
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
  button: { backgroundColor: '#F6841F', height: 47, width: 140, borderRadius: 5, alignItems: 'center', justifyContent: 'center'},
  buttonText: {color: 'white'}
})