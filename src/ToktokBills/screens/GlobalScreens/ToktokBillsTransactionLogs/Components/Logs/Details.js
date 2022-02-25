import React , {useState} from "react";
import { View, Text, StyleSheet ,Dimensions} from 'react-native';
import { TransactionModal } from 'toktokwallet/components';

import CONSTANTS from 'common/res/constants'
import moment from "moment";
const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const { width } = Dimensions.get("window")

const Details = ({ transaction, visible, setVisible })=> {

  const {
    statusName,
    billerDetails,
    transactionAmount,
    id,
    referenceNumber,
    refDate
  } = transaction

  const dateOfPayment = moment(refDate).format('ll');
  const timeOfPayment = moment(refDate).format('h:mm a');

  return (
    <TransactionModal
      visible={visible}
      setVisible={setVisible}
    >
      <View>
        <Text style={{ fontSize: FONT_SIZE.M }}>Status of Payment: {statusName}</Text>
        <Text style={{ fontSize: FONT_SIZE.M }}>Name of Biller: {billerDetails?.name}</Text>
        <Text style={{ fontSize: FONT_SIZE.M }}>Amount Paid: ₱ {transactionAmount}</Text>
        <Text style={{ fontSize: FONT_SIZE.M }}>Transaction No.: {id}</Text>
        <Text style={{ fontSize: FONT_SIZE.M }}>Service Reference No.: {referenceNumber}</Text>
        <Text style={{ fontSize: FONT_SIZE.M }}>Date of Payment: {dateOfPayment}</Text>
        <Text style={{ fontSize: FONT_SIZE.M }}>Time of Payment: {timeOfPayment}</Text>
      </View>
    </TransactionModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor:"rgba(0,0,0, 0.1)",
    justifyContent:"center",
    alignItems:"center"
  },
  labelText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  }
})

export default Details
