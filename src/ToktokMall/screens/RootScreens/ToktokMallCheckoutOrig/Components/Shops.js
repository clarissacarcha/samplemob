import React, {useState, useEffect, useRef, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Platform } from 'react-native';

import { FONT } from '../../../../../res/variables';
import {placeholder, voucherIcon} from '../../../../assets';
import { Price, FormatToText } from '../../../../helpers/formats';

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_APPLY_VOUCHER, GET_HASH_AMOUNT } from '../../../../../graphql/toktokmall/model';
import {ApiCall, ArrayCopy} from '../../../../helpers';

import CustomIcon from '../../../../Components/Icons';
import Spinner from 'react-native-spinkit';

import {CheckoutContext} from '../ContextProvider';
import { useDispatch } from 'react-redux';
import { ApplyVoucherForm } from './ApplyVoucher';

export const Shops = ({address, customer, raw, shipping, shippingRates, retrieve}) => {

  const dispatch = useDispatch()

  const CheckoutContextData = useContext(CheckoutContext)

  const [data, setData] = useState(raw || [])

  useEffect(() => {
    setData(raw)
  }, [raw])  

  const computeTotal = (item, raw = false) => {
    let total = 0
    for (let i = 0; i < item.length; i++){
      total = total + parseFloat(item[i].amount)
    }
    if(raw){
      return total == NaN ? 0 : total
    }else{
      return FormatToText.currency(total == NaN ? 0 : total)
    }    
  }

  const getImageSource = (imgs) => {
    if(imgs && typeof imgs == "string"){
      return {uri: imgs}
    }else {
      return placeholder
    }
  }

  const countItems = (item) => {
    let count = 0
    for (let i = 0; i < item.length; i++){
      count = count + item[i].qty
    }
    return count
  }

  const renderItems = (items) => {

    return items.map((item, i) => {

      const product = item.product || {}
      // console.log(item)

        return(
          <View style={styles.itemContainer}>
            <Image //source = {item.image} 
            source = {getImageSource(product?.img?.filename)} 
            style ={styles.itemImage}/>
            <View style = {{ marginLeft: 15, flex: 1}}>
              <Text>{product?.name ? product?.name : product?.itemname}</Text>
              <View style = {{flexDirection: 'row'}}>
                <Text style ={styles.itemprice}>{FormatToText.currency(product?.price)}</Text>
                <Text style ={styles.itemSaleOff}>{parseFloat(product?.compareAtPrice) != "0.00" ? FormatToText.currency(product?.compareAtPrice) : ""}</Text>
              </View>
              <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <Text style ={{ color: '#9E9E9E', flex: 4.7 }}>Variation: {product.variant || "None"}</Text>
                <Text style ={{ color: '#9E9E9E', flex: 1.2}}>Qty: {item.qty}</Text>
              </View>
            </View>
          </View>
        )
      })
  }  

  const renderShops = () => {

    return data.map((item, i) => {

      const shop = item.shop

      const getStoreLogo = (raw) => {
        let loc = require("../../../../assets/icons/store.png")
        if(typeof raw == "string") return {uri: raw}
        else return loc
      }

      const getDeliveryFee = (id) => {

        let discount = null
        let shippingIndex = CheckoutContextData.shippingFeeRates.findIndex((e) => e.shopid == id)
        let voucherIndex = CheckoutContextData.shippingVouchers.findIndex((e) => e != null && e.shopid == id)

        // console.log("Get Discount", shippingIndex, voucherIndex)
        if(shippingIndex > -1 && voucherIndex > -1){
          
          let shippingfee = CheckoutContextData.shippingFeeRates[shippingIndex]?.shippingfee
          let voucheramount = CheckoutContextData.shippingVouchers[voucherIndex]?.amount
  
          if(shippingfee && voucheramount && shippingfee - voucheramount < 0){
            discount = 0
          }else{
            discount = CheckoutContextData.shippingVouchers[voucherIndex]?.discount
          }
        }

        if(discount == null){
          return (
            <>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 0}}>
                  <Text>Delivery Fee: </Text>
                </View>
                <View style={{flex: 0}}>
                  <Text 
                    style={{
                      textDecorationLine: "none",  
                      color: '#000'
                    }}
                  >
                    {FormatToText.currency(getOriginalShippingFee(id))}
                  </Text>
                </View>
                <View style={{flex: 0}}>
                  <Text></Text>
                </View>
              </View>
            </>
          )
        }else{
          return (
            <>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 0}}>
                  <Text>Shipping Fee: </Text>
                </View>
                <View style={{flex: 0}}>
                  <Text 
                    style={{
                      textDecorationLine: "line-through",  
                      color: "#929191"
                    }}
                  >
                    {FormatToText.currency(getOriginalShippingFee(id))}
                  </Text>
                </View>
                <View style={{flex: 0}}>
                  <Text> {FormatToText.currency(discount)}</Text>
                </View>
              </View>
            </>
          )
        }
      }

      const getOriginalShippingFee = (id) => {
        if(CheckoutContextData.shippingFeeRates.length > 0){
          let index = CheckoutContextData.shippingFeeRates.findIndex((e) => e.shopid == id)

          if(index > -1){
            let rates = CheckoutContextData.shippingFeeRates[index]
            // console.log("Rates shopid: " + shop.id, rates)
            return rates.original_shipping
          }else{
            return 0
          }    
        }else{
          return 0
        }
      }

      const getIsShippingServiceAreaInvalid = (shopid) => {
        if(CheckoutContextData.unserviceableShipping.length > 0){
          let index = CheckoutContextData.unserviceableShipping.findIndex(a => a.shopid == shopid)
          // return CheckoutContextData.unserviceableShipping[index] != null
          return index > -1
        }else{
          return false
        }
      }

      const renderValidShipping = (i, shipping, item, shopid) => {
        
        // console.log("Index", i)
        // console.log("shop id", shopid)
        // console.log("Shipping", CheckoutContextData.shippingFeeRates)
        // console.log("Discount", CheckoutContextData.shippingVouchers)
        // console.log("Unserviceable", CheckoutContextData.unserviceableShipping)

        return (
          <>            
            {getDeliveryFee(shopid)}
            <View>
              <Text>Order total ({countItems(item.data[0]) || 0} {countItems(item.data[0]) > 1 ? `items` : 'item'}): {computeTotal(item.data[0]) || 0} </Text>
              <Text style = {{marginTop: 7, color: '#929191'}}>Receive by: {shipping?.deliveryDate || "Add address to calculate"} </Text>
            </View>
          </>
        )
      }

      const renderInvalidShipping = () => {
        return (
          <>
            <View>
              <Text>Unsupported Address</Text>
            </View>
          </>
        )
      }

      const ListAutoShippingVouchers = () => {
        return (
          <>
          <View>
            <View style ={styles.imageContainer}>
              <Image source={voucherIcon} style={styles.image} /> 
              <Text style = {styles.shopVoucher}>Shop Vouchers</Text>
            </View>            
          </View>
          </>
        )
      }
      
      return(
        <>
        <View style={styles.container}>
          <View style ={styles.imageContainer}>
            <Image source={getStoreLogo(shop.profileImages.logo || {})} style={styles.image} /> 
            <Text style = {styles.shopName}>{shop.shopname}</Text>
          </View>
          <View style={{padding: 15}}>
            {renderItems(item.data[0])}
          </View>

          {<ListAutoShippingVouchers />}
                    
          <TouchableOpacity style={styles.deliveryfeeContainer} >

            {getIsShippingServiceAreaInvalid(shop.id) ? renderInvalidShipping() : renderValidShipping(i, shipping, item, shop.id)}

          </TouchableOpacity>

          {ApplyVoucherForm(address, customer, {
            index: i,
            item: item,
            subTotal: computeTotal(item.data[0])})}

        </View>
        </>
      )
    })
  }
    
  return (
    <>
      {/* <View style = {styles.container}>
       
      </View>   */}
      {data && data.length > 0 && renderShops()}
    </>
    )
}

const styles = StyleSheet.create({
  body: {
    flex: 1, 
    backgroundColor: '#F7F7FA', 
  },
  container: {
    padding: 0, 
    backgroundColor: 'white', 
    marginTop: 8,  
  },
  itemContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-start'
  },
  itemImage: {
    flex: 0.3, 
    height: 100, 
    width: 100
  },
  itemprice: {
    color: '#F6841F', 
    marginRight: 10
  },
  itemSaleOff: {
    textDecorationLine: 'line-through', 
    color: '#9E9E9E', 
    fontSize: 11, 
    marginTop: 2
  },
  deliveryfeeContainer: {
    borderWidth: 1, 
    borderColor: '#FDDC8C', 
    marginLeft: 15, 
    marginRight: 15, 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 15,
  },
  imageContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    padding: 15, 
    borderBottomColor: '#F7F7FA' 
  },
  image:{ 
    width: 18, 
    height: 18, 
    resizeMode: 'stretch'
  },
  shopVoucher: {
    marginLeft: 10, 
    fontFamily: FONT.REGULAR, 
    fontSize: 13
  },
  shopName:{
    marginLeft: 10, 
    fontFamily: FONT.BOLD
  }
})