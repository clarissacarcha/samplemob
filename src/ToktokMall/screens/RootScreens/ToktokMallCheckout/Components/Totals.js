import React, {useState, useEffect, useRef, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, } from 'react-native';
import { Price, FormatToText } from '../../../../helpers/formats';

import {CheckoutContext} from '../ContextProvider';

export const Totals = ({raw, shipping, shippingRates}) => {

  const CheckoutContextData = useContext(CheckoutContext)

  const [data, setData] = useState(raw || [])

  useEffect(() => {
    setData(raw)
  }, [raw])

  let shippingFeeTotal = 0
  let shippingDiscountTotal = 0
  let merchandiseTotal = 0

  const computeShippingFee = () => {
    let total = 0
    for (let i = 0; i < data.length; i++){
      total = total + parseFloat(shipping?.rateAmount)
    }
    shippingFeeTotal = total
    if(!total) return FormatToText.currency(0)
    else return FormatToText.currency(total)
  }

  const computeShippingRates = () => {
    let total = 0
    for (let i = 0; i < CheckoutContextData.shippingFeeRates.length; i++){
      total = total + parseFloat(CheckoutContextData.shippingFeeRates[i].shippingfee)
    }
    shippingFeeTotal = total
    if(!total) return FormatToText.currency(0)
    else return FormatToText.currency(total)
  }

  const computeShippingDiscount = () => {
    let total = 0
    for (let i = 0; i < CheckoutContextData.shippingVouchers.length; i++){
      let shippingfee = CheckoutContextData.shippingFeeRates[i]?.shippingfee
      let voucheramount = CheckoutContextData.shippingVouchers[i]?.amount
      if(shippingfee && voucheramount && shippingfee - voucheramount < 0){
        total = total + 0
      }else{
        total = total + parseFloat(CheckoutContextData.shippingVouchers[i].discountedAmount)  
      }
      
    }
    shippingDiscountTotal = total
    if(!total) return FormatToText.currency(0)
    else return FormatToText.currency(total)
  }

  const computeMerchandiseTotal = () => {
    let total = 0
    data.length > 0 && data.map((item, i) => {
      for (let i = 0; i < item.data.length; i++){
        total = total + (parseFloat(item.data[0][i].amount) * item.data[0][i].qty)
      }
    })
    merchandiseTotal = total
    return FormatToText.currency(total)
  } 

  const getDiscount = (type) => {
    if(type == "shipping"){
      return CheckoutContextData.shippingVouchers.length !== 0
    }
  }
    
  return (
    <>
      <View style = {styles.container}>
        <View style = {styles.textContainer}>
          <Text style={{fontSize: 13}}>Merchandise SubTotal:</Text>
          <Text>{computeMerchandiseTotal()}</Text>
        </View>
        <View style = {styles.textContainer}>
          <Text>Shipping Fee:</Text>
          <View style={{flexDirection: 'row'}}>
            {/* <View style={{flex: 0}}>
              <Text style={{textDecorationLine: CheckoutContextData.shippingVouchers.length > 0 ? 'line-through' : 'none'}}>{computeShippingRates()} </Text>
            </View>
            <View>
              {CheckoutContextData.shippingVouchers.length > 0 && <Text> {computeShippingDiscount()}</Text>}
            </View> */}

            <View style={{flex: 0}}>
              <Text style={{textDecorationLine: getDiscount("shipping") ? "line-through" : "none",  color: getDiscount("shipping") ? "#929191" :'#000'}}>{computeShippingRates()}</Text>
            </View>
            <View style={{flex: 0}}>
              {getDiscount("shipping") ? <Text> {computeShippingDiscount()}</Text> : null}              
            </View>

          </View>          
        </View>
        <View style = {styles.textContainer}>
          <Text style = {{fontWeight: 'bold'}}>Total Payment:</Text>
          <Text  style = {{color: '#F61841'}}>{FormatToText.currency((shippingFeeTotal || 0) + (merchandiseTotal || 0))}</Text>
        </View>
      </View>
      <View style={{height: 50}} />
    </>
    )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 15, backgroundColor: 'white', marginTop: 8, },
  textContainer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  textContainer2: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }


})