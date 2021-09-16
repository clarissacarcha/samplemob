import React, {useState, useEffect,} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, BackHandler, Alert } from 'react-native';
import { COLOR, FONT } from '../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import { AddressForm, Button, Payment, Shops, Totals, Vouchers, CheckoutModal } from './Components';
import {connect} from 'react-redux'
import coppermask from '../../../assets/images/coppermask.png'
import suit from '../../../assets/images/coppermask.png'
import { useSelector } from 'react-redux';
import {useFocusEffect} from '@react-navigation/native'

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_CHECKOUT_DATA, POST_CHECKOUT } from '../../../../graphql/toktokmall/model';
import {Loading} from '../../../Components/Widgets';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-simple-toast";
import axios from "axios";
import {AlertModal} from '../../../Components/Widgets'
import {ApiCall, ShippingApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall} from "../../../helpers"

const REAL_WIDTH = Dimensions.get('window').width;

const testData2 = [
  {id: 1, shops: 'Facemask PH', 
    items: [{id: 1, item_name: 'Improved Copper Mask 2.0 White or Bronze', price: 190, variation: 'bronze', quantity: 1, sale_off: 380, image: coppermask},
      {id: 2, item_name: 'Improved Copper Mask 2.0 White or Bronze', price: 190, variation: 'white', quantity: 1, sale_off: 380,  image: coppermask}
    ], delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },
  {id: 2, shops: 'The Apparel', 
    items: [{id: 1, item_name: 'Graphic Tees', price: 190, variation: 'white', quantity: 1, sale_off: 380, image: suit},
    ], delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
  },

]

const postCheckoutBody = {
  name: "",
  contactnumber: "",
  email: "",
  address: "",
  regCode: "",
  provCode: "",
  citymunCode: "",
  total_amount: 0,
  srp_totalamount: 0,
  order_type: 2,
  order_logs: [{
    sys_shop: 1,
    branchid: 0,
    delivery_amount: 0,
    daystoship: 1,
    days_toship_to: 1,
    items: [{
      sys_shop: 1,
      product_id: "",
      quantity: 1,
      amount: 0,
      srp_amount: 0,
      srp_totalamount: 0,
      total_amount: 0,
      order_type: 1
    }]
  }],
  //Optional values
  user_id: 9999,
  notes: "",
  latitude: "",
  longitude: "",
  postalcode: "",
  account_type: 0,
  // vouchers: [{
  //   shopid: 1,
  //   vcode: "",
  //   vamount: ""
  // }],
  referral_code: "",
  referral_account_type: "",
  payment_method: "cod"
}

