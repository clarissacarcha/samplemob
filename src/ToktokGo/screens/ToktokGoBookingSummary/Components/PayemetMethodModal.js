import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';
import CONSTANTS from '../../../../common/res/constants';
import CashIcon from '../../../../assets/images/CashIcon.png';
import WalletIcon from '../../../../assets/images/Wallet.png';
import {numberFormat} from '../../../../helper';

export const PaymentMethodModal = ({
  navigation,
  viewSelectPaymentModal,
  setViewSelectPaymentModal,
  details,
  setSelectedPaymentMethod,
  tokwaAccount,
  getMyAccountLoading,
}) => {
  const dispatch = useDispatch();
  const {wallet, id} = tokwaAccount;
  const setSelected = paymentMethod => {
    dispatch({type: 'SET_TOKTOKGO_BOOKING_DETAILS', payload: {...details, paymentMethod: paymentMethod}});
    setSelectedPaymentMethod(paymentMethod);
    setViewSelectPaymentModal(false);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={viewSelectPaymentModal} style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={() => setViewSelectPaymentModal(false)}>
        <View style={styles.transparent}>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setSelected('TOKTOKWALLET')}>
              <View style={styles.container}>
                <View style={styles.elementWrapper}>
                  <Image source={WalletIcon} resizeMode={'contain'} style={styles.walletIconStyle} />
                  <View style={{marginLeft: 8}}>
                    <Text style={{color: CONSTANTS.COLOR.YELLOW}}>
                      toktok<Text style={{color: CONSTANTS.COLOR.ORANGE}}>wallet</Text>
                    </Text>
                    {getMyAccountLoading ? (
                      <ActivityIndicator color={CONSTANTS.COLOR.YELLOW} />
                    ) : (
                      <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>Balance: ₱{numberFormat(wallet.balance)}</Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.cashInWrapper}
                  onPress={() => {
                    navigation.navigate('ToktokWalletLoginPage');
                  }}>
                  <Text style={styles.cashIntextStyle}>Cash In</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity onPress={() => setSelected('CASH')}>
              <View style={styles.container}>
                <View style={styles.elementWrapper}>
                  <Image source={CashIcon} resizeMode={'contain'} style={styles.walletIconStyle} />
                  <View style={{marginLeft: 8}}>
                    <Text style={{color: CONSTANTS.COLOR.YELLOW, fontSize: CONSTANTS.FONT_SIZE.M}}>Cash</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  elementWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cashInWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: CONSTANTS.COLOR.ORANGE,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  cashIntextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
  walletIconStyle: {
    width: 40,
    height: 34,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    marginVertical: 16,
  },
});
