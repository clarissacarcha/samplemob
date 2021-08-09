import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, } from 'react-native';
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

export  const Totals = ({data}) => {

  let shippingFeeTotal = 0
  let merchandiseTotal = 0

  const computeShippingFee = () => {
    let total = 0
    let  totalArr = []
    for (let i = 0; i < data.length; i++){
      total = total + data[i].delivery_fee
    }
    shippingFeeTotal = total
    return total
  }

  const computeMerchandiseTotal = () => {
    let total = 0
    let  totalArr = []
    data.map((item, i) => {
        for (let i = 0; i < item.cart.length; i++){
          total = total + item.cart[i].price
        }
    })
    merchandiseTotal = total
    return total
  } 
    
  return (
    <>
      <View style = {styles.container}>
        <View style = {styles.textContainer}>
          <Text>Merchandise SubTotal:</Text>
          <Text>Php {computeMerchandiseTotal()}.00</Text>
        </View>
        <View style = {styles.textContainer}>
          <Text>Shipping Fee:</Text>
          <Text>Php {computeShippingFee()}.00</Text>
        </View>
        <View style = {styles.textContainer}>
          <Text style = {{fontWeight: 'bold'}}>Total Payment:</Text>
          <Text  style = {{color: '#F61841'}}>Php {shippingFeeTotal + merchandiseTotal}.00</Text>
        </View>
      </View>
    </>
    )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 15, backgroundColor: 'white', marginTop: 15, },
  textContainer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  textContainer2: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }


})