import React, {useContext, useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {useSelector} from 'react-redux';

// Components
// import Loader from 'toktokfood/components/Loader';
import StyledTextInput from 'toktokfood/components/StyledTextInput';
import {VerifyContext} from './VerifyContextProvider';

// Fonts/Colors
// import {COLORS, COLOR} from 'res/constants';
import {FONT_SIZE, FONT} from 'res/variables';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

// Queries
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_VOUCHER_CODE} from 'toktokfood/graphql/toktokfood';

const OrderVoucher = ({autoShipping}) => {
  const {shippingVoucher, setShippingVoucher, temporaryCart} = useContext(VerifyContext);
  const {customerInfo} = useSelector((state) => state.toktokFood);

  // State
  const [voucher, setVoucher] = useState('');
  const [voucherError, setVoucherError] = useState(null);
  const [showError, setShowError] = useState(false);

  // console.log(shippingVoucher);

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
      // console.log(getVoucherCode, shippingVoucher);

      if (!success) {
        setShowError(!showError);
        setVoucherError(message);
      } else {
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
      getVoucherCode({
        variables: {
          input: {
            shopid: items[0]?.shopid,
            code: voucher,
            region: items[0]?.shopRegion,
            email,
            subtotal: temporaryCart.totalAmount,
            promoCount,
            isMystery,
          },
        },
      });
    }
  };

  const onChangeText = (value) => {
    setVoucherError(null);
    setShowError(false);
    setVoucher(value);
  };

  const renderVoucher = () => {
    const {valid_until, vname} = shippingVoucher[0].voucher;
    return (
      <View style={styles.voucherContainer}>
        <Text style={styles.voucherText}>{vname}</Text>
        <Text style={styles.validText}>Valid until: {valid_until}</Text>
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

      <View style={styles.formContainer}>
        {shippingVoucher.length ? (
          renderVoucher()
        ) : (
          <>
            <StyledTextInput
              hasIcon={showError}
              error={voucherError}
              onChangeText={onChangeText}
              label="Voucher"
              value={voucher}
            />

            <TouchableOpacity onPress={onApplyVoucher} style={styles.apply}>
              <Text style={styles.subText}>Apply</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(10),
    paddingHorizontal: moderateScale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
  },
  subHeader: {
    backgroundColor: '#FFFCF4',
    paddingHorizontal: moderateScale(20),
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10),
  },
  voucherText: {
    fontWeight: '500',
    fontSize: FONT_SIZE.L,
    color: '#FFA700',
  },
  validText: {
    fontSize: FONT_SIZE.M,
    color: '#9E9E9E',
  },
});
