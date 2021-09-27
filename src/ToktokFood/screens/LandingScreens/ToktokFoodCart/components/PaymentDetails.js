import React, {useState, useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import styles from '../styles';
import {wallet} from 'toktokfood/assets/images';

import {COLORS, FONT, FONT_SIZE} from 'res/constants';
import { VerifyContext } from './VerifyContextProvider';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import { GET_MY_ACCOUNT } from 'toktokwallet/graphql';
import {useSelector} from 'react-redux';

// enum implementation on JavaScript

const PaymentDetails = ({ refreshing }) => {

  const navigation = useNavigation();
  const {
    toktokWallet,
    setToktokWallet,
    paymentMethod,
    setPaymentMethod,
    setPMLoading,
    pmLoading,
  } = useContext(VerifyContext);
  const {user} = useSelector((state) => state.session);
  const {location, customerInfo, shopLocation} = useSelector((state) => state.toktokFood);
  const [hasToktokWallet, setHasToktokWallet] = useState(false);
  const disabled = true;

  const [ getMyAccount, { loading, error } ] = useLazyQuery(GET_MY_ACCOUNT , {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({ getMyAccount })=> {
      let { wallet, person } = getMyAccount;
      setToktokWallet({
        balance: wallet.balance,
        toktokuser_id: getMyAccount.id,
        currency: wallet.currency.code,
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        notes: 'Payment by toktokfood customer',
      });
    },
    onError: (error) => {
      console.log(error)
      setToktokWallet(null)
    }
  });

  useEffect(() => {
    setPMLoading(loading || error)
  }, [loading, error])

  useEffect(() => {
    if(customerInfo && user){
      if(user.toktokWalletAccountId){
        setHasToktokWallet(true)
        setPaymentMethod('TOKTOKWALLET')
        getMyAccount();
      } else {
        setHasToktokWallet(false)
        setPaymentMethod('COD')
      }
    }
  }, [customerInfo, user, refreshing])

  const onCashIn = ({ balance })=> {
    // do something here
    console.log(balance)
    getMyAccount();
  }

  const onPressTopUp = () => {
    navigation.navigate('ToktokWalletPaymentOptions' , {
        amount: 0,
        onCashIn: onCashIn,
    })
  }

  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={styles.deliverWrapper}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
        </View>
        { (loading || error) ? (
          <LoadingIndicator size='small' style={{ paddingHorizontal: 40 }} isLoading={true} />
        ) : (
          <View style={styles.paymentContainer}>
            { hasToktokWallet && (
                <TouchableOpacity
                  disabled={!hasToktokWallet}
                  onPress={() => setPaymentMethod('TOKTOKWALLET')}
                  style={[
                    styles.tokwaButton,
                    styles.shadow,
                    { backgroundColor: loading || hasToktokWallet ? COLORS.WHITE : COLORS.LIGHT },
                    { borderColor: paymentMethod === 'TOKTOKWALLET' ? COLORS.YELLOW : COLORS.WHITE },
                  ]}
                >
                <Image style={styles.walletIcon} source={wallet} />
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <View>
                  <View style={styles.tokwaButtonTextWrapper}>
                    <Text style={styles.toktokText}>toktok</Text>
                    <Text style={styles.walletText}>wallet</Text>
                  </View>
                  <Text style={{ color: '#707070', fontSize: FONT_SIZE.S }}>
                    Balance: PHP {toktokWallet?.balance.toFixed(2)}
                  </Text>
                  </View>
                  <TouchableOpacity onPress={onPressTopUp}>
                    <Text style={{ color: '#FCB81A', fontSize: FONT_SIZE.M, paddingLeft: 15 }}>
                      Top up
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={() => setPaymentMethod('COD')}
              style={[
                styles.cashButton,
                styles.shadow,
                {borderColor: paymentMethod === 'COD' ? COLORS.YELLOW : COLORS.WHITE},
              ]}>
              <Text
                style={[
                  styles.cashText,
                  { color: paymentMethod === 'COD' ? COLORS.YELLOW : COLORS.BLACK }
                ]}>
                  Cash
                </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

export default PaymentDetails;
