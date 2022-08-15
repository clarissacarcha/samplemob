import React, {useState, useEffect, useRef, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Platform, Dimensions } from 'react-native';

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
import Icons from '../../../../Components/Icons';
import { EventRegister } from 'react-native-event-listeners';

export const Shops = ({address, customer, raw, shipping, shippingRates, retrieve, referral}) => {

  const dispatch = useDispatch()

  const CheckoutContextData = useContext(CheckoutContext)

  const [data, setData] = useState(raw || [])
  const [shippingFeeRates, setShippingFeeRates] = useState(CheckoutContextData.shippingFeeRates)
  const [shippingVouchers, setShippingVouchers] = useState(CheckoutContextData.shippingVouchers)
  const [numAppliedShippingVouchers, setNumAppliedShippingVouchers] = useState(0)
  const [numAppliedPromoVouchers, setNumAppliedPromoVouchers] = useState(0)
  
  useEffect(() => {
    setData(raw)
  }, [raw])  

  useEffect(() => {
    
    setShippingFeeRates(CheckoutContextData.shippingFeeRates)
    setShippingVouchers(CheckoutContextData.shippingVouchers)

    const numOfShipVouchers = CheckoutContextData.shippingVouchers.filter((a) => a.valid != undefined)
    const numOfPromoVouchers = CheckoutContextData.shippingVouchers.filter((a) => a.voucher_id != undefined)
    setNumAppliedShippingVouchers(numOfShipVouchers.length)
    setNumAppliedPromoVouchers(numOfPromoVouchers.length)

  }, [CheckoutContextData])

  const computeTotal = (item, raw = false) => {
    let total = 0
    for (let i = 0; i < item.length; i++){
      if(i == 0 && referral && referral?.referralCode != null || referral && referral?.franchiseeCode != null){
        let shopDiscount = CheckoutContextData.getShopItemDiscount(item[i].shopId)
        if(shopDiscount){
          total = total + parseFloat(item[i].product.compareAtPrice)
        }else{
          // total = total + parseFloat(item[i].product.price)
          total = total + parseFloat(item[i].product.price * item[i].qty)
        }        
      }else{
        total = total + parseFloat(item[i].amount)
      }      
    }
    if(raw){
      return total == NaN ? 0 : total
    }else{
      return FormatToText.currency(total == NaN ? 0 : total)
    }    
  }

  const getImageSource = (images) => {
    if(images && images.length > 0){
      return {uri: images[0]?.filename}
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
            source = {getImageSource(product?.images)} 
            style ={styles.itemImage}/>
            <View style = {styles.itemInfoContainer}>
              <Text style={styles.itemNameText}>{product?.name ? product?.name.trim() : product?.itemname.trim()}</Text>
              <Text style ={styles.itemVariationText}>Variation: {product.variant || 'None'}</Text>
              <View style = {styles.itemPriceContainer}>
                <View style = {styles.itemPriceSubContainer}>
                  <Text style ={styles.itemprice}>{FormatToText.currency(product?.price)}</Text>
                  <Text style ={styles.itemSaleOff}>{parseFloat(product?.compareAtPrice) != "0.00" ? FormatToText.currency(product?.compareAtPrice) : ""}</Text>
                </View>
                <Text style ={styles.itemQuantityText}>Qty: {item.qty}</Text>
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
        let shippingIndex = shippingFeeRates.findIndex((e) => e.shopid == id)
        let voucherIndex = shippingVouchers.findIndex((e) => e != null && e.shop_id == id)

        // console.log("Get Discount", shippingIndex, voucherIndex)
        if(shippingIndex > -1 && voucherIndex > -1){
          
          let shippingfee = shippingFeeRates[shippingIndex]?.shippingfee
          let voucheramount = shippingVouchers[voucherIndex]?.amount
  
          if(shippingfee && voucheramount && shippingfee - voucheramount < 0){
            discount = 0
          }else{
            discount = shippingVouchers[voucherIndex]?.discount
          }
        }

        return (
          <>
            <View style={styles.shippingFeeContainer}>
              <View style={styles.shippingFeeTitle}>
                <Text>Shipping Fee: </Text>
              </View>
              <View style={styles.shippingFeeTotalContainer}>
                <Text 
                  style={styles.shippingFeeTotalText}
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

        if(discount == null){
          return (
            <>
              <View style={styles.shippingFeeContainer}>
                <View style={styles.shippingFeeTitle}>
                  <Text>Shipping Fee: </Text>
                </View>
                <View style={styles.shippingFeeTotalContainer}>
                  <Text 
                    style={styles.shippingFeeTotalText}
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
              <View style={styles.shippingFeeContainer}>
                <View style={styles.shippingFeeTitle}>
                  <Text>Shipping Fee: </Text>
                </View>
                <View style={styles.shippingFeeTotalContainer}>
                  <Text 
                    style={styles.shippingFeeTotalText}
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
        if(shippingFeeRates.length > 0){
          let index = shippingFeeRates.findIndex((e) => e.shopid == id)

          if(index > -1){
            let rates = shippingFeeRates[index]
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
              <Text style = {styles.receiveText}>Receive by {shipping?.deliveryDate || "Add address to calculate"} </Text>
            </View>
            <View style={styles.orderContainer}>
              <View style={{flex: 0}}>
                <Text>Order total ({countItems(item.data[0]) || 0} {countItems(item.data[0]) > 1 ? `items` : 'item'}): </Text>
              </View>              
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>{computeTotal(item.data[0]) || 0}</Text>
              </View>
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

      const ListVouchers = ({type}) => {

        const shopProducts = item.data[0]

        return (
          <>
            <View style={styles.voucherContainer}>
              {CheckoutContextData.shippingVouchers
              .filter((a) => a.voucherCodeType == type)
              .filter((a) => {         
                  
                if(a.shopid == shop.id || a.shop_id == shop.id){
                  if(type == "promotion"){
                    return a.voucher_id != undefined
                  }else if(type == "shipping"){
                    return a.valid != undefined
                  }
                }else if(a?.shop_id == "0" || a?.shopid == "0"){
                  let findItem = shopProducts.filter((product) => a.product_id.includes(product.id))
                  return findItem[0]?.shopId && findItem[0]?.shopId == shop.id
                }else if(typeof a?.shop_id == "string" && a?.shop_id.includes(",")){
                 return a?.appliedToShop == shop.id
                }else if(a.autoApply){
                  //CHECK AUTO APPLIED VOUCHERS SHOP BY FINDING DISCOUNTED PRODUCTS 
                  let findItem = shopProducts.filter((product) => a.product_id.includes(product.id))
                  return findItem[0]?.shopId && findItem[0]?.shopId == shop.id
                }else{
                  return false
                }                
              }).map((item) => {

                if(
                  item?.autoApply && item?.voucherCodeType == type || 
                  item?.autoShipping && item?.voucherCodeType == type
                ){
                  return (
                    <>
                      <View style={{...styles.voucherBody, backgroundColor: '#FDBA1C'}}>
                        <Text ellipsizeMode='tail' style={styles.voucherText}>{item?.voucher_name || item?.vname}</Text>                        
                      </View>
                    </>
                  )
                }else{
                  return (
                    <>
                      <View style={{...styles.voucherBody,  backgroundColor: '#F6841F'}}>
                        <Text ellipsizeMode='tail' style={styles.voucherText}>{item?.voucher_name || item?.vname}</Text>
                        <TouchableOpacity onPress={() => CheckoutContextData.deleteVoucher(item)} style={styles.deleteButton}>
                          <Icons.AIcon name='close' size={12} color="#fff" />
                        </TouchableOpacity>
                      </View> 
                    </>
                  )
                }
              })}   
            </View>
          </>
        )
      }

      const RenderShopVouchers = () => {

        return (
          <>
          <View>
            <View style ={styles.shopVoucherContainer}>
              <Image source={voucherIcon} style={styles.shopVoucherIcon} /> 
              <Text style = {styles.shopVoucherTitle}>Shop Vouchers</Text>
            </View>            
            <ListVouchers type="promotion" origin={"promotions"} autoapplied={true} />
          </View>
          </>
        )
      }
      
      return(
        <>
        <View style={styles.container}>
          <View style={styles.shopNameContainer}>
            <Image source={getStoreLogo(shop.profileImages.logo || {})} style={styles.shopNameIcon} /> 
            <Text style = {styles.shopNameText}>{shop.shopname}</Text>
          </View>
          <View style={styles.renderItemsContainer}>
            {renderItems(item.data[0])}
          </View>

          <View style={styles.divider1} />

          {numAppliedPromoVouchers > 0 && <RenderShopVouchers />}
                    
          <TouchableOpacity style={styles.deliveryfeeContainer} >

            {getIsShippingServiceAreaInvalid(shop.id) ? renderInvalidShipping() : renderValidShipping(i, shipping, item, shop.id)}

          </TouchableOpacity>

          <View style={styles.divider2} />

          {numAppliedShippingVouchers > 0 && 
          <View>
            <ListVouchers type="shipping" />
          </View>}

          {ApplyVoucherForm(address, customer, {
            index: i,
            item: item,
            subTotal: computeTotal(item.data[0], true)})}

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
    backgroundColor: '#F7F7FA'
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
    height: 65,
    width: 50,
    borderRadius:5
  },
  itemInfoContainer: {
    marginLeft: 15,
    flex: 1 
  },
  itemNameText: {
    fontSize:13,
    fontWeight:'400'
  },
  itemVariationText: {
    color: '#525252',
    fontSize: 11,
    paddingVertical:3
  },
  itemPriceContainer: {
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  itemPriceSubContainer: {
    flexDirection: 'row'
  },
  itemprice: {
    color: '#F6841F',
    marginRight: 10,
    fontSize:13
  },
  itemSaleOff: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
    fontSize: 11
  },
  itemQuantityText: {
    color: '#525252',
    fontSize:13
  },
  deliveryfeeContainer: {
    borderWidth: 1,
    borderColor: '#FDDC8C',
    marginLeft: 15,
    marginRight: 15,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  },
  voucherContainer: {
    flexDirection: 'row',
    padding: 15,
    flexWrap: 'wrap'
  },
  voucherBody: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 2,
    marginRight: 15
  },
  voucherText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: FONT.BOLD
  },
  shippingFeeContainer: {
    flexDirection: 'row'
  },
  shippingFeeTitle: {
    flex: 0
  },
  shippingFeeTotalContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  shippingFeeTotalText: {
    textDecorationLine: "none",
    color: '#000'
  },
  receiveText: {
    marginBottom: 7,
    color: '#929191'
  },
  orderContainer: {
    flexDirection: 'row'
  },
  totalContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  totalText: {
    fontSize: 14,
    fontFamily: FONT.BOLD,
    color: "#F6841F"
  },
  deleteButton: {
    marginLeft: 5,
    justifyContent: 'center'
  },
  shopVoucherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 15,
    borderBottomColor: '#F7F7FA'
  },
  shopVoucherIcon: {
    width: 20,
    height: 20,
    resizeMode: 'stretch'
  },
  shopVoucherTitle: {
    marginLeft: 10,
    fontFamily: FONT.REGULAR,
    fontSize: 13
  },
  shopNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 15,
    borderBottomColor: '#F7F7FA'
  },
  shopNameIcon: {
    width: 18,
    height: 18,
    resizeMode: 'stretch'
  },
  shopNameText: {
    marginLeft: 10,
    fontFamily: FONT.BOLD
  },
  renderItemsContainer: {
    padding: 15
  },
  divider1: {
    height: 1,
    marginTop: 10,
    backgroundColor: "#F7F7FA"
  },
  divider2: {
    height: 8,
    marginTop: 5,
    backgroundColor: "#F7F7FA"
  },
})