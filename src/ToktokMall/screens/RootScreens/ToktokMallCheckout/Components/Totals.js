import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, } from 'react-native';
import { Price, FormatToText } from '../../../../helpers/formats';
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
    for (let i = 0; i < data.length; i++){
      total = total + parseFloat(data[i].delivery_fee)
    }
    shippingFeeTotal = total
    return FormatToText.currency(total)
  }

  const computeMerchandiseTotal = () => {
    let total = 0
    data.map((item, i) => {
      for (let i = 0; i < item.cart.length; i++){
        total = total + (parseFloat(item.cart[i].price) * item.cart[i].qty)
      }
    })
    merchandiseTotal = total
    return FormatToText.currency(total)
  } 
    
  return (
    <>
      <View style = {styles.container}>
        <View style = {styles.textContainer}>
          <Text>Merchandise SubTotal:</Text>
          <Text>{computeMerchandiseTotal()}</Text>
        </View>
        <View style = {styles.textContainer}>
          <Text>Shipping Fee:</Text>
          <Text>{computeShippingFee()}</Text>
        </View>
        <View style = {styles.textContainer}>
          <Text style = {{fontWeight: 'bold'}}>Total Payment:</Text>
          <Text  style = {{color: '#F61841'}}>{FormatToText.currency(shippingFeeTotal + merchandiseTotal)}</Text>
        </View>
      </View>
    </>
    )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 15, backgroundColor: 'white', marginTop: 8, },
  textContainer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  textContainer2: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }


})