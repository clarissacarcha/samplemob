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

import { PopupModalComponent } from '../../../../Components/Modals/Popup';

export const ApplyVoucherForm = (address, customer, payload) => {

	const {i, item, subTotal} = payload
	const dispatch = useDispatch()

  const CheckoutContextData = useContext(CheckoutContext)

  const [voucherIsValid, setVoucherIsValid] = useState(0)
  const [vcode, setvcode] = useState("")
  const [loading, setloading] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [errormessage, seterrormessage] = useState("*Invalid voucher code. Please check your voucher code.")

  useEffect(() => {
    setloading(CheckoutContextData.voucherReloading)
  }, [CheckoutContextData?.voucherReloading])

  const [getShippingHashDeliveryAmount, {error, loading2}] = useLazyQuery(GET_HASH_AMOUNT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getHashDeliveryAmount){
        CheckoutContextData.setShippingVouchers(response.getHashDeliveryAmount.data)
        setSucceeded(false)
        setvcode("")
        console.log("NEW SHIPPING DATA", JSON.stringify(response.getHashDeliveryAmount.data))
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const [getDefaultHashDeliveryAmount, {error2, loading3}] = useLazyQuery(GET_HASH_AMOUNT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getHashDeliveryAmount){
        CheckoutContextData.setDefaultVouchers(response.getHashDeliveryAmount.data)
        setSucceeded(false)
        setvcode("")
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const validate = async () => {

    const shopProducts = item.data[0]
      
    const orders = item.data[0].map((data) => {
      return {
        product_id: data.id,
        amount: data.amount,
        total_amount: data.amount * data.qty,
        srp_amount: data.product.price,
        srp_totalamount: data.product.price * data.qty,
        quantity: data.qty
      }
    })

    let payload = {
      shop: item.shop.id,
      branch: 0,
      code: vcode,
      region: address.regionId,
      email: customer.email,
      subtotal: subTotal,
      promo_count: 0,
      payment_method: "TOKTOKWALLET",
      orders: orders
    }

    if(vcode == "MAGIC"){
      payload = {
        "branch": 23,
        "shop": item.shop.id,
        "code": "BRYANFREE",
        "region": "03",
        "email": "vdomingo@cloudpanda.ph",
        "subtotal": subTotal,
        "promoCount": 0,
        "is_mystery": 0,
        "orders":[]
      }
    }

		console.log("Voucher Payload", JSON.stringify(payload))

    // let index = CheckoutContextData.shippingVouchers.findIndex(a => {      
    //   if(a.autoApply){
    //     let findItem = shopProducts.filter((product) => a.product_id.includes(product.id))
    //     return findItem[0]?.shopId && findItem[0]?.shopId == item.shop.id
    //   }else{
    //     return a.shopid == item.shop.id || a.shop_id == item.shop.id
    //   }
    // })

    // console.log("VOUCHER INDEXXXXX", index)
    // return

    setloading(true)
      
    const req = await ApiCall("validate_voucher", payload, false)
    CheckoutContextData.setVoucherErrors(prevState => prevState.filter(id => item.shop.id !== id))

    console.log("Voucher", JSON.stringify(req))
    console.log("Shipping Fee", JSON.stringify(CheckoutContextData.shippingFeeRates))

    setloading(false)

    if(req.responseData && req.responseData.success){

      if(req.responseData.type == "shipping"){

        let currentDiscount = CheckoutContextData.getShopShippingDiscount(item.shop.id)
        if(currentDiscount <= 0){
          setVoucherIsValid(-1)
          CheckoutContextData.setVoucherErrors(prevState => [...prevState, item.shop.id])
          seterrormessage("This voucher is not applicable when you have another voucher.")
          setloading(false)
          setSucceeded(false)
          return
        }

        setSucceeded(true)
          
        let items = ArrayCopy(CheckoutContextData.shippingVouchers)

        if(req.responseData.voucher.amount == 0 && req.responseData.voucher.is_percentage == 0){
          
          // let fee = parseFloat(CheckoutContextData.shippingFeeRates[index].shippingfee)
          let fee = CheckoutContextData.getShippingFeeByShopId(item.shop.id)

          //FREE SHIPPING
          // items[index] = req.responseData.voucher
          // items[index].discountedAmount = 0
          // items[index].discount = 0
          // items[index].deduction = fee

          items.push({
            ...req.responseData.voucher, 
            discountedAmount: 0, 
            discount: 0, 
            deduction: fee,
            voucherCodeType: req.responseData.type
          })

          getShippingHashDeliveryAmount({variables: {
            input: {
              items: items
            }
          }})

        }else if(req.responseData.voucher.is_percentage == 1){

          // let fee = parseFloat(CheckoutContextData.shippingFeeRates[index].shippingfee)
          let fee = CheckoutContextData.getShippingFeeByShopId(item.shop.id)
          let pct = (parseFloat(req.responseData.voucher.amount) * 0.01)
          let pctvalue = fee * pct
          let calculatedDiscount = fee - pctvalue

          // items[index] = req.responseData.voucher
          // items[index].discountedAmount = calculatedDiscount < 0 ? 0 : calculatedDiscount
          // items[index].discount = calculatedDiscount < 0 ? 0 : calculatedDiscount

          items.push({
            ...req.responseData.voucher, 
            discountedAmount: calculatedDiscount < 0 ? 0 : calculatedDiscount, 
            discount: calculatedDiscount < 0 ? 0 : calculatedDiscount,
            voucherCodeType: req.responseData.type
          })

          getShippingHashDeliveryAmount({variables: {
            input: {
              items: items
            }
          }})

        }else{

          //
          let fee = CheckoutContextData.getShippingFeeByShopId(item.shop.id)
          let calculatedDiscount = parseFloat(fee) - req.responseData.voucher.amount            

          // items[index] = req.responseData.voucher
          // items[index].discountedAmount = calculatedDiscount < 0 ? 0 : calculatedDiscount
          // items[index].discount = calculatedDiscount < 0 ? 0 : calculatedDiscount

          items.push({
            ...req.responseData.voucher, 
            discountedAmount: calculatedDiscount < 0 ? 0 : calculatedDiscount, 
            discount: calculatedDiscount < 0 ? 0 : calculatedDiscount,
            voucherCodeType: req.responseData.type
          })

          getShippingHashDeliveryAmount({variables: {
            input: {
              items: items
            }
          }})
          
        }

      }else if(req.responseData.type == "promotion"){

        setSucceeded(true)
        let items = ArrayCopy(CheckoutContextData.shippingVouchers)
        items.push({...req.responseData.voucher, voucherCodeType: req.responseData.type})
        getShippingHashDeliveryAmount({variables: {
          input: {
            items: items
          }
        }})

      }else{

        setSucceeded(true)
        //DEFAULT
        let items = ArrayCopy(CheckoutContextData.defaultVouchers)
        // items[index] = req.responseData.voucher
        // items[index].discountedAmount = req.responseData.voucher.amount
        // items[index].discount = req.responseData.voucher.amount

        items.push({
          ...req.responseData.voucher, 
          discountedAmount: req.responseData.voucher.amount, 
          discount: req.responseData.voucher.amount,
          voucherCodeType: req.responseData.type
        })

        getDefaultHashDeliveryAmount({variables: {
          input: {
            items: items
          }
        }})
      }

      setVoucherIsValid(2)
      console.log(req.responseData)
      CheckoutContextData.setVoucherErrors(prevState => prevState.filter(id => item.shop.id !== id))

    }else{

      setVoucherIsValid(-1)
        
      // let items1 = ArrayCopy(CheckoutContextData.shippingVouchers)
      // let items2 = ArrayCopy(CheckoutContextData.defaultVouchers)
      // items1.splice(index, 1)
      // items2.splice(index, 1)
      // CheckoutContextData.setShippingVouchers(items1)
      // CheckoutContextData.setDefaultVouchers(items2)
      CheckoutContextData.setVoucherErrors(prevState => [...prevState, item.shop.id])

      console.log("asdasdasdasdasd")
      console.log(req.responseError)

      if(req.responseError && req.responseError.field_errors){
        let message = req.responseError.field_errors[`shop_${item.shop.id}_vcode`]
        if(message.includes("not valid")){
          seterrormessage("Invalid voucher code. Please check your voucher code.")
        }else{
          seterrormessage(req.responseError.field_errors[`shop_${item.shop.id}_vcode`])
        }
          
      }else if(req.responseError && req.responseError.message){
        seterrormessage(req.responseError.message)
      }else{
        seterrormessage("Invalid voucher code. Please check your voucher code.")
        // seterrormessage("Invalid voucher code. Please check your voucher code.")
				// seterrormessage("Subtotal for this shop does not meet the minimum required price for this voucher.")
      }

    }
    setloading(false)
  }

  const displaySuccess = () => {
    setTimeout(() => {
      setSucceeded(false)
    }, 1300)
  }

  // console.log("test", CheckoutContextData.voucherErrors)
  return (
    <>

      {/* LOADING POPUP */}
      <PopupModalComponent isVisible={loading} type="Loading" label='Applying Voucher' />

      {/* ON SUCCESS POPUP */}
      <PopupModalComponent isVisible={succeeded} type="Success" label='Voucher Applied' />

      <View>
        {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              paddingHorizontal: 5,
              paddingVertical: 15,
              borderBottomColor: '#F7F7FA',
            }}>
            <Text style={{marginLeft: 10, fontFamily: FONT.BOLD}}>{item.shop.shopname} vouchers</Text>
          </View> */}



          <View style={{paddingHorizontal: 15, paddingVertical: 15}}>

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  padding: Platform.OS === 'ios' ? 10 : 0,
                  backgroundColor: '#F8F8F8',
                  marginTop: voucherIsValid == -1 ? 10 : 0,
                  borderRadius: 5,
                  flexDirection: 'row',
                  borderWidth: voucherIsValid == -1 ? 1 : 0, 
                  borderColor: voucherIsValid == -1 ? '#ED3A19' : ''
                }}>
                <TextInput
                  autoCapitalize="characters"
                  value={vcode.toUpperCase()}
                  style={{marginLeft: 10, flex: 1}}
                  placeholder="Enter voucher code (optional)"
                  placeholderTextColor="gray"    
                  onChangeText={(val) => {
                    CheckoutContextData.setVoucherErrors(prevState => prevState.filter(id => item.shop.id !== id))
                    setvcode(val);
                    setVoucherIsValid(0);
                  }}
                />                
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
            {!loading && voucherIsValid == -1 && (
              <View style={{backgroundColor: '#fff', padding: 4}}>
                <Text style={{color: '#ED3A19', fontSize: 12}}>
                  {errormessage}
                </Text>
              </View>
            )}
          </View>
        </View>
      </>
    );
  }