import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, TextInput, Platform} from 'react-native';
import {PolicyNote, OrangeButton} from 'toktokwallet/components';
import {useAccount} from 'toktokwallet/hooks';
import {numberFormat, AmountLimitHelper, currencyCode} from 'toktokwallet/helper';
import {useDispatch} from 'react-redux';
import CONSTANTS from 'common/res/constants';
import {useAlert, usePrompt} from 'src/hooks';
import {useDebounce} from 'toktokwallet/hooks';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;

const inputAmountLength = {
  0: 90,
  1: 90,
  2: 90,
  3: 90,
  4: 90,
  5: 120,
  6: 140,
  7: 150,
  8: 165,
  9: 175,
};

export const DragonPayCashIn = ({navigation, route, transactionType, remainingCashIn}) => {
  const cashInAmount = route?.params?.amount ? route.params.amount : null;
  const onCashIn = route?.params?.onCashIn ? route.params.onCashIn : null;
  const {tokwaAccount, getMyAccountLoading, getMyAccount} = useAccount();
  const [amount, setAmount] = useState(cashInAmount ? cashInAmount : '');
  const [message, setMessage] = useState('');
  const [disablebtn, setDisablebtn] = useState(false);
  const [maxLimitMessage, setMaxLimitMessage] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [inputWidth, setInputWidth] = useState(inputAmountLength['0']);
  const [isCertify, setCertify] = useState(true);
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const alert = useAlert();
  const prompt = usePrompt();

  const checkStatus = async () => {
    if (!tokwaAccount.mobileNumber) {
      await getMyAccount();
      return;
    }

    if (!tokwaAccount.pinCode) {
      return navigation.replace('ToktokWalletRestricted', {
        component: 'noPin',
        amount: cashInAmount,
        onCashIn: onCashIn,
      });
    }
  };

  useEffect(() => {
    if (onCashIn) {
      dispatch({
        type: 'SET_TOKWA_EVENTS_REDIRECT',
        payload: {
          event: 'cashInTopUp',
          value: true,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (onCashIn) {
      checkStatus();
      cashInTopUp = false;
    }
  }, [onCashIn, tokwaAccount]);

  const confirmAmount = async () => {
    const checkLimit = await AmountLimitHelper.postCheckIncomingLimit({
      amount,
      setErrorMessage: setMessage,
    });
    const isValid = checkValidAmount(amount);

    if (checkLimit && isValid && !(amount > transactionType.cashInLimit) && amount > 1) {
      navigation.navigate('ToktokWalletDPCashInMethods', {
        transactionType,
        amount,
        cashInAmount,
        onCashIn,
      });
    }
  };

  const checkValidAmount = num => {
    if (num == '') {
      setMessage('');
      return false;
    }
    if (num < 1) {
      setMessage(`Please enter atleast ${tokwaAccount.wallet.currency.code} 1.00`);
      return false;
    }
    return true;
  };

  const changeAmountText = value => {
    setMaxLimitMessage('');
    const num = value.replace(/[^0-9.]/g, '');
    const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
    if (!checkFormat) return;
    let decimalValueArray = num.split('.');
    if (decimalValueArray[0].length > 6) return;
    if (num[0] == '.') return setAmount('0.');
    setAmount(num);
    setMessage('');
  };

  const showInput = () => {
    setTimeout(() => {
      if (amount == '') inputRef.current.focus();
    }, 10);
  };

  useEffect(() => {
    showInput();
  }, []);

  // const checkLimit = useDebounce(async amount => {
  //   const checkLimit = await AmountLimitHelper.postCheckIncomingLimit({
  //     amount,
  //     setErrorMessage: setMessage,
  //   });

  //   if (!checkLimit) return;
  //   setDisablebtn(false);
  // }, 1000);

  useEffect(() => {
    setDisablebtn(true);
    setInputWidth(inputAmountLength[amount.length]);
    // if (amount != '') checkLimit(amount);
  }, [amount]);

  return (
    <>
      <PolicyNote
        note1="All transactions are subject to our Cash In Limits that are set to its users based on their approved account
          level as regulated by the Bangko Sentral ng Pilipinas. You may expect a refund for an over-limit transaction
          within 3 to 5 business days. For the corresponding wallet size, please see "
        subTextNote1="User Level and Transaction Limit."
        onPressNote1={() => {
          navigation.navigate('ToktokWalletTransactionLimit');
        }}
      />
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16}}>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR, marginTop: 10}}>Current Balance </Text>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD, marginTop: 10}}>
            {currencyCode}
            {numberFormat(tokwaAccount.wallet.balance)}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16}}>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR, marginTop: 10}}>
            Remaining Limit to Cash In{' '}
          </Text>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD, marginTop: 10}}>
            {currencyCode}
            {numberFormat(remainingCashIn)}
          </Text>
        </View>
        <View style={styles.content}>
          <View style={styles.amountcontent}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.input}>
                <Text style={{fontSize: 40, marginRight: 10}}>{currencyCode}</Text>
                {!isFocus && amount != '' && (
                  <Text style={{fontSize: 40, marginLeft: 10}}>{amount ? numberFormat(amount) : '0.00'}</Text>
                )}
                <TextInput
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => {
                    setIsFocus(false);
                  }}
                  caretHidden={!isFocus}
                  value={amount}
                  ref={inputRef}
                  keyboardType="numeric"
                  returnKeyType="done"
                  placeholder={amount == '' ? '0.00' : ''}
                  placeholderTextColor="#525252"
                  onChangeText={changeAmountText}
                  textAlign="right"
                  textAlignVertical="center"
                  style={{
                    fontSize: 40,
                    marginLeft: 5,
                    width: inputWidth,
                    ...(!isFocus && amount != '' ? {position: 'absolute', color: 'transparent', zIndex: 1} : {}),
                  }}
                />
              </View>
            </View>
            {message != '' && (
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: FONT.REGULAR,
                  color: 'red',
                  marginTop: 10,
                  marginBottom: 10,
                  fontSize: FONT_SIZE.S,
                }}>
                {message}
              </Text>
            )}
            <Text style={{marginTop: 10}}>Cash In Amount</Text>
            <Text style={{fontFamily: FONT.REGULAR, color: 'red', marginTop: 5, fontSize: FONT_SIZE.S}}>
              {maxLimitMessage}
            </Text>
          </View>

          {/* <View style={styles.cashinbutton}>
            {!isCertify || amount < 1 || amount > transactionType.cashInLimit || disablebtn || message != '' ? (
              <DisabledButton label="Cash In" />
            ) : (
              <YellowButton label="Cash In" onPress={confirmAmount} />
            )}
          </View> */}
        </View>
        <OrangeButton onPress={confirmAmount} label="Next" hasShadow />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerReminder: {
    padding: 16,
    backgroundColor: '#FFFCF4',
    flexDirection: 'row',
  },
  paypandaLogo: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  amountcontent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
    // width:width * 0.7,
    // alignSelf:"center"
  },
  cashinbutton: {
    height: 50,
    width: '100%',
  },
  input: {
    borderRadius: 5,
    height: 70,
    flex: 1,
    justifyContent: 'center',
    ...(Platform.OS === 'ios' ? {alignItems: 'center'} : {}),
    flexDirection: 'row',
  },
});
