import React, { useContext, useEffect } from 'react';
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import { COLORS, FONTS, FONT_SIZE } from 'res/constants';
import { COLOR } from 'res/variables';
import { moderateScale, scale, verticalScale } from 'toktokfood/helper/scale';
import { availableTips } from 'toktokfood/helper/strings';
import { VerifyContext } from '../components';
export const WalletActions = () => {
  const {
    activeTab,
    setActiveTab,
    otherAmount,
    setOtherAmount,
    toktokwalletBalance,
    setToktokwalletBalance,
    errorAmountMessage,
    setErrorAmountMessage,
  } = useContext(VerifyContext);

  const tokwaBalance = parseFloat(toktokwalletBalance);

  const changeOtherAmount = (value) => {
    const num = value.replace(/[^0-9.]/g, '');
    const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);

    if (!checkFormat) return;
    let decimalValueArray = num.split('.');
    if (decimalValueArray[0].length > 6) return;
    if (num[0] == '.') return setOtherAmount('0.');
    if (num.charAt(0) == '0' && num.charAt(1) == '0') return setOtherAmount(num.replace('0', ''));
    if (num.charAt(0) == '0' && num.charAt(1) > 0) return setOtherAmount(num.replace('0', ''));
    setOtherAmount(num);
  };

  useEffect(() => {
    const checkFormat = /^\d+(\.\d{1,2})?$/.test(otherAmount);

    if (otherAmount != '' && !checkFormat) {
      setActiveTab(0);
      setErrorAmountMessage('Please enter valid amount.');
    } else if (otherAmount >= 1 && otherAmount <= tokwaBalance) {
      setActiveTab(0);
      setErrorAmountMessage('');
    } else if (otherAmount == '' && activeTab == 0) {
      setActiveTab(availableTips[0]);
    } else if (otherAmount > 0 && otherAmount < 1) {
      setActiveTab(0);
      setErrorAmountMessage('Please enter at least 1.00');
    } else if (otherAmount > tokwaBalance) {
      setErrorAmountMessage('You do not have enough balance.');
    } else {
      otherAmount == '0' ? setActiveTab(0) : '';
    }

    return () => {
      setErrorAmountMessage('');
    };
  }, [otherAmount]);

  const onPressAmount = (item) => {
    setActiveTab(item);
    setOtherAmount('');
  };

  const renderItem = ({item}) => {
    let {id, amount} = item;
    let isDisabled = tokwaBalance < amount;
    let btnStyle = isDisabled ? {borderColor: '#DDDDDD'} : {};
    let textStyle = isDisabled ? {color: '#DDDDDD'} : {};

    return (
      <>
        <TouchableOpacity
          disabled={isDisabled}
          onPress={() => {
            onPressAmount(item);
          }}
          style={[styles.tipButton, btnStyle]}>
          {activeTab.id === id && !isDisabled && (
            <View style={styles.checkContainer}>
              <FA5Icon name="check" size={10} color={'#fff'} />
            </View>
          )}
          <Text style={[styles.tipButtonText, textStyle]}>{`PHP ${amount.toFixed(2)}`}</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.tokWalletWrapper}>
      <View style={styles.walletBalanceWrapper}>
        <Text style={styles.walletBalanceText}>toktokwallet balance: </Text>
        <Text style={styles.walletBalanceText}>{`PHP ${tokwaBalance.toFixed(2)}`}</Text>
      </View>
      <Text style={styles.tipTitle}>Give a tip to make your rider happy!</Text>
      <View style={styles.tipButtonWrapper}>
        <FlatList
          row
          data={availableTips}
          scrollEnabled={false}
          renderItem={renderItem}
          numColumns={availableTips.length / 2}
          showsHorizontalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.inputTipWrapper}>
        <View style={[styles.deliverWrapper, {paddingVertical: 10}]}>
          <Text style={styles.walletBalanceText}>Enter other amount</Text>
        </View>
        <TextInput
          value={otherAmount}
          onChangeText={changeOtherAmount}
          multiline={true}
          numberOfLines={1}
          style={[styles.input, {borderColor: errorAmountMessage == '' ? '#E5EAEA' : COLOR.RED}]}
          keyboardType="decimal-pad"
          placeholder="Enter amount here..."
          placeholderTextColor={'#A7A7A7'}
        />
        {!!errorAmountMessage && (
          <Text style={{fontFamily: FONTS.REGULAR, fontSize: FONT_SIZE.S, color: '#F93154'}}>{errorAmountMessage}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tokWalletWrapper: {
    paddingVertical: 14,
  },
  walletBalanceWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 22,
    paddingHorizontal: 16,
  },
  walletBalanceText: {
    fontSize: 15,
    fontFamily: FONTS.MEDIUM,
  },
  tipTitle: {
    fontSize: 13,
    fontFamily: FONTS.MEDIUM,
    paddingHorizontal: 16,
  },
  tipButtonWrapper: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipButton: {
    height: 50,
    width: 100,
    borderWidth: 1,
    borderRadius: 10,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.YELLOW,
  },
  tipButtonText: {
    fontSize: 15,
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM,
  },
  inputTipWrapper: {
    paddingHorizontal: 16,
  },
  deliverWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },
  input: {
    height: moderateScale(55),
    borderWidth: 1,
    borderRadius: 10,
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
    paddingTop: Platform.OS == 'ios' ? verticalScale(17) : verticalScale(10),
    alignItems: 'center',
    paddingHorizontal: scale(15),
  },
  checkContainer: {
    padding: 5,
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 1,
    backgroundColor: '#FFA700',
    borderRadius: 10,
  },
});
