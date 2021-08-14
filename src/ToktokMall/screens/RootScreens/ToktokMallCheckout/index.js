import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions } from 'react-native';
import { COLOR, FONT } from '../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import { AddressForm, Button, Payment, Shops, Totals, Vouchers, CheckoutModal } from './Components';

import coppermask from '../../../assets/images/coppermask.png'
import suit from '../../../assets/images/coppermask.png'

import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_CHECKOUT_DATA } from '../../../../graphql/toktokmall/model';
import {Loading} from '../../../Components/Widgets';

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
  signature: "TOKTKOMALLAPI2021",
  data: {
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
    account_type: "",
    vouchers: [{
      shopid: 1,
      vcode: "",
      vamount: ""
    }],
    referral_code: "",
    referral_account_type: "",
    payment_method: ""
  }
}

export const ToktokMallCheckout = ({route, navigation}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Checkout', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  const [isVisible, setIsVisible] = useState(false)
  // const [data, setData] = useState([])
  const [paramsData, setParamsData] = useState([])
  const [addressData, setAddressData] = useState([])
  const [payment, setPaymentMethod] = useState(3);
  const [vouchers, setVouchers] = useState([])
  const [grandTotal, setGrandTotal] = useState(0)

  const [getCheckoutData, {error, loading}] = useLazyQuery(GET_CHECKOUT_DATA, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        userId: 1024
      }
    },
    onCompleted: (response) => {
      if(response.getCheckoutData){
        setAddressData(response.getCheckoutData.address);
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  useEffect(() => {
    getCheckoutData()
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
  }, [route.params])

  if(loading) {
    return <Loading state={loading} />
  }

  return (
    
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CheckoutModal 
          navigation={navigation} 
          isVisible={isVisible} 
          setIsVisible={setIsVisible} 
        />
        <View style ={{paddingBottom: 0}}>
          <AddressForm
            data={addressData}
            onEdit={() => navigation.push("ToktokMallAddressesMenu", {onGoBack: (data) => getCheckoutData()})}
          />
          <Shops 
            raw={paramsData}
            shipping={addressData?.shippingSummary}
          />
          <Vouchers 
            navigation={navigation} 
            vouchers={vouchers}
            setVouchers = {setVouchers} 
          />
          <Payment 
            payment={payment} 
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
          total={grandTotal}
          isVisible={isVisible} 
          setIsVisible={setIsVisible} 
          unSelectedItemsArr={route.params.unSelectedItemsArr} 
        />
      </View>
    </>
    
  );
};


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