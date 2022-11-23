import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FONT } from '../../../../../res/variables';
import Icons from '../../../../Components/Icons';
import { RoundOffValue } from '../../../../helpers';
import { FormatToText } from '../../../../helpers/formats';
import { CheckoutContext } from '../ContextProvider';

export const Totals = ({raw, shipping, setGrandTotal, referral}) => {
  
  const CheckoutContextData = useContext(CheckoutContext);

  const [data, setData] = useState(raw || []);
  const [merchandiseTotal, setMerchandiseTotal] = useState(0);
  const [shippingFeeTotal, setShippingFeeTotal] = useState(0);
  const [shippingDiscountTotal, setShippingDiscountTotal] = useState(0);
  const [toggleVouchers, setToggleVouchers] = useState(true);
  const [numOfVouchers, setOfNumVouchers] = useState(0);
  const [resellerDiscounts, setResellerDiscounts] = useState(0);

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

  useEffect(() => {
    if (data) {
      let total = 0;
      data?.length > 0 &&
        data?.map((item, i) => {
          console.log(item.data);
          for (let i = 0; i < item.data[0].length; i++) {
            let item2 = item.data[0][i]
            if(i == 0 && referral && referral?.franchiseeCode != null){

              let shopDiscount = CheckoutContextData.getShopItemDiscount(item2.shopId, item2.id)
              if(shopDiscount){
                total = total + parseFloat(item2.product.compareAtPrice * item2.qty)
              }else{
                // total = total + parseFloat(item2.product.price)
                total = total + parseFloat(item2.product.compareAtPrice * item2.qty)
              }              
            }else{
              if(referral && referral?.franchiseeCode != null){
                let itemsrpprice = parseFloat(item2.product.compareAtPrice * item2.qty)
                total = total + itemsrpprice
              }else{
                total = total + parseFloat(item2.amount)
              }
            }
            // total = total + parseFloat(item.data[0][i].amount);
          }
        });
      setMerchandiseTotal(total);
    }
  }, [data]);

  useEffect(() => {
    if (CheckoutContextData) {
      
      const numvouchers = CheckoutContextData.shippingVouchers.filter((a) => a.valid != undefined || a.voucher_id != undefined)
      const resellerDiscount = CheckoutContextData.resellerDiscounts
            
      computeShippingTotal();
      // computeShippingDiscount();
      setShippingDiscountTotal(CheckoutContextData.getTotalVoucherDeduction())
      setOfNumVouchers(numvouchers.length)

      if(referral && referral.franchiseeCode != null){
        setResellerDiscounts(resellerDiscount)
        console.log("RESELLER DISCOUNT", resellerDiscount)
        console.log("RESELLER", referral)
      }
    }
  }, [CheckoutContextData]);

  useEffect(() => {
    if (merchandiseTotal && shippingFeeTotal) {
      
      if(referral && referral.franchiseeCode != null){
        const discounts = shippingDiscountTotal + resellerDiscounts
        setGrandTotal((merchandiseTotal + shippingFeeTotal) - discounts)
      }else{
        setGrandTotal(merchandiseTotal + shippingFeeTotal - shippingDiscountTotal)
      }
      
    }
  }, [merchandiseTotal, shippingFeeTotal, shippingDiscountTotal, resellerDiscounts]);

  const RenderVouchersBreakdown = () => {

    // let vouchers = toggleVouchers ? CheckoutContextData.shippingVouchers.slice(0,2) : CheckoutContextData.shippingVouchers
    let vouchers = toggleVouchers ? [] : CheckoutContextData.shippingVouchers    
    let totalDeduction = CheckoutContextData.getTotalVoucherDeduction() + resellerDiscounts

    return (
      <>
        <View style={styles.textContainer}>
          <View style={styles.voucherContainer}>
            <Text style={styles.voucherTitleText}>Vouchers</Text>
            <TouchableOpacity onPress={() => setToggleVouchers(!toggleVouchers)} style={styles.toggleVoucherButton}>
              <Icons.AIcon name={toggleVouchers ? 'down' : 'up'} size={14} />
            </TouchableOpacity>
          </View>        
          <Text style={styles.totalDeductionText}>- {FormatToText.currency(RoundOffValue(totalDeduction))}</Text>
        </View>        
        <View>          
          {
            vouchers
              .filter((a) => {                
                return a.voucher_id != undefined || a.valid != undefined
              }).map((item) => {

                let deduction = CheckoutContextData.getVoucherDeduction(item)

                return (
                  <>
                    <View style={styles.textContainer}>
                      <Text ellipsizeMode='tail' style={styles.voucherNameText}>{item.vname || item.voucher_name}</Text>
                      <Text style={styles.deductionText}>- {FormatToText.currency(RoundOffValue(deduction))}</Text>
                    </View>
                  </>
                )

              })
          }
          {
            referral && referral.franchiseeCode != null && !toggleVouchers ? <>
            <View style={styles.textContainer}>
              <Text ellipsizeMode='tail' style={styles.voucherNameText}>Reseller</Text>
              <Text style={styles.deductionText}>- {FormatToText.currency(RoundOffValue(resellerDiscounts))}</Text>
            </View>
            </> : <></>
          }
        </View>
      </>
    )
  }

  return (
    <>
      <View style={styles.container}>        
        {/* <View style={styles.textContainer}>
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
        </View> */}
        <View style={styles.textContainer}>
          <Text style={styles.shippingTotalTitle}>Shipping Total</Text>
          <Text>{FormatToText.currency(shippingFeeTotal)}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.shippingTotalTitle}>Merchandise Subtotal</Text>
          <Text>{FormatToText.currency(merchandiseTotal)}</Text>
        </View>
        
        {numOfVouchers > 0 || resellerDiscounts > 0 ? <RenderVouchersBreakdown /> : null}

        <View style={styles.divider} />

        <View style={styles.textContainer}>
          <Text style={styles.totalTitle}>Total</Text>
          {/* {
            getDiscount('shipping') ? 
            <Text style={{color: '#F6841F'}}>
            {FormatToText.currency((shippingDiscountTotal || 0) + (merchandiseTotal || 0))}
            </Text>
            :
            <Text style={{color: '#F6841F'}}>
            {FormatToText.currency((shippingFeeTotal || 0) + (merchandiseTotal || 0))}
            </Text>
          } */}

            <Text style={styles.totalText}>
            {FormatToText.currency(RoundOffValue((merchandiseTotal || 0) + (shippingFeeTotal || 0) - (shippingDiscountTotal || 0) - (resellerDiscounts || 0)))}
            </Text>
          
        </View>
        
        <View style={styles.divider} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1, 
    backgroundColor: '#F7F7FA'
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: 'white', 
    marginTop: 8
  },
  voucherContainer: {
    flexDirection: 'row'
  },
  voucherTitleText: {
    fontSize: 13
  },
  toggleVoucherButton: {
    flex: 1, 
    marginLeft: 8, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  totalDeductionText: {
    color: "#ED3A19"
  },
  textContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 12
  },
  voucherNameText: {
    flex: 1, 
    fontSize: 13, 
    color: "#525252"
  },
  deductionText: {
    color: "#ED3A19"
  },
  shippingTotalTitle: {
    fontSize: 13
  },
  textContainer2: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 20
  },
  divider: {
    height: 1, 
    marginTop: 10, 
    backgroundColor: "#F7F7FA"
  },
  totalTitle: {
    fontFamily: FONT.BOLD, 
    color: "#F6841F"
  },
  totalText: {
    color: '#F6841F', 
    fontFamily: FONT.SEMI_BOLD
  }
});
