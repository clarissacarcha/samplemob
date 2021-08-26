import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, BackHandler, Alert } from 'react-native';
import { COLOR, FONT } from '../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import { AddressForm, Button, Payment, Shops, Totals, Vouchers, CheckoutModal } from './Components';
import {connect} from 'react-redux'
import coppermask from '../../../assets/images/coppermask.png'
import suit from '../../../assets/images/coppermask.png'
import { useSelector } from 'react-redux';

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_CHECKOUT_DATA, POST_CHECKOUT } from '../../../../graphql/toktokmall/model';
import {Loading} from '../../../Components/Widgets';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-simple-toast";
import axios from "axios";
import {AlertModal} from '../../../Components/Widgets'
import {ApiCall, PaypandaApiCall, BuildPostCheckoutBody} from "../../../helpers"

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

  const user_address = useSelector(state=> state.toktokMall.user_address)

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
  const [payment, setPaymentMethod] = useState("cod")
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

  const setAlertTrue = () => {
    setAlertModal(true)
  }

  const [getCheckoutData, {error, loading}] = useLazyQuery(GET_CHECKOUT_DATA, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getCheckoutData){
        setAddressData(response.getCheckoutData.address);
        setPaymentList(response.getCheckoutData.paymentMethods);
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const [postCheckout, {error2, loading2}] = useMutation(POST_CHECKOUT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    variables: {
      input: postCheckoutBody
    },
    onCompleted: (response) => {
      console.log("Checkout result", response)
      if(response.postCheckout){
        if(response.postCheckout.success == 1){
          alert(response.postCheckout.message)
        }
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const UpdateCart = async () => {
    // let stringyfiedArr = JSON.stringify(newCartData)
    // await AsyncStorage.setItem('MyCart', stringyfiedArr)
    createMyCartSession("set", newCartData)
  }

  const postCheckoutSettingx = async () => {

    setIsLoading(true)

    //populate the postCheckoutBody basic data
    postCheckoutBody.name = addressData.receiverName
    postCheckoutBody.contactnumber = addressData.receiverContact
    postCheckoutBody.address = addressData.address
    postCheckoutBody.regCode = addressData.regionId

    //pangasinan
    if(addressData.provinceId == "0"){
      postCheckoutBody.provCode = "0155"
    }else{
      postCheckoutBody.provCode = addressData.provinceId
    }
    postCheckoutBody.citymunCode = addressData.municipalityId
    postCheckoutBody.total_amount = parseFloat(grandTotal)
    postCheckoutBody.srp_totalamount = parseFloat(grandTotal)
    postCheckoutBody.payment_method = payment
    // postCheckoutBody.vouchers = []
    postCheckoutBody.order_logs = []

    //build order log list
    paramsData.map((val, index) => {

      let items = []
      if(val.cart.length == 0 || val.cart == undefined) return
      val.cart.map((item, i) => {
        let total = parseFloat(item.price) * item.qty
        items.push({
          sys_shop: item.store_id,
          product_id: item.item_id,
          quantity: item.qty,
          amount: parseFloat(item.price),
          srp_amount: parseFloat(item.price),
          srp_totalamount: total,
          total_amount: total,
          order_type: 2
        })
      })

      postCheckoutBody.order_logs.push({
        sys_shop: val.store_id,
        branchid: 0,
        delivery_amount: addressData.shippingSummary.rateAmount,
        daystoship: addressData.shippingSummary.fromDay,
        daystoship_to: addressData.shippingSummary.toDay,
        items: items
      })

    })

    AsyncStorage.getItem("ToktokMallUser").then(async (raw) => {
      let data = JSON.parse(raw) || {}
      if(data.userId){

        postCheckoutBody.user_id = data.userId
        postCheckoutBody.email = data.email
        
        let formData = new FormData()
        formData.append("signature", data.appSignature)
        formData.append("data", JSON.stringify(postCheckoutBody))

        console.log("PostCheckoutBody", JSON.stringify(postCheckoutBody))

        await axios.post(
          `http://ec2-18-176-178-106.ap-northeast-1.compute.amazonaws.com/toktokmall/checkout`,
          formData).then((response) => {
      
            if(response.data && response.data.success == 1){
              
              if(route?.params?.type == "from_cart"){
                UpdateCart()      
              }

              setIsVisible(true)
              setIsLoading(false)

            }else if(response.data && response.data.success == 0){

              setIsLoading(false)
              Toast.show(response.data.message, Toast.LONG)
              
            }else{              

              Toast.show("Something went wrong")
              console.log("Response", response)
              setIsLoading(false)
            
            }

            console.log("Response", response)

          }).catch((error) => {
            console.log(error)
            Toast.show("Something went wrong")
            setIsLoading(false)
        })

      }
    })

    // await postCheckout()

  }

  const postCheckoutSetting = async () => {
    
    setIsLoading(true)

    const checkoutBody = await BuildPostCheckoutBody({
      items: paramsData, 
      addressData: addressData, 
      grandTotal: grandTotal, 
      paymentMethod: payment
    })

    const req = await ApiCall("checkout", checkoutBody, false)

    if(req.responseData && req.responseData.success == 1){

      if(route?.params?.type == "from_cart"){
        UpdateCart()
      }

      // if(payment == "paypanda"){

      //   if(req.responseData.paypanda){

      //     const paypandaReq = await PaypandaApiCall({
      //       data: req.responseData.paypanda,
      //       addressData: addressData
      //     })

      //     if(paypandaReq){
      //       navigation.push("ToktokMallPaymentWebview", {
      //         contents: paypandaReq.responseData, 
      //         onSuccess: () => {
      //           setIsVisible(true)
      //           setIsLoading(false)
      //         }}
      //       )
      //     }

      //   }

      // }else{
      //   setIsVisible(true)
      //   setIsLoading(false)
      // }

      setIsVisible(true)
      setIsLoading(false)

    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }

    setIsLoading(false)

  }

  useEffect(() => {
    const backAction = () => {
      console.log('something mo to')
      setAlertModal(true)
      return true
    }
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    )
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw) || {}
      if(data.userId){
        console.log(data.userId)

        //FOR TESTING
        // getCheckoutData({variables: {input: {userId: 1024}}})

        getCheckoutData({variables: {input: {userId: data.userId}}})

      }
    })

    console.log(route.params)
    return () => backHandler.remove()
    // getCheckoutData()
  },[])

  useEffect(() => {
    let a = 0;
    if(!addressData) return
    for (var x = 0; x < route.params.data.length; x++) {
      for (var y = 0; y < route.params.data[x].cart.length; y++) {
        let item = route.params.data[x].cart[y];
        a += parseFloat(item.price) * item.qty;
      }
      a += parseFloat(addressData?.shippingSummary?.rateAmount)
    }
    setGrandTotal(a)
  }, [addressData])

  useEffect(() => {
    setParamsData(route?.params?.data)
    setNewCartData(route?.params.newCart)
  }, [route.params])

  useEffect(() => {
    console.log(grandTotal)
  }, [grandTotal])

  if(loading) {
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
        />
        <View style ={{paddingBottom: 0}}>
          <AddressForm
            data={addressData}
            onEdit={() => navigation.push("ToktokMallAddressesMenu", {
              onGoBack: (data) => {
                setAddressData(data)
                // getCheckoutData()
              }
            })}
          />
          <Shops 
            raw={paramsData}
            shipping={addressData?.shippingSummary}            
          />
          <Vouchers 
            navigation={navigation} 
            vouchers={vouchers}
            setVouchers={setVouchers} 
            vcode={vcode}
            setvCode={setvCode}
            setVoucher={(data) => {
              let temp = []
              temp.push(data)
              setVoucher(temp)
            }}
          />
          <Payment 
            payment={payment} 
            total={grandTotal}
            list={paymentList}
            setPaymentMethod={setPaymentMethod} 
          />
          <Totals 
            raw={paramsData}
            shipping={addressData?.shippingSummary}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button 
          enabled={!loading}
          loading={isLoading}
          total={grandTotal}
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
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
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