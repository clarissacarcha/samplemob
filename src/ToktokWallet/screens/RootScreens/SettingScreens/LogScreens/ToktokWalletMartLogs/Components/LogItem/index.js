import React , {useState} from "react";
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import moment from 'moment'
import { numberFormat ,MaskLeftZero, getHeaderDateTitle, currencyCode, moderateScale } from 'toktokwallet/helper'
import { useThrottle } from 'src/hooks'
import { Separator } from "toktokwallet/components";
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

  // const refNo = MaskLeftZero(item.id)
  const requestNo = item.refNo
  const refNo = item.refNo
  const refDate = moment(item.createdAt).tz('Asia/Manila').format('MMM DD, YYYY');
  const refTime = moment(item.createdAt).tz('Asia/Manila').format('hh:mm A');
  const transactionAmount = `${currencyCode}${numberFormat(item.amount)}`

  const showDetails = ()=>{
    setInfo({
      refNo,
      refDate,
      refTime,
      amount: transactionAmount,
      details: item.details,
      requestNo,
      externalReferenceNo: item.externalReferenceNumber
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
        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Reference # {requestNo}</Text>
        <Text style={{color: "#9E9E9E",fontSize: FONT_SIZE.S,marginTop: 0,fontFamily: FONT.REGULAR}}>Success</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={{color: COLOR.ORANGE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{transactionAmount}</Text>
        <Text style={{color: "#9E9E9E",fontSize: FONT_SIZE.S,alignSelf: "flex-end",marginTop: 0,fontFamily: FONT.REGULAR}}>{refDate}</Text>
      </View>
    </TouchableOpacity>
    <View style={{paddingHorizontal: 16}}>
        <View style={styles.divider}/>
      </View>
      {!!lowerText && RenderLowerText(lowerText)}
    </>
  )
}


const styles = StyleSheet.create({
  transaction: {
    borderBottomWidth: .2,
    borderColor:"silver",
    flexDirection: "row",
    padding: 15
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