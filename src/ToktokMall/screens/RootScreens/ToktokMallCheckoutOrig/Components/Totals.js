import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import  {FormatToText} from '../../../../helpers/formats';

import {CheckoutContext} from '../ContextProvider';

export const Totals = ({raw, shipping, setGrandTotal}) => {
  
  const CheckoutContextData = useContext(CheckoutContext);

  const [data, setData] = useState(raw || []);
  const [merchandiseTotal, setMerchandiseTotal] = useState(0);
  const [shippingFeeTotal, setShippingFeeTotal] = useState(0);
  const [shippingDiscountTotal, setShippingDiscountTotal] = useState(0);

  useEffect(() => {
    setData(raw);
  }, [raw]);

  const computeShippingFee = () => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total = total + parseFloat(shipping?.rateAmount);
    }
    shippingFeeTotal = total;
    if (!total) return FormatToText.currency(0);
    else return FormatToText.currency(total);
  };

  const computeShippingDiscount = () => {
    let total = 0;
    console.log("T Shipping Fee", CheckoutContextData.shippingFeeRates)
    console.log("T VOuchers", CheckoutContextData.shippingVouchers)

    for(var x=0;x<CheckoutContextData.shippingFeeRates.length;x++){

      let shipping = CheckoutContextData.shippingFeeRates[x];
      let voucherIndex = CheckoutContextData.shippingVouchers.findIndex((e) => e != null && e.shopid == shipping.shopid)

      if(voucherIndex > -1){
        let discount = CheckoutContextData.shippingVouchers[voucherIndex]
        if(discount?.amount){
          let voucheramount = discount?.amount;
          if (shipping.shippingfee && voucheramount && shipping.shippingfee - voucheramount < 0) {
            total = total + 0
          }else{
            total = total + parseFloat(discount.discountedAmount)
          }
        }else if(discount?.amount === 0){
          total = total + 0
        }
      }else{
        total = total + parseFloat(shipping.shippingfee)
      }
    }

    setShippingDiscountTotal(total);
  };

  const computeShippingTotal = () => {
    let total = 0;
    for (let i = 0; i < CheckoutContextData.shippingFeeRates.length; i++) {
      total = total + parseFloat(CheckoutContextData.shippingFeeRates[i].shippingfee);
    }
    setShippingFeeTotal(total);
  };

  const getDiscount = (type) => {
    if (type == 'shipping') {
      if(CheckoutContextData.shippingVouchers.length > 0){
        return CheckoutContextData.shippingVouchers[0]?.valid
      }else{
        return false
      }
    }
  };

  useEffect(() => {
    if (CheckoutContextData) {
      computeShippingTotal();
      computeShippingDiscount();
    }
  }, [CheckoutContextData]);

  useEffect(() => {
    if (data) {
      let total = 0;
      data?.length > 0 &&
        data?.map((item, i) => {
          console.log(item.data);
          for (let i = 0; i < item.data[0].length; i++) {
            total = total + parseFloat(item.data[0][i].amount);
          }
        });
      setMerchandiseTotal(total);
    }
  }, [data]);

  useEffect(() => {
    if (merchandiseTotal && shippingFeeTotal) {
      if(getDiscount("shipping")){
        setGrandTotal(merchandiseTotal + shippingDiscountTotal);
      }else{
        setGrandTotal(merchandiseTotal + shippingFeeTotal);
      }
    }
  }, [merchandiseTotal, shippingFeeTotal, shippingDiscountTotal]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={{fontSize: 13}}>Merchandise SubTotal:</Text>
          <Text>{FormatToText.currency(merchandiseTotal)}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text>Shipping Total:</Text>
          <View style={{flexDirection: 'row'}}>

            <View style={{flex: 0}}>
              <Text
                style={{
                  textDecorationLine: getDiscount('shipping') ? 'line-through' : 'none',
                  color: getDiscount('shipping') ? '#929191' : '#000',
                }}>
                {FormatToText.currency(shippingFeeTotal)}
              </Text>
            </View>
            <View style={{flex: 0}}>{getDiscount('shipping') ? <Text> {FormatToText.currency(shippingDiscountTotal)}</Text> : null}</View>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={{fontWeight: 'bold'}}>Total:</Text>
          {
            getDiscount('shipping') ? 
            <Text style={{color: '#F6841F'}}>
            {FormatToText.currency((shippingDiscountTotal || 0) + (merchandiseTotal || 0))}
            </Text>
            :
            <Text style={{color: '#F6841F'}}>
            {FormatToText.currency((shippingFeeTotal || 0) + (merchandiseTotal || 0))}
            </Text>
          }
          
        </View>
      </View>
      <View style={{height: 50}} />
    </>
  );
};

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA'},
  container: {padding: 15, backgroundColor: 'white', marginTop: 8},
  textContainer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12},
  textContainer2: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20},
});
