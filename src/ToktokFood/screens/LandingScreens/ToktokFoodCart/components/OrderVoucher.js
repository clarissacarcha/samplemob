/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Components
// import Loader from 'toktokfood/components/Loader';
import StyledTextInput from 'toktokfood/components/StyledTextInput';
import {VerifyContext} from './VerifyContextProvider';

// Fonts/Colors
// import {COLORS, COLOR} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

// Queries
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_VOUCHER_CODE} from 'toktokfood/graphql/toktokfood';

const OrderVoucher = ({autoShipping}) => {
  const {paymentMethod, shippingVoucher, setShippingVoucher, temporaryCart} = useContext(VerifyContext);
  const {customerInfo} = useSelector(state => state.toktokFood);

  // State
  const [voucher, setVoucher] = useState('');
  const [voucherError, setVoucherError] = useState(null);
  const [showError, setShowError] = useState(false);

  const [getVoucherCode] = useLazyQuery(GET_VOUCHER_CODE, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    // variables: {
    //   input: {
    //     shopid: temporaryCart.items[0]?.shopid,
    //     code: voucher,
    //   },
    // },
    onCompleted: ({getVoucherCode}) => {
      const {success, message, type} = getVoucherCode;
      if (!success) {
        setShowError(!showError);
        setVoucherError(`* ${message}`);
        setShippingVoucher([]);

        // setVoucherError('* Oops! Voucher not applied for this order. Please review details of voucher and try again.');
      } else {
        setShowError(!showError);
        setVoucherError(null);
        if (type !== 'shipping') {
          setShippingVoucher([getVoucherCode]);
        }
        if (type === 'shipping' && !autoShipping.success) {
          setShippingVoucher([getVoucherCode]);
        } else {
          setShowError(!showError);
          setVoucherError('* Invalid voucher code. Please check your voucher code.');
        }
      }
    },
  });

  const onApplyVoucher = () => {
    const {cartItemsLength, items} = temporaryCart;
    const {email} = customerInfo;
    const promoCount = 0;
    const isMystery = 0;

    if (cartItemsLength) {
      // console.log({
      //   input: {
      //     brandId: items[0].companyId,
      //     shopid: items[0]?.shopid,
      //     code: voucher,
      //     region: items[0]?.shopRegion,
      //     email,
      //     subtotal: temporaryCart.totalAmount,
      //     paymentMethod: paymentMethod === 'COD' ? 'CASH' : paymentMethod,
      //     promoCount,
      //     isMystery,
      //   },
      // });
      getVoucherCode({
        variables: {
          input: {
            brandId: items[0].companyId,
            shopid: items[0]?.shopid,
            code: voucher,
            region: items[0]?.shopRegion,
            email,
            subtotal: temporaryCart.totalAmount,
            paymentMethod: paymentMethod === 'COD' ? 'CASH' : paymentMethod,
            promoCount,
            isMystery,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (!autoShipping?.success && voucher) {
      onApplyVoucher();
    }
  }, [paymentMethod]);

  const onChangeText = value => {
    setVoucherError(null);
    setShowError(false);
    setVoucher(value);
  };

  const onRemoveVoucher = () => {
    setShippingVoucher([]);
  };

  const renderAutoShipping = () => (
    <View style={styles.autoShippingContainer}>
      <FIcon5 name="check-circle" size={17} color="#06A44E" />
      <Text style={styles.autoShippingText}>
        Order is eligible for shipping voucher promo. Voucher is automatically applied.
      </Text>
    </View>
  );

  const renderVoucher = () => {
    const {vname} = shippingVoucher[0].voucher;

    return (
      <View style={styles.autoShippingContainer}>
        <FIcon5 name="check-circle" size={17} color="#06A44E" />
        <Text style={styles.autoShippingText}>{vname}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Voucher</Text>
      </View>

      {voucherError && (
        <View style={styles.subHeader}>
          <Text style={styles.subText}>{voucherError}</Text>
        </View>
      )}

      {autoShipping?.success && renderAutoShipping()}

      {shippingVoucher.length > 0 && renderVoucher()}

      {!autoShipping?.success && (
        <View style={styles.formContainer}>
          <StyledTextInput
            hasIcon={shippingVoucher.length > 0}
            error={voucherError}
            onChangeText={onChangeText}
            onRemoveVoucher={onRemoveVoucher}
            label="Voucher"
            value={voucher}
            placeholder="Input Voucher(optional)"
          />

          <TouchableOpacity onPress={onApplyVoucher} style={styles.apply}>
            <Text style={styles.subText}>Apply</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: moderateScale(20),
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
});
