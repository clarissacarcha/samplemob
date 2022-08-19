import React , {useState} from "react";
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import moment from 'moment'
import { numberFormat, moderateScale, getHeaderDateTitle , currencyCode} from 'toktokwallet/helper'
import { Separator } from "toktokwallet/components";
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

// SELF IMPORTS
import Details from "./Details";

const RenderLowerText = (lowerText)=> {
  return (
      <>
      <Separator/>
      <Text style={styles.dayTitle}>{lowerText}</Text>
      </>
  )
}

export const LogItem = ({
  item,
  tokwaAccount,
  index,
  data
})=>{
  const [info,setInfo] = useState({})
  const [openModal,setOpenModal] = useState(false)
  const { upperText , lowerText } = getHeaderDateTitle({
    refDate: item?.createdAt,
    data,
    index
})

  const refNo = item.transaction.refNo
  const refDateTime =  moment(item.transaction.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
  const refDate = moment(item.transaction.createdAt).tz('Asia/Manila').format('MMM D, YYYY');
  const refTime = moment(item.transaction.createdAt).tz('Asia/Manila').format('hh:mm A');
  const transactionAmount = `${currencyCode}${numberFormat(item.transaction.amount)}`

  const showDetails = ()=>{
    setInfo({
      refNo,
      refDate,
      refTime,
      refDateTime,
      amount: `₱${numberFormat(item.amount)}`,
      name: item.transaction.name,
      phrase: item.transaction.phrase,
      tokwaAccount,
      serviceFeeAmount: `₱${numberFormat(item.serviceFeeAmount)}`,
      totalAmount: `₱${numberFormat(+item.serviceFeeAmount + +item.amount)}`
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
    {!!upperText && <Text style={styles.dayTitle}>{upperText}</Text>}
    <TouchableOpacity
      style={styles.transaction}
      onPress={onthrottledPress}
    >
      <View style={styles.transactionDetails}>
        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Service Reference # {refNo}</Text>
        <Text style={{color: "#9E9E9E",fontSize: FONT_SIZE.S,marginTop: 0,fontFamily: FONT.REGULAR}}>Success</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{transactionAmount}</Text>
        <Text style={{color: "#9E9E9E",fontSize: FONT_SIZE.S,alignSelf: "flex-end",marginTop: 0,fontFamily: FONT.REGULAR}}>{refDateTime}</Text>
      </View>
    </TouchableOpacity>
    {!!lowerText && RenderLowerText(lowerText)}
    </>
  )
}


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