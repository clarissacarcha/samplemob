import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, BackHandler, Alert } from 'react-native';
import { COLOR, FONT } from '../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import { AddressForm, Button, Payment, Shops, Totals, Vouchers, CheckoutModal, MessageModal } from './Components';
import {connect} from 'react-redux'
import coppermask from '../../../assets/images/coppermask.png'
import suit from '../../../assets/images/coppermask.png'
import { useSelector } from 'react-redux';
import {useFocusEffect} from '@react-navigation/native'

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_CHECKOUT_DATA, POST_CHECKOUT } from '../../../../graphql/toktokmall/model';

import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_WALLET, GET_MY_ACCOUNT } from 'toktokwallet/graphql'

import {Loading} from '../../../Components/Widgets';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-simple-toast";
import axios from "axios";
import {AlertModal} from '../../../Components/Widgets'
import {ApiCall, ShippingApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall} from "../../../helpers"

import {CheckoutContext} from './ContextProvider';

const REAL_WIDTH = Dimensions.get('window').width;

const Component = ({route, navigation, createMyCartSession}) => {

  const CheckoutContextData = useContext(CheckoutContext)

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
  const [initialLoading, setInitialLoading] = useState(false)
  const [walletAccount, setWalletAccount] = useState(false)
  const [walletmodal, setwalletmodal] = useState(false)
  const [customerData, setCustomerData] = useState({})
  const [shippingDiscounts, setShippingDiscounts] = useState([])

  const setAlertTrue = () => {
    setAlertModal(true)
    console.log("test")
  }

  const [getCheckoutData, {error, loading}] = useLazyQuery(GET_CHECKOUT_DATA, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: async (response) => {
      if(response.getCheckoutData){
        setAddressData(response.getCheckoutData.address);
        await setPaymentList(response.getCheckoutData.paymentMethods)
        await getShippingRates(response.getCheckoutData.shippingRates)
      }
    },
    onError: (err) => {
      console.log(err)
      setInitialLoading(false)
      // Toast.show("Something went wrong")
    }
  })

  const getShippingRates = async (rates) => {
    if(rates && rates.length > 0){
      for (const shippingrate of rates) {
        console.log("Shipping Rate", shippingrate)
        const res = await ShippingApiCall("get_shipping", shippingrate)
        if(res.responseData && res.responseData.success == 1){
          let tempArr = shippingRates
          let {price, hash_price, hash} = res.responseData
          tempArr.push({price, hash_price, hash})
          setShippingRates(tempArr)
        }else if(res.responseError){
          let contents = JSON.parse(res.responseError.message)
          console.log(contents.errors)
          if(contents.errors.length > 0){
            for (const err of contents.errors) {
              Alert.alert("Shipping\n", err.message)
            }
          }
        }
        calculateGrandTotal()
      }
      setInitialLoading(false)
    }else{
      setInitialLoading(false)
    }    
  }

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
        total: srpTotal, 
        // toktokid: parentSession.user.id
        // toktokid: walletAccount.id,
        toktokid: 1,
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
          shippingRates: shippingRates,
          paymentMethod: "TOKTOKWALLET",
          hashAmount: req.responseData.hash_amount,
          referenceNum: req.responseData.orderRefNum
        })

        navigation.navigate("ToktokMallOTP", {
          transaction: "payment", 
          data: checkoutBody,
          onSuccess: async () => {
            setIsVisible(true)
          },
          onError: async (error) => {
            console.log(error)
          }
        })


      }else if(req.responseError){

        let json = JSON.parse(req.responseError.message)
        let errors = json.errors
        
        if(errors.length > 0){
          Toast.show(errors[0].message, Toast.LONG)
        }
        
      }else{
        // Toast.show("Something went wrong", Toast.LONG)
      }


    }

    return

  }

  const onGoToOrders = () =>{
    setIsVisible(false)
    navigation.push("ToktokMallMyOrders", { tab: 0})
    // BackHandler.removeEventListener("hardwareBackPress", backAction)
  }

  const init = async () => {
    
    await getMyAccount()

    const savedUser = await AsyncStorage.getItem("ToktokMallUser")
    const userData = JSON.parse(savedUser) || {}

    if(userData.userId){

      const shops = route.params.data.map((a) => a.shop.id)
      setCustomerData(userData)
      setInitialLoading(true)
      setShippingRates([])
      setShippingDiscounts([])
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
      for (var y = 0; y < route.params.data[x].data.length; y++) {
        let item = route.params.data[x].data[0][y];
        a += parseFloat(item.amount) * item.qty;
      }
      // let shipping = 0
      // for(var z=0;z<shippingRates.length;z++){
      //   shipping += parseFloat(shippingRates[z].price)
      // }
      // a += shipping
      // console.log(shippingRates, shipping)
      // a += parseFloat(userDefaultAddress?.shippingSummary?.rateAmount)
    }
    setSubTotal(a)
    let shipping = 0
    let originalShippingFee = 0

    for(var z=0;z<shippingRates.length;z++){

      if(CheckoutContextData.shippingVouchers[z]){
        shipping += parseFloat(CheckoutContextData.shippingVouchers[z].amount)
      }else{
        shipping += parseFloat(shippingRates[z].price)
      }

      originalShippingFee += parseFloat(shippingRates[z].price)

    }
    console.log("Grand total...")
    console.log(a, shipping)

    let b = a
    a += shipping
    b += originalShippingFee
    setSrpTotal(b)
    setGrandTotal(a)
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
      await init()
    })();
  }, [])

  useEffect(() => {
    console.log("Shipping Rates Value:", shippingRates.length)
  }, [shippingRates])

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
    return <Loading state={loading} />
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
        <View style ={{paddingBottom: 0}}>
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