const Component = ({route, navigation, createMyCartSession}) => {

  const parentSession = useSelector(state => state.session)
  const userAddress = useSelector(state=> state.toktokMall.user_address)
  const userDefaultAddress = useSelector(state=> state.toktokMall.defaultAddress)

  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack = {setAlertTrue}/>,
    headerTitle: () => <HeaderTitle label={['Checkout', '']} />,
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
  const [userId, setUserId] = useState(null)
  const [deliveryFees, setDeliveryFees] = useState([])
  const [receiveDates, setReceiveDates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [alertModal, setAlertModal] =useState(false)
  const [movedScreens, setMovedScreens] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(100000)
  const [shippingRates, setShippingRates] = useState([])
  const [initialLoading, setInitialLoading] = useState(false)

  const setAlertTrue = () => {
    setAlertModal(true)
    console.log("test")
  }

  const [getCheckoutData, {error, loading}] = useLazyQuery(GET_CHECKOUT_DATA, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: async (response) => {
      if(response.getCheckoutData){
        // console.log(response.getCheckoutData.address)
        // console.log(userDefaultAddress)
        // console.log("Shipping Rates", response.getCheckoutData.shippingRates)
        
        // setAddressData(response.getCheckoutData.address);
        await setPaymentList(response.getCheckoutData.paymentMethods)
        await getShippingRates(response.getCheckoutData.shippingRates)
      }
    },
    onError: (err) => {
      console.log(err)
      setInitialLoading(false)
      Toast.show("Something went wrong")
    }
  })

  const getShippingRates = async (rates) => {

    if(rates && rates.length > 0){

      for (const shippingrate of rates) {
        const res = await ShippingApiCall("get_shipping", shippingrate)
        if(res.responseData && res.responseData.success == 1){
          let tempArr = shippingRates
          let {price, hash_price, hash} = res.responseData
          tempArr = tempArr.concat({price, hash_price, hash})
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
      }
      setInitialLoading(false)
    }else{
      setInitialLoading(false)
    }    
  }

  const UpdateCart = async () => {
    // let stringyfiedArr = JSON.stringify(newCartData)
    // await AsyncStorage.setItem('MyCart', stringyfiedArr)
    createMyCartSession("set", newCartData)
  }

  const postCheckoutSetting = async () => {    

    setIsLoading(true)

    if(payment == 'toktokwallet'){
      
      let transactionPayload = await BuildTransactionPayload({
        method: "TOKTOKWALLET", 
        notes: "", 
        total: grandTotal, 
        // toktokid: parentSession.user.id
        toktokid: 13
      })

      console.log(JSON.stringify(transactionPayload))
           
      const req = await WalletApiCall("request_money", transactionPayload, true)

      if(req.responseData && req.responseData.success == 1){

        const checkoutBody = await BuildPostCheckoutBody({
          walletRequest: req.responseData.data,
          pin: "",
          items: paramsData, 
          addressData: userDefaultAddress, 
          grandTotal: grandTotal, 
          vouchers: voucher,
          shippingRates: shippingRates,
          paymentMethod: payment
        })

        navigation.navigate("ToktokMallOTP", {
          transaction: "payment", 
          data: checkoutBody,
          onSuccess: async () => {

            if(route?.params?.type == "from_cart"){
              UpdateCart()
            }

            setIsVisible(true)
            setIsLoading(false)
          },
          onError: async (error) => {
            console.log(error)
            setIsLoading(false)
          }
        })

        setIsLoading(false)

      }else if(req.responseError){

        let json = JSON.parse(req.responseError.message)
        let errors = json.errors
        
        if(errors.length > 0){
          Toast.show(errors[0].message, Toast.LONG)
        }
        
        setIsLoading(false)
      }else{
        Toast.show("Something went wrong", Toast.LONG)
        setIsLoading(false)
      }

      setIsLoading(false)

    }

    return

  }

  const onGoToOrders = () =>{
    setIsVisible(false)
    navigation.push("ToktokMallMyOrders", { tab: 0})
    // BackHandler.removeEventListener("hardwareBackPress", backAction)
  }

  const init = async () => {
    
    const savedUser = await AsyncStorage.getItem("ToktokMallUser")
    const savedUserLocation = await AsyncStorage.getItem("ToktokMallUserCoords")

    const userData = JSON.parse(savedUser) || {}
    const userLocation = JSON.parse(savedUserLocation) || {}

    if(userData.userId){
      if(userLocation){
        
        const shops = route.params.data.map((a) => a.store_id)
        console.log(userLocation)
        console.log(route.params.data.map((a) => a.store_id))

        setInitialLoading(true)
        getCheckoutData({
          variables: {
            input: {
              userId: userData.userId,
              shops: shops,
              customerLon: userLocation.longitude,
              customerLat: userLocation.latitude,

              //High Street South Taguig Metro Manila
              // customerLat: 14.5463442,
              // customerLon: 121.0501614
            }
          }
        })

      }
    }

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
    init()
    // console.log("Parent Session", parentSession)
  },[])

  useEffect(() => {
    console.log("Shipping Rates Value:", shippingRates)
  }, [shippingRates])

  // useEffect(() => {
  //   if(movedScreens){
  //     const removeBackHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
  //     removeBackHandler.remove()
  //   }
  // }, [movedScreens])

  useEffect(() => {
    let a = 0;
    if(!userDefaultAddress) return
    for (var x = 0; x < route.params.data.length; x++) {
      for (var y = 0; y < route.params.data[x].cart.length; y++) {
        let item = route.params.data[x].cart[y];
        a += parseFloat(item.price) * item.qty;
      }
      a += parseFloat(userDefaultAddress?.shippingSummary?.rateAmount)
    }
    setGrandTotal(a)
  }, [userDefaultAddress])

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
        <View style ={{paddingBottom: 0}}>
          <AddressForm
            data={userDefaultAddress}
            onEdit={() => navigation.push("ToktokMallAddressesMenu", {
              onGoBack: (data) => {
                // setAddressData(data)
                init()
              }
            })}
          />
          <Shops 
            raw={paramsData}
            shipping={userDefaultAddress?.shippingSummary}      
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
            shipping={userDefaultAddress?.shippingSummary}
            shippingRates={shippingRates}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button 
          enabled={!loading}
          loading={isLoading}
          total={grandTotal}
          shipping={userDefaultAddress}
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

export const ToktokMallCheckout = connect(null, mapDispatchToProps)(Component);

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