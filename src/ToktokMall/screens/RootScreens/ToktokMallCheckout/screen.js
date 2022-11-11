import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, BackHandler, Alert, EventEmitter } from 'react-native';
import { COLOR, FONT } from '../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight, PopupModalComponent} from '../../../Components';
import { AddressForm, Button, Payment, Shops, Totals, Vouchers, TermsAndCondition, CheckoutModal, MessageModal } from './Components';
import {connect, useDispatch} from 'react-redux'
import { useSelector } from 'react-redux';
import {useFocusEffect, CommonActions} from '@react-navigation/native'

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_CHECKOUT_DATA, POST_CHECKOUT, GET_HASH_AMOUNT, CHECK_ITEM_FROM_CHECKOUT } from '../../../../graphql/toktokmall/model';

import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_WALLET, GET_MY_ACCOUNT, GET_USER_TOKTOK_WALLET_DATA } from 'toktokwallet/graphql'

import {Loading} from '../../../Components/Widgets';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-simple-toast";
import axios from "axios";
import {AlertModal} from '../../../Components/Widgets'
import {emptyPlaceOrder} from "../../../assets"
import {ApiCall, ShippingApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall, BuildOrderLogsList, ArrayCopy, getRefComAccountType, RoundOffValue} from "../../../helpers"

import {CheckoutContext} from './ContextProvider';
import { EventRegister } from 'react-native-event-listeners';

const REAL_WIDTH = Dimensions.get('window').width;

