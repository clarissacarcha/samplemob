import React from 'react'
import {StyleSheet,Text,View,TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'
import {useThrottle} from 'src/hooks'

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS

export const ContactInfoRender = ({item,index,checkAccount})=> {
    
  const chooseRecipient = ()=> {
    return checkAccount(item.number)
  }

  const onThrottledPress = useThrottle(chooseRecipient, 2000)

  return (
    <>
    <TouchableOpacity
      key={`contactInfo-${index}`}
      style={styles.contactInfo}
      onPress={onThrottledPress}
    >
      <Text style={styles.contactInfoName}>{item.name}</Text>
      <Text style={styles.contactInfoNumber}>{item.number.replace('+63', '0')}</Text>
    </TouchableOpacity>
    <View style={styles.divider}/>
    </>
  )
}

const styles = StyleSheet.create({
  contactInfo: {
    paddingVertical: 10,
  },
  contactInfoName: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  contactInfoNumber: {
    color: "#A6A8A9",
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: COLOR.LIGHT,
  }
})
