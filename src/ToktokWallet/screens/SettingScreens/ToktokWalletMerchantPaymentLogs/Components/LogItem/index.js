import React , {useState} from "react";
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import moment from 'moment'
import { numberFormat ,MaskLeftZero } from 'toktokwallet/helper'
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

// SELF IMPORTS
import Details from "./Details";

export const LogItem = ({
  item,
  tokwaAccount,
  index
})=>{
  const [info,setInfo] = useState({})
  const [openModal,setOpenModal] = useState(false)

  const refNo = item.transaction.refNo
  const refDateTime =  moment(item.transaction.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
  const refDate = moment(item.transaction.createdAt).tz('Asia/Manila').format('MMM D, YYYY');
  const refTime = moment(item.transaction.createdAt).tz('Asia/Manila').format('hh:mm A');
  const transactionAmount = `${tokwaAccount.wallet.currency.code} ${numberFormat(item.transaction.amount)}`

  const showDetails = ()=>{
    setInfo({
      refNo,
      refDate,
      refTime,
      amount: `₱ ${numberFormat(item.transaction.amount)}`,
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
        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Service Reference # {refNo}</Text>
        <Text style={{color: "#9E9E9E",fontSize: FONT_SIZE.S,marginTop: 0,fontFamily: FONT.REGULAR}}>Success</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>₱ {numberFormat(item.transaction.amount)}</Text>
        <Text style={{color: "#9E9E9E",fontSize: FONT_SIZE.S,alignSelf: "flex-end",marginTop: 0,fontFamily: FONT.REGULAR}}>{refDateTime}</Text>
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