import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, BackHandler, Alert, EventEmitter } from 'react-native';
import { COLOR, FONT } from '../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import { AddressForm, Button, Payment, Shops, Totals, Vouchers, CheckoutModal, MessageModal } from './Components';
import {connect} from 'react-redux'
import { useSelector } from 'react-redux';
import {useFocusEffect} from '@react-navigation/native'

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_CHECKOUT_DATA, POST_CHECKOUT, GET_HASH_AMOUNT } from '../../../../graphql/toktokmall/model';

import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_WALLET, GET_MY_ACCOUNT } from 'toktokwallet/graphql'

import {Loading} from '../../../Components/Widgets';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-simple-toast";
import axios from "axios";
import {AlertModal} from '../../../Components/Widgets'
import {ApiCall, ShippingApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall, BuildOrderLogsList, ArrayCopy} from "../../../helpers"

import {CheckoutContext} from './ContextProvider';
import { EventRegister } from 'react-native-event-listeners';

const REAL_WIDTH = Dimensions.get('window').width;

const Component = ({route, navigation, createMyCartSession}) => {

  const CheckoutContextData = useContext(CheckoutContext)
  const toktokSession = useSelector(state => state.session)

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
  const [walletmodal, setwalletmodal] = useState(false)
  const [customerData, setCustomerData] = useState({})
  const [shippingDiscounts, setShippingDiscounts] = useState([])

  const setAlertTrue = () => {
    setAlertModal(true)
  }

  const [getCheckoutData, {error, loading}] = useLazyQuery(GET_CHECKOUT_DATA, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: async (response) => {
      if(response.getCheckoutData){
        let data = response.getCheckoutData
        setAddressData(data.address);
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
      setInitialLoading(false)
      // Toast.show("Something went wrong")
    }
  })

  const [getShippingHashDeliveryAmount, {error2, loading2}] = useLazyQuery(GET_HASH_AMOUNT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getHashDeliveryAmount){
        let items = ArrayCopy(CheckoutContextData.shippingVouchers)
        items[response.getHashDeliveryAmount.index].hash_delivery_amount = response.getHashDeliveryAmount.hash
        CheckoutContextData.setShippingVouchers(items)
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
    if(res.responseData && res.responseData.success == 1){
      result = res.responseData.newCart
      CheckoutContextData.setShippingFeeRates(res.responseData.newCart)
    }else if(res.responseError && res.responseError.success == 0){
      CheckoutContextData.setUnserviceableShipping(res.responseError.removedCart)      
    }else{
      CheckoutContextData.setUnserviceableShipping([raw])
    }
    return result
    // setInitialLoading(false)
  }

  const getAutoShipping = async (payload) => {

    setInitialLoading(true)
    console.log("Auto Shipping Payload", JSON.stringify(payload))
    const res = await ApiCall("get_autoshipping_discount", payload, true)

    if(res.responseData && res.responseData.success){

      let items = ArrayCopy(CheckoutContextData.shippingVouchers)

      if(res.responseData.type == "shipping"){
        res.responseData.voucher.map((item, indexx) => {
          if(item.type == "shipping"){
            item.vouchers.map(async (voucher, index) => {

              if(voucher.amount == 0){

                items[index] = voucher
                items[index].discountedAmount = 0
                items[index].discount = 0
                CheckoutContextData.setShippingVouchers(items)
                getShippingHashDeliveryAmount({variables: {
                  input: {
                    value: 0,
                    index: index
                  }
                }})

              }
              
            })         
          }
        })
      }

    }else if(res.responseError){
      // Toast.show(res.responseError.message)
    }

    setInitialLoading(false)

  }

  //TOKTOK WALLET
  const [ getMyAccount ] = useLazyQuery(GET_MY_ACCOUNT , {
    fetchPolicy: "network-only",
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({ getMyAccount })=> {
      if(getMyAccount){
        // console.log(getMyAccount)
        setwalletmodal(false)
        setWalletAccount(getMyAccount)
        setCurrentBalance(getMyAccount?.wallet?.balance)
      }else{
        setwalletmodal(true)
      }
    },
    onError: (error) => {
      console.log(error)
      setwalletmodal(true)
    }
  })  

  const postCheckoutSetting = async () => {

    setIsLoading(true)

    if(payment == 'toktokwallet'){
            
      let transactionPayload = await BuildTransactionPayload({
        method: "TOKTOKWALLET", 
        notes: "", 
        total: grandTotal, 
        toktokid: toktokSession.user.id,
        // toktokid: 1,
        transactionTypeId: "TOKTOKWALLET PAYMENT"
      })
      setIsLoading(false)

      console.log("request money body", JSON.stringify(transactionPayload))
           
      const req = await WalletApiCall("request_money", transactionPayload, true)

      if(req.responseData && req.responseData.success == 1){

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
          referenceNum: req.responseData.orderRefNum
        })

        navigation.navigate("ToktokMallOTP", {
          transaction: "payment", 
          data: checkoutBody,
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
        
        if(errors.length > 0){
          // Toast.show(errors[0].message, Toast.LONG)
          navigation.navigate("ToktokMallOTP", {
            transaction: "payment",
            data: {},
            error: true,
            errorCode: "VALIDATORMAXREQUEST",
            lockMessage: errors[0].message
          })
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

    setIsVisible(true)
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
            shops: shops            
          }
        }
      })
    }

  }

  const calculateGrandTotal = () => {
    let a = 0;
    if(!addressData) return
    for (var x = 0; x < route.params.data.length; x++) {
      for (var y = 0; y < route.params.data[x].data[0].length; y++) {
        let item = route.params.data[x].data[0][y];
        // console.log("Hahay", route.params.data[x].data[0][y], y)
        a += parseFloat(item.amount)
      }
      // let shipping = 0
      // for(var z=0;z<shippingRates.length;z++){
      //   shipping += parseFloat(shippingRates[z].price)
      // }
      // a += shipping
      // console.log(shippingRates, shipping)
      // a += parseFloat(userDefaultAddress?.shippingSummary?.rateAmount)
    }
    // console.log("subtotal", a)
    setSubTotal(a)
    let shipping = 0
    let originalShippingFee = 0

    for(var z=0;z<CheckoutContextData.shippingFeeRates.length;z++){

      if(CheckoutContextData.shippingVouchers[z]){

        let shippingfee = CheckoutContextData.shippingFeeRates[z]?.shippingfee
        let voucheramount = CheckoutContextData.shippingVouchers[z]?.amount

        if(shippingfee && voucheramount && shippingfee - voucheramount < 0){
          shipping += 0
        }else{
          shipping += parseFloat(CheckoutContextData.shippingVouchers[z].discount) 
        }
      }else{
        shipping += parseFloat(CheckoutContextData.shippingFeeRates[z].shippingfee)
      }

      originalShippingFee += parseFloat(CheckoutContextData.shippingFeeRates[z].original_shipping)

    }
    // console.log("Grand total...")
    // console.log(a, shipping)

    let b = a
    a += shipping
    b += originalShippingFee
    setSrpTotal(b)
    setGrandTotal(a)
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

    setParamsData(route?.params?.data)
    setNewCartData(route?.params.newCart)

  }, [route.params])

  useEffect(() => {
    // console.log(grandTotal)
  }, [grandTotal])

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
            currentBalance={currentBalance}
            setCurrenctBalance={setCurrentBalance}
            setPaymentMethod={setPaymentMethod} 
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
            if(!isLoading){
              await postCheckoutSetting()              
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