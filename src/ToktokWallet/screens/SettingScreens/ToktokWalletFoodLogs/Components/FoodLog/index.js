import React , {useState} from "react";
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import moment from 'moment'
import { numberFormat ,MaskLeftZero } from 'toktokwallet/helper'
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

// SELF IMPORTS
import Details from "./Details";

export const FoodLog = ({
  item,
  tokwaAccount,
  index
})=>{
  const [info,setInfo] = useState({})
  const [openModal,setOpenModal] = useState(false)

  let status = "";
  switch (item.status) {
    case 0:
      status = "Pending"
      break;
    case 1:
      status = "Processed"
      break
    case 2:
      status = "Pending"
      break
    case 3:
      status = "Rejected"
      break
    default:
      status = "Rejected"
      break;
  }

  // const refNo = MaskLeftZero(item.id)
  const requestNo = item.refNo
  const refNo = item.refNo
  const refDate = moment(item.createdAt).tz('Asia/Manila').format('MMM DD, YYYY');
  const refTime = moment(item.createdAt).tz('Asia/Manila').format('h:mm A');
  const transactionAmount = `${tokwaAccount.wallet.currency.code} ${numberFormat(item.amount)}`

  const showDetails = ()=>{
    setInfo({
      refNo,
      refDate,
      refTime,
      amount: transactionAmount,
      status,
      details: item.details,
      requestNo
    })
    setOpenModal(true);
  }

  const onthrottledPress = useThrottle(showDetails,2000)
  
  return (
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
        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Reference # {requestNo}</Text>
        <Text style={{color: "#9E9E9E",fontSize: FONT_SIZE.S,marginTop: 0,fontFamily: FONT.REGULAR}}>{status}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{transactionAmount}</Text>
        <Text style={{color: "#9E9E9E",fontSize: FONT_SIZE.S,alignSelf: "flex-end",marginTop: 0,fontFamily: FONT.REGULAR}}>{refDate}</Text>
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
    padding: 20
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
  }
})