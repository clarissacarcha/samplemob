import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {numberFormat, MaskLeftZero, moderateScale, sameDay, dayTitle} from 'toktokwallet/helper';

import {useThrottle} from 'src/hooks';
import moment from 'moment';
import CONSTANTS from 'common/res/constants';
import {useAccount} from 'toktokwallet/hooks';

//SELF IMPORTS
import {TransactionDetails} from './TransactionDetails';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const TransactionLog = ({transaction, itemsLength, index, data}) => {
  const {id, refNo, name, phrase, displayInfo, amount, sourceWalletId, createdAt, note, transactionType} =
    transaction.node;

  const {tokwaAccount} = useAccount();
  const [openModal, setOpenModal] = useState(false);
  const [transactionInfo, setTransactionInfo] = useState({});
  const amountcolor = sourceWalletId == tokwaAccount?.wallet.id ? COLOR.RED : 'green';
  const amountprefix = sourceWalletId == tokwaAccount?.wallet.id ? '-' : '+';
  const transactionAmount = `${amountprefix} ${tokwaAccount?.wallet.currency.code} ${numberFormat(amount)}`;
  const referenceDate = moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
  let nextItem = [];
  let isSameDay = false;
  let lowerText = '';
  let upperText = '';

  if (data) {
    nextItem = data[index + 1] ? data[index + 1] : false;
    if (index === 0) {
      upperText = dayTitle(referenceDate);
    }
    if (nextItem) {
      let dateNext = moment(nextItem?.node.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
      isSameDay = sameDay(referenceDate.toString(), dateNext.toString());
      lowerText = !isSameDay ? dayTitle(dateNext) : '';
    }
  }

  const showDetails = () => {
    setTransactionInfo({
      name,
      phrase,
      displayInfo,
      amount: `${tokwaAccount?.wallet.currency.code} ${numberFormat(amount)}`,
      refNo,
      refDate: referenceDate,
      note,
      transactionType,
    });
    setOpenModal(true);
  };

  const OnThrottledPress = useThrottle(showDetails, 2000);

  return (
    <>
      <TransactionDetails visible={openModal} setVisible={setOpenModal} transaction={transactionInfo} />
      {!!upperText && <Text style={styles.dayTitle}>{upperText}</Text>}
      <TouchableOpacity style={styles.transaction} onPress={OnThrottledPress}>
        <View style={styles.transactionDetails}>
          <Text numberOfLines={1} style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>
            {name}
          </Text>
          <Text numberOfLines={1} style={{color: '#929191', fontSize: FONT_SIZE.S, fontFamily: FONT.REGULAR}}>
            {phrase}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text numberOfLines={1} style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR, color: amountcolor}}>
            {transactionAmount}
          </Text>
          <Text
            numberOfLines={1}
            style={{color: '#929191', fontSize: FONT_SIZE.S, fontFamily: FONT.REGULAR, alignSelf: 'flex-end'}}>
            {referenceDate}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.divider} />
      {!!lowerText && <Text style={styles.dayTitle}>{lowerText}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  transactionLogsContainer: {
    marginVertical: 10,
  },
  transaction: {
    paddingVertical: 12,
    // marginVertical: 5,
    flexDirection: 'row',
  },
  transactionIcon: {
    flexBasis: 50,
    alignSelf: 'center',
  },
  transactionDetails: {
    flex: 1,
    paddingRight: 10,
  },
  transactionAmount: {
    flexBasis: 'auto',
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLOR.LIGHT,
  },
  dayTitle: {
    fontFamily: FONT.BOLD,
    marginTop: moderateScale(20),
  },
});
