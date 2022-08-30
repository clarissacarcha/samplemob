import React , {useState} from "react";
import { View, Text, StyleSheet ,Dimensions} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import { TransactionModal } from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const { width } = Dimensions.get("window")


const renderDetails = ({details})=> {
  
  if(details){
    const data = Object.entries(details)
    const RenderInfo = data.map((data,index)=> {
      if(!data[0] && !data[1]) return null
      const key = data[0]
      const value = data[1]
      return (
        <Text key={`externalDetails_${index}`} style={[styles.labelText , {color: COLOR.DARK}]}>{key}: {value}</Text>
      )
    })
    return RenderInfo
  }

  return null
}

const Details = ({
    transaction,
    visible,
    setVisible
})=> {

  const {
    name,
    phrase,
    details,
    amount,
    refNo,
    refDate,
    refTime,
    requestNo,
    externalReferenceNo
  } = transaction

  return (
    <TransactionModal visible={visible} setVisible={setVisible}>
      <Text style={{fontFamily: FONT.BOLD,fontSize: moderateScale(18)}}>Delivery</Text>
      <View style={{marginTop: 15}}>
        <Text style={styles.labelText}><Text style={{fontFamily:FONT.BOLD}}>Status:</Text> Success</Text>
        <Text style={styles.labelText}><Text style={{fontFamily:FONT.BOLD}}>Amount Paid:</Text> {amount}</Text>
        <Text style={styles.labelText}><Text style={{fontFamily:FONT.BOLD}}>Service Reference Number:</Text> {externalReferenceNo}</Text>
        <Text style={styles.labelText}><Text style={{fontFamily:FONT.BOLD}}>Toktokwallet Reference Number:</Text> {refNo}</Text>
        <Text style={styles.labelText}><Text style={{fontFamily:FONT.BOLD}}>Transaction Date:</Text> {refDate} {refTime}</Text>
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
    marginBottom: 2
  }
})

export default Details
