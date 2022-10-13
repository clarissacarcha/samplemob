import React, { useState, useEffect, useRef, useContext} from 'react';
import {
  StyleSheet, 
  View, 
  Text, 
  ImageBackground,
  Image, 
  TouchableOpacity, 
  FlatList, 
  ScrollView, 
  TextInput, 
  Picker, 
  Platform 
} from 'react-native';
import { 
  useLazyQuery,
  useQuery, 
  useMutation 
} from '@apollo/react-hooks';
import { 
  GET_APPLY_VOUCHER, 
  GET_HASH_AMOUNT 
} from '../../../../../graphql/toktokmall/model';
import {
  placeholder, 
  success2, 
  voucherIcon
} from '../../../../assets';
import { 
  Price, 
  FormatToText 
} from '../../../../helpers/formats';
import {
  ApiCall, 
  ArrayCopy
} from '../../../../helpers';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { PopupModalComponent } from '../../../../Components/Modals/Popup';
import { CheckoutContext} from '../ContextProvider';
import { useDispatch } from 'react-redux';
import { FONT } from '../../../../../res/variables';
import CustomIcon from '../../../../Components/Icons';
import Spinner from 'react-native-spinkit';

export const ApplyVoucherForm = (address, customer, referral, payload) => {

	const {i, item, subTotal} = payload
	const dispatch = useDispatch()

  const CheckoutContextData = useContext(CheckoutContext)

  const [voucherIsValid, setVoucherIsValid] = useState(0)
  const [vcode, setvcode] = useState("")
  const [loading, setloading] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [voucherRemoved, setVoucherRemoved] = useState(false)
  const [errormessage, seterrormessage] = useState("*Invalid voucher code.")

  useEffect(() => {
    setVoucherRemoved(CheckoutContextData.voucherRemoved)
  }, [CheckoutContextData?.voucherRemoved])

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
      if(referral && referral?.referralCode != null || referral && referral?.franchiseeCode != null){
        return {
          product_id: data.id,
          amount: data.amount,
          total_amount: data.amount * data.qty,
          srp_amount: data.product.compareAtPrice,
          srp_totalamount: data.product.compareAtPrice * data.qty,
          quantity: data.qty
        }
      }else{
        return {
          product_id: data.id,
          amount: data.amount,
          total_amount: data.amount * data.qty,
          srp_amount: data.product.price,
          srp_totalamount: data.product.price * data.qty,
          quantity: data.qty
        }
      }      
    })

    let payload = {
      shop: item.shop.id,
      branch: CheckoutContextData.getShopBranchId(item.shop.id),
      code: vcode,
      region: address.regionId,
      email: customer.email,
      subtotal: subTotal,
      promo_count: CheckoutContextData.getShopDiscountCount(item.shop.id),
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
        "promoCount": CheckoutContextData.shippingVouchers.length,
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
        if(currentDiscount != null && currentDiscount <= 0){
          setVoucherIsValid(-1)
          CheckoutContextData.setVoucherErrors(prevState => [...prevState, item.shop.id])
          seterrormessage("This voucher is not applicable when you have another voucher.")
          setloading(false)
          setSucceeded(false)
          return
        }

        //CHECK IF VOUCHER ALREADY APPLIED
        let checkVoucherIfAlreadyApplied = CheckoutContextData.getVouchersApplied(item.shop.id, req.responseData.voucher)
        if(checkVoucherIfAlreadyApplied){
          setVoucherIsValid(-1)
          CheckoutContextData.setVoucherErrors(prevState => [...prevState, item.shop.id])
          seterrormessage("You have already applied this voucher.")
          setloading(false)
          setSucceeded(false)
          return
        }

        // setSucceeded(true)
        displayModal()
          
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
            hashAmount: 0,
            voucherCodeType: req.responseData.type,
            appliedToShop: item.shop.id
          })

          getShippingHashDeliveryAmount({variables: {
            input: {
              items: items
            }
          }})

        }else if(parseFloat(req.responseData.voucher.amount) != 0 && req.responseData.voucher.is_percentage == 0){
          
          let fee = CheckoutContextData.getShippingFeeByShopId(item.shop.id)
          let amount = parseFloat(req.responseData.voucher.amount)
          let calculatedDiscount = parseFloat(fee) - amount
          let discount = amount

          if(amount > parseFloat(fee)){
            discount = fee
          }

          items.push({
            ...req.responseData.voucher, 
            deduction: discount,
            discountedAmount: discount, 
            discount: calculatedDiscount < 0 ? 0 : calculatedDiscount,
            hashAmount: calculatedDiscount < 0 ? 0 : calculatedDiscount,
            voucherCodeType: req.responseData.type,
            appliedToShop: item.shop.id
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
            deduction: calculatedDiscount < 0 ? fee : pctvalue,
            discountedAmount: calculatedDiscount < 0 ? 0 : pctvalue, 
            discount: calculatedDiscount < 0 ? 0 : pctvalue,
            hashAmount: calculatedDiscount < 0 ? 0 : calculatedDiscount,
            voucherCodeType: req.responseData.type,
            appliedToShop: item.shop.id
          })

          getShippingHashDeliveryAmount({variables: {
            input: {
              items: items
            }
          }})

        }else{

          //
          let fee = CheckoutContextData.getShippingFeeByShopId(item.shop.id)
          let calculatedDiscount = parseFloat(fee) - parseFloat(req.responseData.voucher.amount)

          // items[index] = req.responseData.voucher
          // items[index].discountedAmount = calculatedDiscount < 0 ? 0 : calculatedDiscount
          // items[index].discount = calculatedDiscount < 0 ? 0 : calculatedDiscount

          items.push({
            ...req.responseData.voucher, 
            deduction: calculatedDiscount < 0 ? fee : calculatedDiscount,
            discountedAmount: calculatedDiscount < 0 ? 0 : calculatedDiscount, 
            discount: calculatedDiscount < 0 ? 0 : calculatedDiscount,
            hashAmount: calculatedDiscount < 0 ? 0 : calculatedDiscount,
            voucherCodeType: req.responseData.type,
            appliedToShop: item.shop.id
          })

          getShippingHashDeliveryAmount({variables: {
            input: {
              items: items
            }
          }})
          
        }

      }else if(req.responseData.type == "promotion"){

        // setSucceeded(true)
        displayModal()
        let items = ArrayCopy(CheckoutContextData.shippingVouchers)
        items.push({...req.responseData.voucher, appliedToShop: item.shop.id, voucherCodeType: req.responseData.type})
        getShippingHashDeliveryAmount({variables: {
          input: {
            items: items
          }
        }})

      }else{

        // setSucceeded(true)
        displayModal()
        //DEFAULT
        let items = ArrayCopy(CheckoutContextData.defaultVouchers)
        // items[index] = req.responseData.voucher
        // items[index].discountedAmount = req.responseData.voucher.amount
        // items[index].discount = req.responseData.voucher.amount

        items.push({
          ...req.responseData.voucher, 
          discountedAmount: req.responseData.voucher.amount, 
          discount: req.responseData.voucher.amount,
          voucherCodeType: req.responseData.type,
          appliedToShop: item.shop.id
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
          seterrormessage("Invalid voucher code.")
        }else{
          if(req.responseError.error_code == "004"){
            seterrormessage(CheckoutContextData.getErrorMessageByCode(req.responseError.error_code))
          }else{
            seterrormessage(req.responseError.field_errors[`shop_${item.shop.id}_vcode`])
          }          
        }
      }else if(req.responseError && req.responseError.error_code){
       // 
       seterrormessage(req.responseError.message)
      }else if(req.responseError && req.responseError.message){
        seterrormessage(req.responseError.message)
      }else{
        seterrormessage("Invalid voucher code.")
      }

    }
    setloading(false)
  }

  const displayModal = () => {
    dispatch({type: "TOKTOK_MALL_OPEN_MODAL", payload: {
      ModalContent: () => <View
        style={{
          height: 180,
          width: 180,
          borderRadius: 12,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>            
        <Image source={success2} width={100} height={100} resizeMode="cover" />
        <View style={{marginTop: 20}}>
          <Text style={{color: "#F6841F", fontFamily: FONT.BOLD}} >
            Voucher Applied
          </Text>
        </View>
      </View>,
      autoCloseEnabled: true
    }})
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

      {/* ON SUCCESS REMOVE VOUCHER POPUP */}
      <PopupModalComponent isVisible={voucherRemoved} type="Success" label='Voucher Removed' />

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

          <View style={styles.container}>

            <View style={styles.subContainer}>
              <View style={styles.voucherInputContainer(voucherIsValid)}>
                <TextInput
                  autoCapitalize="characters"
                  value={vcode.toUpperCase()}
                  style={styles.voucherInput}
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
                style={styles.applyButton}>
                <Text style={styles.applyText(vcode)}>Apply</Text>
              </TouchableOpacity>
            </View>
            {!loading && voucherIsValid == -1 && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {errormessage}
                </Text>
              </View>
            )}
          </View>
        </View>
      </>
    );
  }

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 15, 
      paddingVertical: 15
    },
    subContainer: {
      flexDirection: 'row'
    },
    voucherInputContainer: (voucherIsValid) => {
      return {
        flex: 1,
        padding: Platform.OS === 'ios' ? 10 : 0,
        backgroundColor: '#F8F8F8',
        marginTop: voucherIsValid == -1 ? 10 : 0,
        borderRadius: 5,
        flexDirection: 'row',
        borderWidth: voucherIsValid == -1 ? 1 : 0, 
        borderColor: voucherIsValid == -1 ? '#ED3A19' : ''
      }
    },
    voucherInput: {
      marginLeft: 10, 
      flex: 1
    },
    applyButton: {
      flex: 0,
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: 'white',
    },
    applyText: (vcode) => {
      return {
        color: vcode == '' ? '#9E9E9E' : '#F6841F', 
        marginTop: 5
      }
    },
    errorContainer: {
      backgroundColor: '#fff', 
      padding: 4
    },
    errorText: {
      color: '#ED3A19', 
      fontSize: 12
    }
  })