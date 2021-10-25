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

const OrderVoucher = () => {
  const {temporaryCart} = useContext(VerifyContext);
  const {customerInfo} = useSelector((state) => state.toktokFood);

  // State
  const [voucher, setVoucher] = useState('');
  const [voucherError, setVoucherError] = useState(null);
  const [showError, setShowError] = useState(false);

  // console.log(temporaryCart, totalAmount);

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
      // console.log(getVoucherCode);
      const {success} = getVoucherCode;
      if (!success) {
        setShowError(!showError);
        setVoucherError('* Invalid voucher code. Please check your voucher code.');
      }
    },
  });

  const onApplyVoucher = () => {
    const {cartItemsLength, items} = temporaryCart;
    const {email} = customerInfo;
    const promoCount = 1;
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
});
