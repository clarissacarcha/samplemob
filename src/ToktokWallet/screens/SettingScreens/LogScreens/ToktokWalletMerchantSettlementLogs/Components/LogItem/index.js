import React , {useState} from "react";
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import moment from 'moment'
import { numberFormat , moderateScale } from 'toktokwallet/helper'
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

// SELF IMPORTS
import Details from "./Details";

export const LogItem = ({
  item,
})=>{
  const [info,setInfo] = useState({})
  const [openModal,setOpenModal] = useState(false)
  const displayInfo = item.node.displayInfo;

  const refNo = item.node.refNo
  const refDateTime =  moment(item.node.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
  const dayOfPayment = moment(item.node.createdAt).tz('Asia/Manila').format('MMM D, YYYY');
  const timeOfPayment = moment(item.node.createdAt).tz('Asia/Manila').format('hh:mm A');

  const showDetails = ()=>{
    setInfo({
      refNo,
      dayOfPayment,
      timeOfPayment,
      amount: displayInfo.Amount,
      name: item.node.name,
      phrase: item.node.phrase,
    })
    setOpenModal(true);
  }

  const onthrottledPress = useThrottle(showDetails,2000)
  
  return (
    <>
    <Details
      settlement={info}
      visible={openModal}
      setVisible={setOpenModal}
    />
    <TouchableOpacity
      style={styles.settlement}
      onPress={onthrottledPress}
    >
      <View style={styles.settlementDetails}>
        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Reference # {refNo}</Text>
        <Text style={{color: "#9E9E9E",fontSize: FONT_SIZE.S,marginTop: 5,fontFamily: FONT.REGULAR}}>{displayInfo.Status}</Text>
      </View>
      <View style={styles.settlementAmount}>
        <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{displayInfo.Amount}</Text>
        <Text style={{color: "#9E9E9E",fontSize: FONT_SIZE.S,alignSelf: "flex-end",marginTop: 5,fontFamily: FONT.REGULAR}}>{refDateTime}</Text>
      </View>
    </TouchableOpacity>
    </>
  )
}


const styles = StyleSheet.create({
  settlement: {
    borderBottomWidth: .2,
    borderColor:"silver",
    flexDirection: "row",
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateScale(20),
  },
  settlementDetails: {
    flex: 1,
  },
  settlementAmount: {
    flexBasis: "auto",
    alignItems: "flex-end"
  }
})