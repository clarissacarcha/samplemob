import React, {useState, useEffect, useRef, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Platform } from 'react-native';

import { FONT } from '../../../../../res/variables';
import {placeholder} from '../../../../assets';
import { Price, FormatToText } from '../../../../helpers/formats';

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_APPLY_VOUCHER } from '../../../../../graphql/toktokmall/model';
import {ApiCall, ArrayCopy} from '../../../../helpers';

import CustomIcon from '../../../../Components/Icons';
import Spinner from 'react-native-spinkit';

import {CheckoutContext} from '../ContextProvider';

export const Shops = ({address, customer, raw, shipping, shippingRates, retrieve}) => {

  const CheckoutContextData = useContext(CheckoutContext)

  const [data, setData] = useState(raw || [])
  const [voucherIsValid, setVoucherIsValid] = useState(0)
  const [vcode, setvcode] = useState("")
  const [loading, setloading] = useState(false)

  const [validateShopVoucher, {error, loading2}] = useLazyQuery(GET_APPLY_VOUCHER, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      console.log("Response", response)
      if(response.applyVoucher){

        setVoucherIsValid(2)
        setShopVoucher(response.applyVoucher)
        
      }else{
        setVoucherIsValid(-1)
        setVoucher(null)
      }
    },
    onError: (err) => {
      console.log(err)
      setVoucherIsValid(-1)
    }
  })

  useEffect(() => {
    setData(raw)
  }, [raw])  

  const computeTotal = (item, raw = false) => {
    let total = 0
    for (let i = 0; i < item.length; i++){
      total = total + (parseFloat(item[i].amount) * item[i].qty)
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
                <Text style ={{ color: '#9E9E9E' }}>Variation: {product.variant || "None"}</Text>
                <Text style ={{ color: '#9E9E9E'}}>Qty: {item.qty}</Text>
              </View>
            </View>
          </View>
        )
      })
  }  

  const renderVoucherForm = (index, item, subTotal) => {

    const validate = async () => {
      
      let payload = {
        shop: item.shop.id,
        code: vcode,
        region: address.regionId,
        email: customer.email,
        subtotal: subTotal,
        promo_count: 1,
        is_mystery: 0
      }

      setloading(true)
      const req = await ApiCall("validate_voucher", payload, true)
      if(req.responseData && req.responseData.success){

        if(req.responseData.type == "shipping"){
          
          let items = ArrayCopy(CheckoutContextData.shippingVouchers)

          if(req.responseData.voucher.amount == 0){
            
            //FREE SHIPPING
            items[index] = req.responseData.voucher
            items[index].discountedAmount = 0
            items[index].discount = 0
            CheckoutContextData.setShippingVouchers(items)

          }else{

            //
            let calculatedDiscount = parseFloat(CheckoutContextData.shippingFeeRates[index].shippingfee) - req.responseData.voucher.amount            

            items[index] = req.responseData.voucher
            items[index].discountedAmount = calculatedDiscount < 0 ? 0 : calculatedDiscount
            items[index].discount = calculatedDiscount < 0 ? 0 : calculatedDiscount
            // items[index].discount = calculatedDiscount
            console.log("Shipping Item", items[index])
            CheckoutContextData.setShippingVouchers(items)
          
          }

        }else{

          //DEFAULT
          let items = ArrayCopy(CheckoutContextData.defaultVouchers)
          items[index] = req.responseData.voucher
          CheckoutContextData.setDefaultVouchers(items)
        }

        setVoucherIsValid(2)
        console.log(req.responseData)

      }else{

        setVoucherIsValid(-1)
        
        let items1 = ArrayCopy(CheckoutContextData.shippingVouchers)
        let items2 = ArrayCopy(CheckoutContextData.defaultVouchers)
        items1.splice(index, 1)
        items2.splice(index, 1)
        CheckoutContextData.setShippingVouchers(items1)
        CheckoutContextData.setDefaultVouchers(items2)

      }
      setloading(false)
    }
  
    return (
      <>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              paddingHorizontal: 5,
              paddingVertical: 15,
              borderBottomColor: '#F7F7FA',
            }}>
            <Text style={{marginLeft: 10, fontFamily: FONT.BOLD}}>{item.shop.shopname} vouchers</Text>
          </View>

          <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
            {!loading && voucherIsValid == -1 && (
              <View style={{backgroundColor: '#FFFCF4', padding: 10}}>
                <Text style={{color: '#F6841F', fontSize: 12, textAlign: 'center'}}>
                  *Invalid voucher code. Please check your voucher code.
                </Text>
              </View>
            )}

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  padding: Platform.OS === 'ios' ? 10 : 0,
                  backgroundColor: '#F8F8F8',
                  marginTop: voucherIsValid == -1 ? 10 : 0,
                  borderRadius: 5,
                  flexDirection: 'row',
                }}>
                <TextInput
                  value={vcode}
                  style={{marginLeft: 10, flex: 1}}
                  placeholder="Input voucher (optional)"
                  placeholderTextColor="gray"
                  onChangeText={(val) => {
                    setvcode(val);
                    setVoucherIsValid(0);
                  }}
                />
                <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    {loading && (
                      <Spinner
                        isVisible={loading}
                        // isVisible={true}
                        type={'FadingCircleAlt'}
                        color={'#F6841F'}
                        size={15}
                      />
                    )}
                    {!loading && voucherIsValid == 2 && (
                      <CustomIcon.FeIcon name="check-circle" size={15} color="#06A44E" />
                    )}
                    {!loading && voucherIsValid == -1 && (
                      <CustomIcon.FA5Icon name="times-circle" size={15} color="#F6841F" />
                    )}
                  </View>
                </View>
              </View>
              <TouchableOpacity
                disabled={vcode == ''}
                onPress={() => {
                  if (vcode == '') return;
                  // validateShopVoucher({variables: {
                  //   input: {
                  //     vcode: vcode,
                  //     shopId: item.shop.id
                  //   }
                  // }})
                  validate();
                }}
                style={{
                  flex: 0,
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  backgroundColor: 'white',
                }}>
                <Text style={{color: vcode == '' ? '#9E9E9E' : '#F6841F', marginTop: 5}}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }

  const renderShops = () => {

    return data.map((item, i) => {

      const shop = item.shop

      const getStoreLogo = (raw) => {
        let loc = require("../../../../assets/icons/store.png")
        if(typeof raw == "string") return {uri: raw}
        else return loc
      }

      const getDiscount = (id, type) => {
        if(type == "shipping"){

          let index = CheckoutContextData.shippingFeeRates.findIndex((e) => e.shopid == shop.id)
          console.log(index)
          if(index > -1){
            let shippingfee = CheckoutContextData.shippingFeeRates[index]?.shippingfee
            let voucheramount = CheckoutContextData.shippingVouchers[index]?.amount
  
            if(shippingfee && voucheramount && shippingfee - voucheramount < 0){
              return 0
            }else{
              return CheckoutContextData.shippingVouchers[index]?.discount
            }
          }
        }
      }

      const getOriginalShippingFee = (id) => {
        if(CheckoutContextData.shippingFeeRates.length > 0){
          let index = CheckoutContextData.shippingFeeRates.findIndex((e) => e.shopid == shop.id)

          if(index > -1){
            let rates = CheckoutContextData.shippingFeeRates[index]
            // console.log("Rates shopid: " + shop.id, rates)
            return rates.original_shipping
          }         
        }else{
          return "Calculating"
        }
      }

      const getIsShippingServiceAreaInvalid = (index) => {
        if(CheckoutContextData.unserviceableShipping.length > 0){
          return CheckoutContextData.unserviceableShipping[index] != null
        }else{
          return false
        }
      }

      const renderValidShipping = (i, shipping, item, shopid) => {
        return (
          <>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0}}>
                <Text>Delivery Fee: </Text>
              </View>
              <View style={{flex: 0}}>
                <Text 
                  style={{
                    textDecorationLine: getDiscount(shopid, "shipping") != null ? "line-through" : "none",  
                    color: getDiscount(shopid, "shipping") != null ? "#929191" :'#000'
                  }}
                >
                  {FormatToText.currency(getOriginalShippingFee(shopid))}
                </Text>
              </View>
              <View style={{flex: 0}}>
                <Text> {getDiscount(shopid, "shipping") != null ? FormatToText.currency(getDiscount(shopid, "shipping")) : ""}</Text>
              </View>
            </View>

            <View>
              <Text>Order total ({item.data.length} {item.data.length > 1 ? `items` : 'item'}): {computeTotal(item.data[0]) || 0} </Text>
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
      
      return(
        <>
        <View style={styles.container}>
          <View style ={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, padding: 15, borderBottomColor: '#F7F7FA'}}>
            <Image source={getStoreLogo(shop.profileImages.logo || {})} style={{width: 18, height: 18, resizeMode: 'stretch'}} /> 
            <Text style = {{marginLeft: 10, fontFamily: FONT.BOLD}}>{shop.shopname}</Text>
          </View>
          <View style={{padding: 15}}>
            {renderItems(item.data[0])}
          </View>
          <TouchableOpacity style={styles.deliveryfeeContainer} >

            {getIsShippingServiceAreaInvalid(i) ? renderInvalidShipping() : renderValidShipping(i, shipping, item, shop.id)}

          </TouchableOpacity>

          {renderVoucherForm(i, item, computeTotal(item.data[0], true))}

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
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 0, backgroundColor: 'white', marginTop: 8,  },
  itemContainer: {flexDirection: 'row', justifyContent: 'flex-start'},
  itemImage: {flex: 0.3, height: 100, width: 100},
  itemprice: {color: '#F6841F', marginRight: 10},
  itemSaleOff: {textDecorationLine: 'line-through', color: '#9E9E9E', fontSize: 11, marginTop: 2},
  deliveryfeeContainer: {borderWidth: 1, borderColor: '#FDDC8C', marginLeft: 15, marginRight: 15, padding: 10, borderRadius: 5, marginBottom: 15,}
})