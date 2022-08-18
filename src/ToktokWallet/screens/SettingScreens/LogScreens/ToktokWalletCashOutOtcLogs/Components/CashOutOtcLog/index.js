import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import { numberFormat, moderateScale, getHeaderDateTitle } from 'toktokwallet/helper';
import { Separator } from "toktokwallet/components";
import {useThrottle} from 'src/hooks';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

// SELF IMPORTS
import Details from './Details';

const RenderLowerText = (lowerText)=> {
  return (
      <>
      <Separator/>
      <Text style={styles.dayTitle}>{lowerText}</Text>
      </>
  )
}

export const CashOutOtcLog = ({item, tokwaAccount, index, data }) => {
  const [info, setInfo] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const { upperText , lowerText } = getHeaderDateTitle({
    refDate: item?.createdAt,
    data,
    index
})

  let status;
  switch (item.status) {
    case 0:
      status = 'Pending';
      break;
    case 1:
      status = 'Success';
      break;
    case 2:
      status = 'Failed';
      break;
    default:
      status = 'Pending';
      break;
  }
  const transaction = item.cashOut.transaction;
  const requestNo = item.cashOut.referenceNumber;
  //   const refNo = item.cashOut.referenceNumber;
  const refNo = item.cashOut.referenceNumber;
  const date = moment(item.createdAt).tz('Asia/Manila').format('MMM D, YYYY');
  const time = moment(item.createdAt).tz('Asia/Manila').format('hh:mm A');
  const refDate = transaction
    ? moment(transaction.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A')
    : moment(item.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
  const transactionAmount = `${tokwaAccount.wallet.currency.code} ${numberFormat(item.cashOut.amount)}`;
  const provider = item.cashOutProviderPartner.description;
  const phrase = `Cash Out through ${item.cashOutProviderPartner ? item.cashOutProviderPartner.description : provider}`;
  const showDetails = () => {
    setInfo({
      refNo,
      refDate,
      date,
      time,
      name: 'Cash Out',
      phrase,
      amount: transactionAmount,
      status,
      details: item.details,
      requestNo,
    });
    setOpenModal(true);
  };

  const onthrottledPress = useThrottle(showDetails, 2000);

  return (
    <>
      <Details transaction={info} visible={openModal} setVisible={setOpenModal} />
      {!!upperText && <Text style={styles.dayTitle}>{upperText}</Text>}
      <TouchableOpacity style={styles.transaction} onPress={onthrottledPress}>
        <View style={styles.transactionDetails}>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>Reference #{requestNo}</Text>
          <Text style={{color: '#909294', fontSize: FONT_SIZE.M, marginTop: 0, fontFamily: FONT.REGULAR}}>
            {status}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={{color: COLOR.ORANGE, fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>
            {transactionAmount}
          </Text>
          <Text
            style={{
              color: '#909294',
              fontSize: FONT_SIZE.S,
              alignSelf: 'flex-end',
              marginTop: 0,
              fontFamily: FONT.REGULAR,
            }}>
            {refDate}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{paddingHorizontal: 16}}>
          <View style={styles.divider}/>
      </View>
      {!!lowerText && RenderLowerText(lowerText)}
    </>
  );
};

const styles = StyleSheet.create({
  transaction: {
      paddingVertical: 10,
      borderBottomWidth: .2,
      borderColor:"silver",
      flexDirection: "row",
      paddingHorizontal: 16,
  },
  transactionIcon: {
      flexBasis: 50,
      justifyContent: "center",
      alignItems: "flex-start",
      paddingLeft: 5,
  },
  transactionDetails: {
      flex: 1,
  },
  transactionAmount: {
      flexBasis: "auto",
      alignItems: "flex-end"
  },
  divider: {
      height: 1,
      width: '100%',
      backgroundColor: COLOR.LIGHT,
  },
  dayTitle: {
      fontFamily: FONT.BOLD,
      marginTop: moderateScale(20),
      paddingHorizontal: 16,
  },
})