import React , { useState } from "react";
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import moment from 'moment';
import { numberFormat, MaskLeftZero } from 'toktokwallet/helper';
import { useThrottle } from 'src/hooks';

import CONSTANTS from 'common/res/constants';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS;

// SELF IMPORTS
import Details from "./Details";
import { Separator } from 'toktokwallet/components';

export const Logs = ({ item, index })=> {
 
  const {
    id,
    referenceNumber,
    senderName,
    senderMobileNumber,
    destinationNumber,
    destinationIdentifier,
    billerDetails,
    loadDetails,
    senderWalletBalance,
    amount,
    senderWalletEndingBalance,
    convenienceFee,
    discount,
    type,
    status,
    tokUserId,
    referralCommissionItemId,
    merchantCommissionRate,
    toktokServiceCommission,
    startUp,
    mcjr,
    mcsuper,
    jc,
    mc,
    mcmeg,
    others,
    providerOnTopValue,
    systemOnTopValue,
    providerDiscountRate,
    createdAt
  } = item;
  const [info,setInfo] = useState({})
  const [openModal,setOpenModal] = useState(false)
  const refDate = item ? moment(createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a') : moment(createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')
  const transactionAmount = numberFormat(parseFloat(amount) + parseFloat(convenienceFee));

  let statusName
  switch (status) {
    case 0:
      statusName = "Requested"
      break;
    case 1:
      statusName = "Success"
      break
    case 2:
      statusName = "Pending"
      break
    default:
      statusName = "Failed"
      break;
  }

  const showDetails = ()=>{
    setInfo({
      id,
      statusName,
      loadDetails,
      transactionAmount,
      refDate,
      referenceNumber
    })
    setOpenModal(true);
  }

  const onthrottledPress = useThrottle(showDetails,2000)

  return(
    <>
    <Details
      transaction={info}
      visible={openModal}
      setVisible={setOpenModal}
    />
    <TouchableOpacity
      style={styles.transaction}
      onPress={onthrottledPress}
    >
      <View style={styles.transactionDetails}>
        <Text style={styles.refNo}>Service Reference #{referenceNumber}</Text>
        <Text style={styles.status}>{statusName}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={styles.amount}>₱ {transactionAmount}</Text>
        <Text style={styles.refDate}>{refDate}</Text>
      </View>
    </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  transaction: {
    borderBottomWidth: .2,
    borderColor:"silver",
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 30
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
  refNo: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR
  },
  status: {
    color: "#909294",
    fontSize: FONT_SIZE.M,
    marginTop: 0,
    fontFamily: FONT.REGULAR
  },
  amount: {
    color: "#F6841F",
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR
  },
  refDate: {
    color: "#909294",
    fontSize: FONT_SIZE.S,
    alignSelf: "flex-end",
    marginTop: 0,
    fontFamily: FONT.REGULAR
  }
})