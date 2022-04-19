import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, BackHandler, Alert, EventEmitter } from 'react-native';
import { COLOR, FONT } from '../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import { AddressForm, Button, Payment, Shops, Totals, Vouchers, CheckoutModal, MessageModal } from './Components';
import {connect, useDispatch} from 'react-redux'
import { useSelector } from 'react-redux';
import {useFocusEffect} from '@react-navigation/native'

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
import {ApiCall, ShippingApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall, BuildOrderLogsList, ArrayCopy, getRefComAccountType} from "../../../helpers"

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

  const [isVisible, setIsVisible] = useState(false)
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
  const [franchisee, setFranchisee] = useState({})
  const [unavailable, setUnavailable] = useState([])
  const [res, setRes] = useState(false)

  const dispatch = useDispatch()

  const setAlertTrue = () => {
    setAlertModal(true)
  }

  const [checkItemFromCheckout] = useLazyQuery(CHECK_ITEM_FROM_CHECKOUT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: async (response) => {
      console.log("route.params.data",)
      const data = response.checkItemFromCheckout.filter(({status})=> status === false)
      console.log("ToktokWalletRefreshAccountBalance data",data)
      setUnavailable(data)
      await postCheckoutSetting(data);
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
        let shippingrates = await getShippingRates(data.shippingRatePayload, data.cartrawdata)
        if(shippingrates.length > 0){
          data.autoShippingPayload.cartitems = shippingrates          
          await getAutoShipping(data.autoShippingPayload)
        }
        
      }
      setInitialLoading(false)
    },
    onError: (err) => {
      console.log(err)
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
    // console.log(JSON.stringify(payload))
    // console.log(JSON.stringify(raw))
    // console.log(JSON.stringify(payload.cart)) 
    let result = []
    const res = await ShippingApiCall("get_shipping_rate", payload, false)
    console.log("SHipping Rates", JSON.stringify(res.responseData))
    if(res.responseData && res.responseData.success == 1){
      result = res.responseData.newCart
      CheckoutContextData.setShippingFeeRates(res.responseData.newCart)
      if(res.responseData?.removedCart){
        CheckoutContextData.setUnserviceableShipping(res.responseData.removedCart)   
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

    //setup empty vouchers list
    let initialShippingVouchers = []
    payload?.cartitems.map((item) => {
      initialShippingVouchers.push({
        shopid: item.shopid
      })
    })
    CheckoutContextData.setShippingVouchers(initialShippingVouchers)

    setInitialLoading(true)
    console.log("Auto Shipping Payload", JSON.stringify(payload))
    const res = await ApiCall("get_autoshipping_discount", payload, true)

    if(res.responseData && res.responseData.success){

      let items = ArrayCopy(initialShippingVouchers)

      if(res.responseData.type == "shipping"){

        res.responseData.voucher.map((item, indexx) => {

          let shopvoucherIndex = items.findIndex(a => a.shopid == item.shopid)
         
          if(item.type == "shipping"){
            item.vouchers.map(async (voucher, index) => {

              if(shopvoucherIndex > -1 && voucher.amount == 0){

                items[shopvoucherIndex] = voucher
                items[shopvoucherIndex].discountedAmount = 0
                items[shopvoucherIndex].discount = 0
                
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
      console.log(getUserToktokWalletData)
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
        console.log(getMyAccount)
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
  useEffect(() => {
    // if(unavailable.length > 0 && paramsData && res){
    //   let copy = [];
    //   // unavailable.map(({id}) => {
    //   //   copy = copy.map(({data, ...rest}) => ({
    //   //     ...rest,
    //   //     data: [data[0].filter(item => id !== item.id)],
    //   //   }));
    //   // });
    //   // copy = copy.filter(({data}) => data[0].length !== 0);
    //   console.log('ToktokWalletRefreshAccountBalance', copy, unavailable);
    //   setParamsData(copy);
    //   setRes(false);
    // }
    if(res){
      setParamsData([]);
    }
  }, [res])

  const postCheckoutSetting = async (data) => {

    setIsLoading(true)

    if(payment == 'toktokwallet'){
            
      let transactionPayload = await BuildTransactionPayload({
        method: "TOKTOKWALLET", 
        notes: "", 
        total: grandTotal, 
        toktokid: toktokSession.user.id,
        // toktokid: 1,
        // transactionTypeId: "TOKTOKWALLET PAYMENT"
        transactionTypeId: 110
      })
      setIsLoading(false)

      console.log("request money body", JSON.stringify(transactionPayload))
           
      const req = await WalletApiCall("request_money", transactionPayload, true)

      if(req.responseData && req.responseData.success == 1){
        setRes(true)

        const checkoutBody = await BuildPostCheckoutBody({
          walletRequest: req.responseData.data,
          pin: "",
          items: paramsData, 
          addressData: addressData, 
          subTotal: subTotal,
          grandTotal: grandTotal, 
          srpTotal: srpTotal,
          vouchers: voucher, 
          shippingVouchers: CheckoutContextData.shippingVouchers,
          shippingRates: CheckoutContextData.shippingFeeRates,
          paymentMethod: "TOKTOKWALLET",
          hashAmount: req.responseData.hash_amount,
          referenceNum: req.responseData.orderRefNum,
          referral: franchisee
        })

        navigation.navigate("ToktokMallOTP", {
          transaction: "payment", 
          data: checkoutBody,
          unavailable: data,
          unavailableCallback: () => {
          },
          onSuccess: async (result) => {

            console.log(paramsData)
            console.log(result)
            // setIsVisible(true)
            postOrderNotifications(result)
            EventRegister.emit("ToktokWalletRefreshAccountBalance")

          },
          onError: async (error) => {
            console.log(error)
          }
        })


      }else if(req.responseData && req.responseData.success == 0){

        const errors = JSON.parse(req.responseData.message)

        if(req.responseData.message.includes("VALIDATORMAXREQUEST")){
          navigation.navigate("ToktokMallOTP", {
            transaction: "payment",
            data: {},
            error: true,
            errorCode: "VALIDATORMAXREQUEST",
            lockMessage: errors[0].message
          })
        }

      }else if(req.responseError){

        let json = JSON.parse(req.responseError.message)
        let errors = json.errors
        console.log(errors[0])
        if(errors.length > 0){

          if(errors[0]){
            if(errors[0]?.code == "BAD_USER_INPUT"){

              if(errors[0]?.message){
                alert(errors[0]?.message)
              }

            }else{
              // Toast.show(errors[0].message, Toast.LONG)
              navigation.navigate("ToktokMallOTP", {
                transaction: "payment",
                data: {},
                error: true,
                errorCode: "VALIDATORMAXREQUEST",
                lockMessage: errors[0].message
              })
            }
          }

        }
        
      }else{
        // Toast.show("Something went wrong", Toast.LONG)
      }


    }

    return

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

      console.log(notificationPayload)

      const req = await ApiCall("save_customer_notification", notificationPayload, true)
      console.log(req)
      if(req.responseData.success == 1){
        console.log("Saved customer notification ")
      }else{
        console.log("Failed to post order notification")
      }
      
    }

    dispatch({type: "TOKTOK_MALL_OPEN_PLACE_ORDER_MODAL", payload: {
      onConfirmAction: onGoToOrders,
      onCancelAction: () => {
        navigation.navigate("ToktokMallHome")
        EventRegister.emit('refreshToktokmallShoppingCart')
      }
    }})
    // setIsVisible(true)
  }

  const onGoToOrders = () =>{
    setIsVisible(false)
    EventRegister.emit('refreshToktokmallShoppingCart')
    navigation.replace("ToktokMallMyOrders", { tab: 0})
    // BackHandler.removeEventListener("hardwareBackPress", backAction)
  }

  const init = async () => {
    
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
      
      getCheckoutData({
        variables: {
          input: {
            userId: userData.userId,
            shops: shops,
            refCom: getRefComAccountType({session: toktokSession})        
          }
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
        orderTotal += parseFloat(item.amount)
        
      }

      let order = route.params.data[x]
      let shippingfeeIndex = CheckoutContextData.shippingFeeRates.findIndex(a => a.shopid == order.shop.id)
      let voucherAmountIndex = CheckoutContextData.shippingVouchers.findIndex(a => a.shopid == order.shop.id)

      if(shippingfeeIndex > -1){

        let shippingfee = CheckoutContextData.shippingFeeRates[shippingfeeIndex]?.shippingfee
          
        if(voucherAmountIndex > -1){
            
          let voucheramount = CheckoutContextData.shippingVouchers[voucherAmountIndex]?.discountedAmount            
          //deduct voucher discount to shipping fee
          if(shippingfee - voucheramount < 0){
            shippingFeeSrp += 0     
          }else{
            shippingFeeSrp += parseFloat(voucheramount)            
          }

        }else{
          //no discount
          shippingFeeSrp += parseFloat(shippingfee)
        }

        originalShippingFeeTotal += parseFloat(shippingfee)
      }

    }

    let _subTotal = parseFloat(orderTotal) + parseFloat(shippingFeeSrp)
    let srpGrandTotal = parseFloat(orderTotal) + parseFloat(shippingFeeSrp)

    setSubTotal(orderTotal)
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
        dispatch({type: "TOKTOK_MALL_CLOSE_PLACE_ORDER_MODAL"})
        setAlertModal(true)
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )
    
  useEffect(() => {
    (async () => {
      // console.log(JSON.stringify(route.params.data))
      await init()
    })();

    EventRegister.addEventListener("refreshCheckoutData", init)
    EventRegister.addEventListener("ToktokMallWalletRefreshAccountStatus", () => setWalletAccountStatus())
  }, [])

  console.log("addressData", addressData)

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

    console.log("Checkout body data", route?.params?.data)
    setParamsData(route?.params?.data)
    setNewCartData(route?.params.newCart)

  }, [route.params])

  useEffect(() => {
    // console.log(grandTotal)
  }, [grandTotal])

  useEffect(() => {
    // dispatch({type:'TOKTOK_MALL_OPEN_MESSAGE_MODAL', payload: {
    //   title: ["Unable to Checkout"],
    //   message: "Sorry, you don’t have a toktokwallet yet. Please create an account and top up to proceed in checkout.",
    //   action: {
    //     onPress:() => {
    //       navigation.navigate("ToktokMallHome")
    //       dispatch({type: "TOKTOK_MALL_CLOSE_MESSAGE_MODAL"})
    //     },
    //     title: "Ok",
    //     type: "fill"
    //   },
    //   link: {
    //     onPress:() => {
    //       navigation.navigate("ToktokMallHome")
    //       dispatch({type: "TOKTOK_MALL_CLOSE_MESSAGE_MODAL"})
    //     },
    //     text: "Create toktokwallet account",
    //   }
    // }})
  }, [])

  if(loading || initialLoading) {
    return <Loading state={loading || initialLoading} />
  }

  return (
    
    <>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      >
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
        <MessageModal 
          navigation={navigation} 
          isVisible={walletmodal} 
          setIsVisible={setwalletmodal} 
        />
        <View style ={{paddingBottom: 30}}>
          <AddressForm
            data={addressData}
            onEdit={() => navigation.push("ToktokMallAddressesMenu", {
              onGoBack: (data) => {
                // setAddressData(data)
                init()
              }
            })}
          />
          <Shops 
            address={addressData}
            customer={customerData}
            raw={paramsData}
            retrieve={(data) => {
              setShippingDiscounts(data.shippingDiscounts)
            }}
            shipping={addressData?.shippingSummary} 
            shippingRates={shippingRates}      
          />
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
            if (!isLoading) {
              let ids = []
              paramsData.map(({data}) => {
               data[0].map(item => {
                 ids.push(item.id)
               });
             })
         
             checkItemFromCheckout({
               variables: {
                 input: {
                   productId: ids,
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