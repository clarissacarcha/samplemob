/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useLazyQuery} from '@apollo/react-hooks';
import {useSelector} from 'react-redux';

import styles from '../styles';
import {wallet} from 'toktokfood/assets/images';

import {COLORS, FONT_SIZE} from 'res/constants';
import {VerifyContext} from './VerifyContextProvider';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';

import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {GET_MY_ACCOUNT} from 'toktokwallet/graphql';

// enum implementation on JavaScript

const PaymentDetails = ({refreshing, orderType, loadingShipping}) => {
  const navigation = useNavigation();
  const {toktokWallet, setToktokWallet, paymentMethod, setPaymentMethod, setPMLoading, pmLoading, temporaryCart} =
    useContext(VerifyContext);
  const {user} = useSelector(state => state.session);
  const {customerInfo, customerWallet} = useSelector(state => state.toktokFood);
  const [hasToktokWallet, setHasToktokWallet] = useState(false);

  const isDisabled = paymentMethod == 'TOKTOKWALLET' ? temporaryCart?.totalAmount > toktokWallet?.balance : false;

  const [getMyAccount, {loading, error}] = useLazyQuery(GET_MY_ACCOUNT, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({getMyAccount}) => {
      let {wallet, person} = getMyAccount;
      setToktokWallet({
        balance: wallet.balance,
        toktokuser_id: user.id,
        currency: wallet.currency.code,
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        notes: 'Payment by toktokfood customer',
      });
    },
    onError: error => {
      setToktokWallet(null);
    },
  });

  useEffect(() => {
    setPMLoading(loading || error);
  }, [loading, error, setPMLoading]);

  useEffect(() => {
    if (customerInfo && user) {
      if (user.toktokWalletAccountId) {
        setHasToktokWallet(true);
        setPaymentMethod('TOKTOKWALLET');
        getMyAccount();
      } else {
        setHasToktokWallet(false);
        setPaymentMethod('COD');
      }
    }
  }, [customerInfo, user, refreshing, setPaymentMethod, getMyAccount]);

  const onCashIn = ({balance}) => {
    // do something here
    // console.log(balance);
    getMyAccount();
  };

  const onPressTopUp = () => {
    navigation.navigate('ToktokWalletLoginPage');
  };

  const onToktokWalletCashInNavigate = () => {
    navigation.navigate('ToktokWalletPaymentOptions', {
      amount: 0,
      onCashIn: onCashIn,
    });
    // navigation.navigate('ToktokWalletHomePage', {
    //   screen: 'ToktokWalletPaymentOptions',
    // });
  };

  const DisplayComponent = () => {
    const getKycStatus = status => {
      switch (status) {
        case 0:
          return 'Declined';
        case 2:
          return 'Pending';
        default:
          return 'None';
      }
    };

    const CreateToktokWallet = () => (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.errorText}>
          Sorry! It seems that you don’t have a toktokwallet account yet. Please submit verification requirements to
          proceed placing an order. Once you get approved, you will be able to enjoy full benefits of ordering food from
          your favorite restaurants online using toktokfood.
        </Text>
        <Text
          onPress={() => {
            navigation.navigate('ToktokWalletVerification');
          }}
          style={styles.createText}>
          Create toktokwallet account
        </Text>
      </View>
    );

    const DeclinedWallet = () => (
      <View style={{alignItems: 'center'}}>
        <Text style={styles.errorText}>
          Uh-oh! It seems that your toktokwallet verification status is declined. Please submit verification
          requirements to proceed placing your order. Once you get approved, you will be able to enjoy full benefits of
          ordering food from your favorite restaurants online using toktokfood.
        </Text>

        <Text
          onPress={() => {
            navigation.navigate('ToktokWalletVerification');
          }}
          style={styles.createText}>
          Create toktokwallet account
        </Text>
      </View>
    );

    const ExceedLimit = () => (
      <View style={{alignItems: 'center'}}>
        <Text style={styles.errorText}>
          Your current order has exceeded the PHP 2000.00 limit for users with no toktokwallet account
        </Text>
      </View>
    );

    return (
      <>
        {loading || error ? (
          <LoadingIndicator size="small" style={{paddingHorizontal: 40}} isLoading={true} />
        ) : (
          <React.Fragment>
            <View style={styles.paymentContainer}>
              <TouchableOpacity
                disabled={!customerWallet || customerWallet?.status !== 1 || loadingShipping}
                onPress={() => setPaymentMethod('TOKTOKWALLET')}
                style={[
                  styles.tokwaButton,
                  styles.shadow,
                  {backgroundColor: COLORS.WHITE},
                  {opacity: loading || (customerWallet && customerWallet?.status === 1) ? 1 : 0.5},
                  {borderColor: paymentMethod === 'TOKTOKWALLET' ? COLORS.YELLOW : COLORS.WHITE},
                ]}>
                <Image style={styles.walletIcon} source={wallet} />
                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                  <View>
                    <View style={styles.tokwaButtonTextWrapper}>
                      <Text style={styles.toktokText}>toktok</Text>
                      <Text style={styles.walletText}>wallet</Text>
                    </View>
                    {customerWallet && !customerWallet?.account && (
                      <Text style={{color: '#707070', fontSize: FONT_SIZE.S}}>
                        Status: {getKycStatus(customerWallet?.status)}
                      </Text>
                    )}
                    {customerWallet && customerWallet?.account && (
                      <Text style={{color: '#707070', fontSize: FONT_SIZE.S}}>
                        Balance: PHP {toktokWallet?.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.00
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    disabled={!customerWallet || customerWallet?.status !== 1}
                    onPress={onToktokWalletCashInNavigate}>
                    <Text style={{color: '#FCB81A', fontSize: FONT_SIZE.M, paddingLeft: 15}}>Top up</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              {orderType === 'Delivery' && (
                <TouchableOpacity
                  disabled={
                    !customerWallet ||
                    customerWallet?.status < 1 ||
                    (temporaryCart.totalAmount > 2000 && customerWallet?.status === 2) ||
                    loadingShipping
                  }
                  onPress={() => setPaymentMethod('COD')}
                  style={[
                    styles.cashButton,
                    styles.shadow,
                    {backgroundColor: COLORS.WHITE},
                    {opacity: loading || customerWallet ? 1 : 0.4},
                    {borderColor: customerWallet && paymentMethod === 'COD' ? COLORS.YELLOW : COLORS.WHITE},
                  ]}>
                  <Text style={[styles.cashText, {color: COLORS.BLACK}]}>Cash</Text>
                </TouchableOpacity>
              )}
            </View>
            {isDisabled && (
              <TouchableOpacity activeOpacity={0.9} onPress={() => onToktokWalletCashInNavigate()}>
                <Text
                  style={{
                    fontSize: FONT_SIZE.M,
                    textAlign: 'center',
                    color: '#F6841F',
                    marginVertical: 10,
                    fontWeight: '500',
                  }}>
                  Insufficient balance. Please click here to cash in.
                </Text>
              </TouchableOpacity>
            )}

            {!customerWallet && <CreateToktokWallet />}
            {customerWallet && customerWallet?.status === 0 && <DeclinedWallet />}
            {customerWallet && customerWallet?.status === 2 && temporaryCart.totalAmount > 2000 && <ExceedLimit />}
          </React.Fragment>
        )}
      </>
    );
  };

  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={styles.deliverWrapper}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
        </View>
        <DisplayComponent />
      </View>
    </>
  );
};

export default PaymentDetails;
