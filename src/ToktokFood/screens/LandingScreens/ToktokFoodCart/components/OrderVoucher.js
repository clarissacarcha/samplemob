/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
// import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Components
import InlineError from 'toktokfood/components/InlineError';
import StyledTextInput from 'toktokfood/components/StyledTextInput';
import VoucherList from 'toktokfood/components/VoucherList';
import {VerifyContext} from './VerifyContextProvider';

// Fonts/Colors
// import {COLORS, COLOR} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';
import {deleteKeys, parseAmountComputation} from '../functions';

// Queries
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_PAYMENT_METHOD_VALIDATION, GET_VOUCHER_CODE} from 'toktokfood/graphql/toktokfood';

const OrderVoucher = ({autoShipping, deliveryFee}) => {
  const dispatch = useDispatch();
  const {paymentMethod, shippingVoucher, setShippingVoucher, temporaryCart} = useContext(VerifyContext);
  const {customerInfo, promotionVoucher} = useSelector(state => state.toktokFood);

  // State
  const [voucher, setVoucher] = useState('');
  const [voucherError, setVoucherError] = useState(null);
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [showHighlightedError, setShowHighlightedError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showInlineError, setShowInlineError] = useState(false);

  const applyTextStyle = voucher ? styles.subText : {...styles.subText, color: '#C4C4C4'};
  // const voucherData = [...promotionVoucher, ...shippingVoucher];

  const [getVoucherCode, {loading}] = useLazyQuery(GET_VOUCHER_CODE, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: err => console.log(err),
    onCompleted: ({getVoucherCode}) => {
      const {success, message} = getVoucherCode;
      // setShowInlineError(true);
      console.log(getVoucherCode);

      if (!success) {
        setShowError(true);
        setVoucherError(`* ${message}`);
        setShowInlineError(true);
        const filterPromo = promotionVoucher.filter(promo => promo.type !== 'promotion' && promo.type !== 'shipping');
        const filterPromotions = promotionVoucher.filter(promo => promo.type === 'promotion');
        // console.log(filterPromo, promotionVoucher);
        dispatch({
          type: 'SET_TOKTOKFOOD_PROMOTIONS',
          payload: _.unionBy(filterPromo, filterPromotions, 'id'),
        });
        // setShippingVoucher([]);
        // setVoucherError('* Oops! Voucher not applied for this order. Please review details of voucher and try again.');
      } else {
        const {voucher} = getVoucherCode;
        const filterPromo = promotionVoucher.filter(promo => promo.id !== voucher.id);
        const {amount, is_percentage, on_top} = voucher;
        let totalDeliveryFee = 0;
        const filterDeal = promotionVoucher.filter(promo => promo.type === 'deal');
        // console.log(on_top, filterDeal)
        if ((!on_top && !filterDeal.length) || (on_top && !filterDeal.length) || (on_top && filterDeal[0].on_top > 0)) {
          if (amount > 0) {
            const pAmount = is_percentage !== '0' ? (amount / 100) * deliveryFee : amount;
            const totalFee = pAmount > deliveryFee ? deliveryFee : pAmount;
            // let totalSF = deliveryFee - pAmount;
            // totalSF = totalSF > 0 ? totalSF : 0;
            totalDeliveryFee = totalFee;
          } else {
            totalDeliveryFee = deliveryFee;
          }

          const voucherObj = [...filterPromo, {...voucher, origAmount: amount, amount: totalDeliveryFee}];
          dispatch({
            type: 'SET_TOKTOKFOOD_PROMOTIONS',
            payload: voucherObj,
          });
          setShowError(false);
          setShowInlineError(true);
        } else {
          setShowError(true);
          setVoucherError(
            '* Oops! Voucher not applied for this order. Please review details of voucher and try again.',
          );
          setShowInlineError(true);
        }

        // setShowError(!showError);
        // setVoucherError(null);
        // if (type !== 'shipping') {
        //   setShippingVoucher([getVoucherCode]);
        // }
        // if (type === 'shipping' && !autoShipping.success) {
        //   setShippingVoucher([getVoucherCode]);
        // } else {
        //   setShowError(!showError);
        //   setVoucherError('* Invalid voucher code. Please check your voucher code.');
        // }
      }
      setVoucher('');
    },
  });

  const [getVoucherPaymentMethod, {loading: loadingVoucher}] = useLazyQuery(GET_PAYMENT_METHOD_VALIDATION, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => console.log('getAutoShipping', error.response),
    onCompleted: ({getPaymentValidation}) => {
      console.log('getPaymentValidation', getPaymentValidation);
      const {message, voucher} = getPaymentValidation;
      if (message) {
        setVoucherError(`${message}`);
        setShowInlineError(true);
        setShowError(true);
      }
      dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: voucher});
    },
  });

  const onApplyVoucher = async () => {
    const {cartItemsLength, items} = temporaryCart;
    const promoCount = 0;

    if (cartItemsLength) {
      const orders = await parseAmountComputation(temporaryCart?.items);
      // console.log({
      //   input: {
      //     userId: Number(customerInfo.userId),
      //     brandId: items[0].companyId,
      //     shopid: items[0]?.shopid,
      //     code: voucher,
      //     region: items[0]?.shopRegion,
      //     subtotal: temporaryCart.totalAmount,
      //     paymentMethod: paymentMethod,
      //     promoCount,
      //     orders,
      //   },
      // });
      getVoucherCode({
        variables: {
          input: {
            userId: Number(customerInfo.userId),
            brandId: items[0].companyId,
            shopid: items[0]?.shopid,
            code: voucher,
            region: items[0]?.shopRegion,
            subtotal: temporaryCart.totalAmount,
            paymentMethod: paymentMethod,
            promoCount,
            orders,
          },
        },
      });
    }
  };

  const onCloseItem = id => {
    const filterData = promotionVoucher.filter(item => item.id !== id);
    dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: filterData});
  };

  const onShowError = useCallback(() => {
    if (autoShipping) {
      if (autoShipping?.success) {
        setShowHighlighted(autoShipping?.success);
        setShowHighlightedError(false);
      } else {
        setShowHighlighted(autoShipping?.success);
        setShowHighlightedError(true);
      }
    }
  }, [autoShipping]);

  useEffect(() => {
    // if (!autoShipping?.success && voucher) {
    //   onApplyVoucher();
    // }

    onShowError();
  }, [autoShipping, onShowError]);

  useEffect(() => {
    let shipping = promotionVoucher.filter(promo => promo.type === 'shipping');
    let promotions = promotionVoucher.filter(promo => promo.type === 'promotion');

    if (!autoShipping?.success && voucher) {
      onApplyVoucher();
    }

    getVoucherPaymentMethod({
      variables: {
        input: {
          paymentMethod,
          shippingvouchers: deleteKeys(shipping),
          vouchers: deleteKeys(promotions),
        },
      },
    });
  }, [paymentMethod]);

  const onChangeText = value => {
    setVoucherError(null);
    setShowError(false);
    setVoucher(value);
  };

  // const onRemoveVoucher = () => {
  //   setShippingVoucher([]);
  // };

  // const renderAutoShipping = () => (
  //   <View style={styles.autoShippingContainer}>
  //     <FIcon5 name="check-circle" size={17} color="#06A44E" />
  //     <Text style={styles.autoShippingText}>
  //       Order is eligible for shipping voucher promo. Voucher is automatically applied.
  //     </Text>
  //   </View>
  // );

  const Vouchers = () =>
    useMemo(() => {
      return (
        <View style={styles.voucherContainer}>
          <VoucherList data={promotionVoucher} onCloseItem={onCloseItem} />
        </View>
      );
    }, [promotionVoucher]);

  // const renderVoucher = () => {
  //   const {vname} = shippingVoucher[0].voucher;

  //   return (
  //     <View style={styles.autoShippingContainer}>
  //       <FIcon5 name="check-circle" size={17} color="#06A44E" />
  //       <Text style={styles.autoShippingText}>{vname}</Text>
  //     </View>
  //   );
  // };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Voucher</Text>
      </View>

      {/* {voucherError && (
        <View style={styles.subHeader}>
          <Text style={styles.subText}>{voucherError}</Text>
        </View>
      )} */}

      <InlineError isError={showHighlightedError} isVisible={showHighlighted} setIsVisible={setShowHighlighted} />

      <Vouchers />
      {/* {autoShipping?.success && renderAutoShipping()} */}

      {/* {shippingVoucher.length > 0 && renderVoucher()} */}

      {/* {!autoShipping?.success && ( */}
      {/* )} */}
      <View style={styles.formContainer}>
        <StyledTextInput
          hasIcon={shippingVoucher.length > 0}
          // error={voucherError}
          onChangeText={onChangeText}
          // onRemoveVoucher={onRemoveVoucher}
          label="Voucher"
          value={voucher}
          placeholder="Input Voucher (Optional)"
        />

        <TouchableOpacity disabled={voucher === '' || loading} onPress={onApplyVoucher} style={styles.apply}>
          <Text style={applyTextStyle}>Apply</Text>
        </TouchableOpacity>
      </View>

      <InlineError
        isError={showError}
        inlineMessage={voucherError}
        isInlineError
        isVisible={showInlineError}
        setIsVisible={setShowInlineError}
      />
    </View>
  );
};

export default OrderVoucher;

const styles = StyleSheet.create({
  apply: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: moderateScale(15),
  },
  autoShippingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(6, 164, 78, 0.2)',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
  },
  autoShippingText: {
    color: '#06A44E',
    marginLeft: 10,
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(10),
    paddingHorizontal: moderateScale(15),
  },
  header: {
    borderBottomWidth: 1,
    borderColor: '#F7F7FA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
  },
  subHeader: {
    backgroundColor: '#FFFCF4',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(5),
  },
  subText: {
    color: '#F6841F',
    fontSize: FONT_SIZE.M,
  },
  headerText: {
    fontWeight: '500',
    fontSize: FONT_SIZE.L,
  },
  container: {
    backgroundColor: 'white',
    paddingVertical: moderateScale(10),
  },
  voucherContainer: {
    paddingHorizontal: moderateScale(15),
    paddingTop: moderateScale(10),
  },
});