const Component = ({route, navigation, createMyCartSession}) => {

  const CheckoutContextData = useContext(CheckoutContext)
  const toktokSession = useSelector(state => state.session)
  const toktokMall = useSelector(state => state.toktokMall)

  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack = {setAlertTrue}/>,
    headerTitle: () => <HeaderTitle label={['Place Order', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  const scrollViewRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  // const [data, setData] = useState([])
  const [newCartData, setNewCartData] = useState([])
  const [paramsData, setParamsData] = useState([])
  const [addressData, setAddressData] = useState([])

  const [payment, setPaymentMethod] = useState("toktokwallet")
  const [paymentList, setPaymentList] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [vcode, setvCode] = useState("")
  const [voucher, setVoucher] = useState([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [subTotal, setSubTotal] = useState(0)
  const [srpTotal, setSrpTotal] = useState(0)
  const [userId, setUserId] = useState(null)
  const [deliveryFees, setDeliveryFees] = useState([])
  const [receiveDates, setReceiveDates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [alertModal, setAlertModal] =useState(false)
  const [movedScreens, setMovedScreens] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(0)
  const [shippingRates, setShippingRates] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [walletAccount, setWalletAccount] = useState(false)
  const [walletAccountStatus, setWalletAccountStatus] = useState(-1)
  const [walletmodal, setwalletmodal] = useState(false)
  const [customerData, setCustomerData] = useState({})
  const [shippingDiscounts, setShippingDiscounts] = useState([])
  const [franchisee, setFranchisee] = useState({});
  const [TCEnabled, setTCEnabled] = useState(false);
  const [onPressPlaceOrder, setOnPressPlaceOrder] = useState(false);

  const [processingCheckout, setProcessingCheckout] = useState(false)

  const dispatch = useDispatch()

  const setAlertTrue = () => {
    setAlertModal(true)
  }

  const [checkItemFromCheckout] = useLazyQuery(CHECK_ITEM_FROM_CHECKOUT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: async (response) => {
      const {invalidItems, validItems, payload} = response.checkItemFromCheckout
  
      if(invalidItems.length > 0){
        onProductUnavailable(payload, "id")
      }else{
        await postCheckoutSetting(validItems);
      }

    },
    onError: (err) => {
      console.log(err)
    }
  })

  const [getCheckoutData, {error, loading}] = useLazyQuery(GET_CHECKOUT_DATA, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: async (response) => {
      if(response.getCheckoutData){
        let data = response.getCheckoutData
        setAddressData(data.address)
        setFranchisee(data.consumer)        
        await setPaymentList(data.paymentMethods)

        console.log("CHECKOUT RENDER DATA", JSON.stringify(data))

        if(paramsData.length > 0){
          let shippingrates = await getShippingRates(data.shippingRatePayload, data.cartrawdata)
          if(shippingrates.length > 0){
            data.autoShippingPayload.cartitems = shippingrates    
            // await getAutoShipping(data.autoShippingPayload)
            // await getAutoApplyVouchers(data.promotionVoucherPayload)
          }
        }

      }
      setInitialLoading(false)
    },
    onError: (err) => {
      console.log("addressData",err)
      setAddressData([]);
      setPaymentList([])
      setInitialLoading(false)
      // Toast.show("Something went wrong")
    }
  })

  const [getShippingHashDeliveryAmount, {error2, loading2}] = useLazyQuery(GET_HASH_AMOUNT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getHashDeliveryAmount){
        CheckoutContextData.setShippingVouchers(response.getHashDeliveryAmount.data)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const getShippingRates = async (payload, raw) => {
    // console.log(JSON.stringify(raw))
    // console.log(JSON.stringify(payload.cart)) 
    if(!payload) return

    let result = []
    const res = await ShippingApiCall("get_shipping_rate", payload, true)
    if(res.responseData && res.responseData.success == 1){
      result = res.responseData.newCart
      //CHECK IF THERE IS SHIPPING FEE = 0
      let invalidArray = result.filter(item => parseFloat(item?.shippingfee) == 0)
      if(invalidArray.length > 0){
        //THERE IS INVALID
        let validArray = result.filter(item => parseFloat(item?.shippingfee) > 0)
        CheckoutContextData.setShippingFeeRates(validArray)
        CheckoutContextData.setUnserviceableShipping(invalidArray)
      }else{
        CheckoutContextData.setShippingFeeRates(res.responseData.newCart)
        if(res.responseData?.removedCart){
          CheckoutContextData.setUnserviceableShipping(res.responseData.removedCart)   
        }
      }      
    }else if(res.responseError && res.responseError.success == 0){
      CheckoutContextData.setUnserviceableShipping(res.responseError.removedCart)      
    }else{
      CheckoutContextData.setUnserviceableShipping([raw])
    }
    return result
    // setInitialLoading(false)
  }

  const getAutoShipping = async (payload) => {

    //MANAGE BRANCH
    let stotal = payload.subtotal
    payload.cartitems.map((cartitem, index) => {
      stotal[index].branchid = cartitem.branchid
    })
    payload.subtotal = stotal

    setInitialLoading(true)
    const res = await ApiCall("get_autoshipping_discount", payload, true)

    // console.log("AUTO SHIPPING RESULT", JSON.stringify(res))

    if(res.responseData && res.responseData.success){

      // let items = ArrayCopy(initialShippingVouchers)
      let items = ArrayCopy(CheckoutContextData.shippingVouchers)

      if(res.responseData.type == "shipping"){

        await res.responseData.voucher.map(async (item, indexx) => {

          // let shopvoucherIndex = items.findIndex(a => a.shopid == item.shopid)
         
          if(item.type == "shipping"){
            await item.vouchers.map(async (voucher, index) => {
  
              if(parseFloat(voucher.amount) == 0){

                let fee = null
		            payload.cartitems.map((a) => a.shopid == voucher.shop_id ? fee = a.shippingfee : null)
                        
                items.push({
                  ...voucher, 
                  autoShipping: true,
                  discountedAmount: 0,
                  discount: 0,
                  hashAmount: 0,
                  deduction: fee,
                  voucherCodeType: res.responseData.type
                })

              }else if(parseFloat(voucher.amount) != 0 && voucher.is_percentage == 0){
          
                let fee = null
		            payload.cartitems.map((a) => a.shopid == voucher.shop_id ? fee = a.shippingfee : null)

                let amount = parseFloat(voucher.amount)
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
                  voucherCodeType: res.responseData.type
                })
      
                getShippingHashDeliveryAmount({variables: {
                  input: {
                    items: items
                  }
                }})
      
              }else if(voucher.is_percentage == 1){

                let fee = null
		            payload.cartitems.map((a) => a.shopid == voucher.shop_id ? fee = a.shippingfee : null)
                let pct = (parseFloat(voucher.amount) * 0.01)
                let pctvalue = fee * pct
                let calculatedDiscount = fee - pctvalue

                items.push({
                  ...voucher, 
                  autoShipping: true,
                  deduction: calculatedDiscount < 0 ? fee : pctvalue,
                  discountedAmount: calculatedDiscount < 0 ? 0 : pctvalue, 
                  hashAmount: calculatedDiscount < 0 ? 0: calculatedDiscount,
                  discount: calculatedDiscount < 0 ? 0 : calculatedDiscount,
                  voucherCodeType: res.responseData.type
                })

              }else{

                let fee = null
		            payload.cartitems.map((a) => a.shopid == voucher.shop_id ? fee = a.shippingfee : null)
                let discount = parseFloat(fee) - parseFloat(voucher.amount)

                items.push({
                  ...voucher, 
                  autoShipping: true,
                  deduction: discount < 0 ? fee : parseFloat(voucher.amount),
                  discount: discount < 0 ? 0 : discount,
                  discountedAmount: discount < 0 ? 0 : discount,
                  hashAmount: discount < 0 ? 0 : discount,
                  voucherCodeType: res.responseData.type
                })
              }
              
            })  
          }
        })

        getShippingHashDeliveryAmount({variables: {
          input: {
            items: items
          }
        }})

      }

    }else if(res.responseError){
      // Toast.show(res.responseError.message)
    }

  }

  const getAutoApplyVouchers = async (payload) => {
    const res = await ApiCall("validate_autoapply_promotion", {shop_array: payload}, true)
    if(res.responseData && res.responseData.success){
      if(res.responseData.type == "promotion"){
        let items = ArrayCopy(CheckoutContextData.shippingVouchers)        
        const {voucher} = res.responseData
        items.push({...voucher, autoApply: true, voucherCodeType: res.responseData.type})
        getShippingHashDeliveryAmount({variables: {
          input: {
            items: items
          }
        }})
      }
    }
    setInitialLoading(false)
  }

  const  [getToktokWalletData] = useLazyQuery(GET_USER_TOKTOK_WALLET_DATA , {
    fetchPolicy:"network-only",
    variables: {
      input: {
        userId: toktokSession.user.id,
      }
    },
    onCompleted: async ({getUserToktokWalletData})=> {
      const {kycStatus} = getUserToktokWalletData
      setWalletAccountStatus(kycStatus)
      setwalletmodal(true)
    },
    onError: (error)=> console.log(error) 
  })

  //TOKTOK WALLET
  const [ getMyAccount ] = useLazyQuery(GET_MY_ACCOUNT , {
    fetchPolicy: "network-only",
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({ getMyAccount })=> {
      if(getMyAccount){
        setwalletmodal(false)
        setWalletAccount(getMyAccount)
        setWalletAccountStatus(1)
        if(getMyAccount?.wallet?.balance){
          dispatch({ type: "TOKTOK_MALL_SET_TOKTOK_WALLET_BALANCE", payload: getMyAccount?.wallet?.balance})
          setCurrentBalance(getMyAccount?.wallet?.balance)
        }else{
          setCurrentBalance(0)
        }
      }else{
        setwalletmodal(true)
      }
    },
    onError: (error) => {
      console.log(error)
      getToktokWalletData()
    }
  })
  
  const onProductUnavailable = (payload) => {
    setIsLoading(false)
    dispatch({
      type: 'TOKTOK_MALL_OPEN_MODAL',
      payload: {
        type: 'Warning',
        title: 'Unable to Place Order',
        message: 'We’re sorry but some items in your cart is\ncurrently unavailable. Please try again another\ntime.',        
        actions: [
          {
            name: 'OK',
            type: 'fill',
            onPress: async () => {
              
    
              // return //used for debugging
              EventRegister.emit("refreshToktokmallShoppingCart")
    
              navigation.replace("ToktokMallCheckout", {
                ...route.params,
                data: payload
              })
            },
          }
        ]
        
      },
    });
  }

  const onProductUnavailablex = (items, selector) => {

    setIsLoading(false)

    let paramsDataCopy = ArrayCopy(route.params)

    items.map(({id, name, cartQty, noOfStocks, enabled}) => {
      
      if(enabled && noOfStocks != 0 && noOfStocks < cartQty){

      route.params.data.map(({data, ...rest}, index) => {

        let validItems = []
        validItems = data[0].map(item => {
          if(item.id === id){
            return {
              ...item,
              qty: noOfStocks
            }
          }
          return item
        })
        if(validItems.length > 0){
          paramsDataCopy.data[index] = {
            ...rest,
            data: [validItems]
          }
        }else{
          paramsDataCopy.data[index] = null
        }   
      })
      }else {

      route.params.data.map(({data, ...rest}, index) => {

        let validItems = []
        if(selector == "id"){
          validItems = data[0].filter(item => id !== item.id)
        }else if(selector == "name"){
          validItems = data[0].filter(({product}) => name !== product.itemname || product.variant !== name)
        }
        
        if(validItems.length > 0){
          paramsDataCopy.data[index] = {
            ...rest,
            data: [validItems]
          }
        }else{
          paramsDataCopy.data[index] = null
        }          
      })
      }

    })
    
    dispatch({
      type: 'TOKTOK_MALL_OPEN_MODAL',
      payload: {
        type: 'Warning',
        title: 'Unable to Place Order',
        message: 'We’re sorry but some items in your cart is\ncurrently unavailable. Please try again another\ntime.',        
        actions: [
          {
            name: 'OK',
            type: 'fill',
            onPress: async () => {
              let filtered = {
                ...paramsDataCopy,
                data: paramsDataCopy.data.filter((val) => val !== null)
              }
    
              // return //used for debugging
              EventRegister.emit("refreshToktokmallShoppingCart")
    
              navigation.replace("ToktokMallEmptyCheckout", {
                ...route.params,
                data: filtered
              })
            },
          }
        ]
        
      },
    });
  }

  const onVoucherInvalid = (data) => {
    dispatch({
      type: 'TOKTOK_MALL_OPEN_MODAL',
      payload: {
        type: 'Warning',
        title: 'Voucher Removed',
        message: 'We`re sorry but the voucher you used has already expired. Would you like to proceed and remove voucher?',
        actions: [
          {
            name: 'No',
            type: 'transparent',
            onPress: () => {
              dispatch({type: 'TOKTOK_MALL_CLOSE_MODAL'})
            }
          },
          {
            name: 'Yes',
            type: 'fill',
            onPress: () => {
              dispatch({type: 'TOKTOK_MALL_CLOSE_MODAL'})
              
            }
          }
        ],
      },
    });
  }

  const postCheckoutSetting = async () => {

    setIsLoading(true)

    if(payment == 'toktokwallet'){
            
      let transactionPayload = await BuildTransactionPayload({
        method: "TOKTOKWALLET", 
        notes: "", 
        total: RoundOffValue(grandTotal), 
        toktokid: toktokSession.user.id,
        // toktokid: 1,
        // transactionTypeId: "TOKTOKWALLET PAYMENT"
        transactionTypeId: 110
      })
      setIsLoading(false)

           
      const req = await WalletApiCall("request_money", transactionPayload, true)

      if(req.responseData && req.responseData.success == 1){

        let shippingVouchers = CheckoutContextData.shippingVouchers.filter((a) => a.voucherCodeType == "shipping")
        let promotionVouchers = CheckoutContextData.shippingVouchers.filter((a) => a.voucherCodeType == "promotion")
        
        const checkoutBody = await BuildPostCheckoutBody({
          walletRequest: req.responseData.data,
          pin: "",
          items: paramsData, 
          addressData: addressData, 
          subTotal: subTotal,
          grandTotal: grandTotal, 
          srpTotal: srpTotal,
          vouchers: promotionVouchers, 
          shippingVouchers: shippingVouchers,
          shippingRates: CheckoutContextData.shippingFeeRates,
          paymentMethod: "TOKTOKWALLET",
          hashAmount: req.responseData.hash_amount,
          referenceNum: req.responseData.orderRefNum,
          referral: {},
          franchisee: franchisee    
        })


        // your logic or process after TPIN validation is successful
        const handleProcessProceed = async ({pinCode, data}) => {
          navigation.pop()
          await ProcessCheckout({...checkoutBody, pin: pinCode})          
        }

        navigation.push('ToktokWalletTPINValidator', {
          callBackFunc: handleProcessProceed,
          onPressCancelYes: () => navigation.pop(), // event after clicking cancel on tokwa TPIN
          enableIdle: false,
          data: checkoutBody, // additional data thats need to be process on your side
        });

      }else if(req.responseError){

        try{
          let json = JSON.parse(req.responseError.message)
          let errors = json.errors
          if(errors[0]){
            if(errors[0].errorType == "PIN_CODE_MAX_ATTEMPT"){

              dispatch({type:'TOKTOK_MALL_OPEN_MODAL', payload: {
                type: 'Warning',
                title: "Max Attempts Reached",
                message: errors[0]?.message,
                onCloseDisabled: true,
                actions: [                  
                  {
                    name: "OK",
                    onPress: () => {
                      dispatch({type: 'TOKTOK_MALL_CLOSE_MODAL'})
                    },
                    type: "fill"
                  }
                ]
              }})

            }
          }

        }catch(e){
          console.log(e)
        }
        
      }else{
        // Toast.show("Something went wrong", Toast.LONG)
      }

    }

    return

  }

  const ProcessCheckout = async (checkoutBody) => {

    setProcessingCheckout(true)

    //FOR TESTING OF FAILED TRANSACTION
    // checkoutBody = {"name":"Old Levi","request_id":"1654136111782","pin":"123456","pin_type":"TPIN","contactnumber":"09753351699","email":"lfeudo@cloudpanda.ph","address":"Camba Street Metro Manil","regCode":"13","provCode":"1339","citymunCode":"133902","total_amount":250,"srp_totalamount":300,"order_type":2,"order_logs":[{"sys_shop":3,"branchid":"11","delivery_amount":150,"original_shipping_fee":150,"handle_shipping_promo":1,"hash":"","hash_delivery_amount":"cWxWNHl0MElPY1VwZ2ZGRzBpVU05UT09","daystoship":5,"daystoship_to":7,"items":[{"sys_shop":3,"product_id":"121aa4c6b3264625b7dca29f9804d4e3","itemname":"Gyoza to-go","quantity":1,"amount":250,"srp_amount":"300.00","srp_totalamount":300,"total_amount":250,"order_type":1}]}],"user_id":8834,"notes":"Yes","latitude":"","longitude":"","postalcode":"","account_type":0,"disrate":[],"vouchers":[{"voucher_id":"23","voucher_type":"2","voucher_code":"","voucher_name":"TEST ONLY SCENARIO 1","discounted_totalamount":250,"discount_totalamount":50,"shouldered_by":"2","start_date":"2022-06-01 10:49:00","end_date":"2022-06-02 10:49:00","shop_id":"0","product_id":"ced50626f3764dadb8e4e28278ceb679,121aa4c6b3264625b7dca29f9804d4e3,3fe8ef03ab0c437f9874f8b7744f5af0,7122e1dcb7814e2499ecae17a7ed719c,5aa12e1f96004c668d211890282dc722","regions":"13","payment_method":"0","discount_type":"1","discount_amount":"50","discount_cap":"","minimum_purchase":"100","on_top":null,"vcode_isset":"0","items":[{"product_id":"121aa4c6b3264625b7dca29f9804d4e3","amount":"300.00","total_amount":300,"srp_amount":"300.00","srp_totalamount":300,"quantity":1,"discounted_amount":250,"discounted_totalamount":250,"discount_amount":50,"discount_totalamount":50}],"autoApply":true,"voucherCodeType":"promotion","hash_delivery_amount":"dFg4RXhKb3htN01naW9QOFk1YWw0QT09"}],"shippingvouchers":[],"referral_code":"","referral_account_type":"","payment_method":"TOKTOKWALLET","hash_amount":"efd7df5ea029797ee9c693f863236444","reference_num":"TOK62981D2F71D61","orderRefNum":"TOK62981D2F71D61","discounted_totalamount":null}
    
    const req = await ApiCall("checkout", checkoutBody, false)
    
    setProcessingCheckout(false)

    console.log("CHECKOUT PAYLOAD", JSON.stringify(checkoutBody))
    console.log("API RESPONSE", JSON.stringify(req))

    if(req.responseData && req.responseData.success == 1){


      if(req.responseData.order_status == "Paid"){
        postOrderNotifications(req.responseData)
        EventRegister.emit("ToktokWalletRefreshAccountBalance")
      }else if(req.responseData.order_status == "Waiting for Payment"){
        //HANDLE REQUEST MONEY ID HAS EXPIRED
        dispatch({
          type: 'TOKTOK_MALL_OPEN_MODAL',
          payload: {
            type: 'Warning',
            title: 'Unable to Place Order',
            message: ' Oops! Sorry, but this transaction was\nunsuccesful! Kindly try again to proceed.',
            actions: [
              {
                name: 'Cancel',
                type: 'transparent',
                onPress: () => {
                  dispatch({type: 'TOKTOK_MALL_CLOSE_MODAL'})
                }
              },
              {
                name: 'Try Again',
                type: 'fill',
                onPress: () => {

                  let ids = []
                  paramsData.map(({data}) => {
                    data[0].map(item => {
                      ids.push(item.id)
                    });
                  })
                  dispatch({type: 'TOKTOK_MALL_CLOSE_MODAL'})
                  checkItemFromCheckout({
                    variables: {
                      input: {
                        productId: ids,
                        payload: route.params.data
                      },
                    },
                  });
                }
              }
            ],
          },
        });
      }

    }else if(req.responseError){

      let error = req.responseError
      
      if(error?.items && error?.items.length > 0){

        let items = removeUnavailableItems(error?.items)
        onProductUnavailable(items)

      }else if(error?.message && error?.message.includes("Invalid voucher") || error?.voucher_data){
        onVoucherInvalid(error)
      }

    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }    
  }

  const removeUnavailableItems = (items) => {

    let result = []
    let paramsCopy = ArrayCopy(route.params.data)
    paramsCopy.map((shopitem) => {
      let orders = shopitem.data[0]
      let remainingOrders = orders.filter((order) => {
        return items.findIndex((item) => item.productid === order.id)
      })
      if(remainingOrders.length > 0){
        result.push({
          ...shopitem,
          data: [remainingOrders]
        })
      }      
    })
    return result
  }

  const postOrderNotifications = async (payload) => {

    for (const shopbasket of paramsData) {
      
      let items = ArrayCopy(shopbasket.data[0])

      let notificationPayload = {
        shopid: shopbasket.shop.id,
        reference_num: payload.order_reference_num,
        branchid: 0,
        userid: customerData.userId,
        data: JSON.stringify(items),
        // data: [{test: 123}],
        order_status: payload.order_status,
        instructions: ""
      }


      const req = await ApiCall("save_customer_notification", notificationPayload, true)
      if(req.responseData.success == 1){
        console.log("Saved customer notification ")
      }else{
        console.log("Failed to post order notification")
      }
      
    }
    dispatch({type:'TOKTOK_MALL_OPEN_MODAL', payload: {
      type: 'Success',
      title: "Your order has been placed!",
      message: "Your order has been placed successfully.\nPlease visit My Orders to check the progress and other details.",
      onCloseDisabled: true,
      actions: [
        {
          name: "Continue shopping",
          onPress: () => {
            navigation.navigate("ToktokMallHome")
            EventRegister.emit('refreshToktokmallShoppingCart')
          }
        },
        {
          name: "Go to My Orders",
          onPress: onGoToOrders,
          type: "fill"
        },

      ]
    }})

  }

  const onGoToOrders = () =>{
    setIsVisible(false)
    EventRegister.emit('refreshToktokmallShoppingCart')
    navigation.replace("ToktokMallActivities")
    // BackHandler.removeEventListener("hardwareBackPress", backAction)
  }

  const init = async (id) => {
        
    await getMyAccount()

    const savedUser = await AsyncStorage.getItem("ToktokMallUser")
    const userData = JSON.parse(savedUser) || {}

    if(userData.userId){

      const shops = getShopItemPayload()

      setCustomerData(userData)
      setInitialLoading(true)
      setShippingRates([])
      setShippingDiscounts([])
      
      CheckoutContextData.setShippingFeeRates([])
      CheckoutContextData.setUnserviceableShipping([])

      const payload = {
        userId: userData.userId,
        shops: shops,
        refCom: getRefComAccountType({session: toktokSession}),
        addressId: id
      }

      console.log("CHECKOUT RENDER PAYLOAD", JSON.stringify(payload))

      getCheckoutData({
        variables: {
          input: payload
        }
      })
    }

  }

  const calculateGrandTotal = () => {

    let orderTotal = 0    
    let originalShippingFeeTotal = 0
    let shippingFeeSrp = 0

    if(!addressData) return
    for (var x = 0; x < route.params.data.length; x++) {

      for (var y = 0; y < route.params.data[x].data[0].length; y++) {
        
        let item = route.params.data[x].data[0][y];
        if(franchisee && franchisee.franchiseeCode != null){
          orderTotal += parseFloat(item.product.compareAtPrice * item.qty)
        }else{
          orderTotal += parseFloat(item.amount)
        }        
      }

      let order = route.params.data[x]
      let shippingfeeIndex = CheckoutContextData.shippingFeeRates.findIndex(a => a.shopid == order.shop.id)
      let voucherAmountIndex = CheckoutContextData.shippingVouchers.findIndex(a => a.shopid == order.shop.id)

      if(shippingfeeIndex > -1){

        let shippingfee = CheckoutContextData.shippingFeeRates[shippingfeeIndex]?.shippingfee
        shippingFeeSrp += parseFloat(shippingfee)
        originalShippingFeeTotal += parseFloat(shippingfee)

        // if(voucherAmountIndex > -1){
            
        //   let voucheramount = CheckoutContextData.shippingVouchers[voucherAmountIndex]?.discountedAmount            
        //   //deduct voucher discount to shipping fee
        //   if(shippingfee - voucheramount < 0){
        //     shippingFeeSrp += 0     
        //   }else{
        //     shippingFeeSrp += parseFloat(voucheramount)            
        //   }

        // }else{
        //   //no discount
        //   shippingFeeSrp += parseFloat(shippingfee)
        // }        

      }

    }

    let discounts = CheckoutContextData.getTotalVoucherDeduction()
    let itemDiscounts = CheckoutContextData.getTotalItemDiscount()

    let _subTotal = parseFloat(orderTotal) - parseFloat(itemDiscounts)
    let srpGrandTotal = parseFloat(orderTotal) + parseFloat(shippingFeeSrp) - parseFloat(discounts)

    if(franchisee && franchisee.franchiseeCode != null){
      let resellerDiscounts = CheckoutContextData.resellerDiscounts
      _subTotal = _subTotal - resellerDiscounts
      srpGrandTotal = parseFloat(orderTotal) + parseFloat(shippingFeeSrp) - parseFloat(discounts)
    }

    setSubTotal(_subTotal)
    setSrpTotal(orderTotal)
    setGrandTotal(srpGrandTotal)
  }

  const getShopItemPayload = () => {
    //CREATE SHIPPING RATES SHOPS PAYLOAD
    let shopitems = []
    for(var x=0;x<route.params.data.length;x++){
      
      let item = route.params.data[x]
      let itemdata = item.data[0]
      let productitems = []

      for(var y=0;y<itemdata.length;y++){
        productitems.push({
          productid: itemdata[y].id,
          quantity: itemdata[y].qty,
          promo_type: 0,
          order_type: 2
        })
      }

      shopitems.push({
        shopid: item.shop.id,
        items: productitems
      })

    }
    return shopitems
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        dispatch({type: "TOKTOK_MALL_CLOSE_MODAL"})
        setAlertModal(true)
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  useEffect(() => {

    let isMounted = true;

    (async () => {
      await init(0)
    })();

    if(isMounted){
      EventRegister.addEventListener("ToktokMallrefreshCheckoutData", () => init(0))
      EventRegister.addEventListener("ToktokMallWalletRefreshAccountStatus", () => setWalletAccountStatus())
    }

    return () => {
      isMounted = false;
    }
    
  }, [])

  useEffect(() => {

    setParamsData(route?.params?.data)
    setNewCartData(route?.params.newCart)

  }, [route.params])


  // useEffect(() => { 
  //   //AUTO SHIPPING
  //   (async () => {
  //     if(CheckoutContextData.shippingFeeRates.length > 0){
  //       if(CheckoutContextData.autoShippingPayload){
  //         console.log("Auto shipping initialized!")
  //         getAutoShipping(CheckoutContextData.autoShippingPayload)
  //       }
  //     }
  //   })();
  // }, [CheckoutContextData?.shippingFeeRates, CheckoutContextData.autoShippingPayload])

  useEffect(() => {
    calculateGrandTotal()
  }, [CheckoutContextData])

  useEffect(() => {
    // alert("Shipping voucher has detected")
  }, [CheckoutContextData?.shippingVouchers])

  // useEffect(() => {
  //   if(movedScreens){
  //     const removeBackHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
  //     removeBackHandler.remove()
  //   }
  // }, [movedScreens])

  // useEffect(() => {
  //   calculateGrandTotal()
  // }, [addressData, shippingRates])

  

  useEffect(() => {
    // console.log(grandTotal)
  }, [grandTotal])

  // useEffect(() => {
  //   // dispatch({type:'TOKTOK_MALL_OPEN_MESSAGE_MODAL', payload: {
  //   //   title: ["Unable to Checkout"],
  //   //   message: "Sorry, you don’t have a toktokwallet yet. Please create an account and top up to proceed in checkout.",
  //   //   action: {
  //   //     onPress:() => {
  //   //       navigation.navigate("ToktokMallHome")
  //   //       dispatch({type: "TOKTOK_MALL_CLOSE_MESSAGE_MODAL"})
  //   //     },
  //   //     title: "Ok",
  //   //     type: "fill"
  //   //   },
  //   //   link: {
  //   //     onPress:() => {
  //   //       navigation.navigate("ToktokMallHome")
  //   //       dispatch({type: "TOKTOK_MALL_CLOSE_MESSAGE_MODAL"})
  //   //     },
  //   //     text: "Create toktokwallet account",
  //   //   }
  //   // }})
  // }, [])

  if((loading || initialLoading) && paramsData.length > 0) {
    return <Loading state={loading || initialLoading} />
  }

  const onPressTCbutton = () => {
    setOnPressPlaceOrder(false);
    setTCEnabled(state => !state)
  }

  const onDoneFade = () => {
    setOnPressPlaceOrder(false);
  }

  return (
    <>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      >
        {/* LOADING POPUP */}
        <PopupModalComponent isVisible={processingCheckout} type="Loading" label='Placing Order' useLottie={true} />

        <AlertModal
          navigation = {navigation}
          isVisible = {alertModal}
          setIsVisible = {setAlertModal}         
        />
        <CheckoutModal 
          navigation={navigation} 
          isVisible={isVisible} 
          setIsVisible={setIsVisible} 
          goToOrders = {onGoToOrders}
        />
        <MessageModal navigation={navigation} isVisible={walletmodal} setIsVisible={setwalletmodal} />
        <View style={{paddingBottom: 30}}>
          <AddressForm
            data={addressData}
            onEdit={() => navigation.push("ToktokMallAddressesMenu", {
              onGoBack: (id) => {
                init(id)
              },
              fromPlaceOrderScreen: true
            })}
          />          
         {paramsData.length > 0 ? (
           <Shops
             address={addressData}
             customer={customerData}
             raw={paramsData}
             retrieve={data => {
               setShippingDiscounts(data.shippingDiscounts);
             }}
             shipping={addressData?.shippingSummary}
             shippingRates={shippingRates}
             referral={franchisee}
           />
         ) : (
            <View style={{flex: 1, backgroundColor: 'trasparent'}}>
              <View style={{flex: 1, backgroundColor: 'white', marginTop: 8, alignItems: 'center', padding: 25}}>
                <Image source={emptyPlaceOrder} />
                <Text style={{color: '#F6841F', fontSize: 18, padding: 5}}>No Items</Text>
                <Text>Hmm, there are no items to check out.</Text>
              </View>
            </View>
          )}
          {/* <Vouchers 
            items={paramsData}
            navigation={navigation} 
            vouchers={vouchers}
            setVouchers={setVouchers} 
            vcode={vcode}
            setvCode={setvCode}
            setVoucher={(data) => {
              let temp = []
              if(data) temp.push(data)
              setVoucher(temp)
            }}
          /> */}
          <Payment
            payment={payment}
            total={grandTotal}
            list={paymentList}
            currentBalance={toktokMall.toktokWalletBalance}
            setCurrenctBalance={setCurrentBalance}
            setPaymentMethod={setPaymentMethod}
            getMyAccount={getMyAccount}
            // status={walletAccountStatus}
            status={walletAccountStatus}
          />
          <Totals
            raw={paramsData}
            setGrandTotal={setGrandTotal}
            shipping={addressData?.shippingSummary}
            shippingRates={shippingRates}
            shippingDiscounts={shippingDiscounts}
            referral={franchisee}
          />
          <TermsAndCondition 
            onPressTCbutton={onPressTCbutton}
            onDoneFade={onDoneFade}
            onPressPlaceOrder={onPressPlaceOrder}
            scrollViewRef={scrollViewRef}
            TCEnabled={TCEnabled}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          enabled={!loading}
          loading={isLoading}
          balance={currentBalance}
          total={grandTotal}
          shipping={addressData}
          shippingRates={shippingRates}
          onPress={async () => {
            // setOnPressPlaceOrder(true);
            // if (!TCEnabled) return;

            if (!isLoading) {

              let ids = []
              paramsData.map(({data}) => {
               data[0].map(item => {
                 ids.push(item.id)
               });
             })

             setIsLoading(true)
         
             checkItemFromCheckout({
               variables: {
                 input: {
                   productId: ids,
                   payload: route.params.data
                 },
               },
             });
            }
          }}
        />
      </View>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload})
});

export const ToktokMallCheckoutScreen = connect(null, mapDispatchToProps)(Component);

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