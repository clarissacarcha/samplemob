import React from 'react'
import {StyleSheet,Text,View,TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'
import {useThrottle} from 'src/hooks'

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS

export const ContactInformation= ({ item, index, checkAccount, setSelectedContact, selectedContact })=> {
  
  const isSelected = selectedContact?.index === index;
 
  const chooseRecipient = ()=> {
    if(isSelected){
      setSelectedContact({});
    } else {
      setSelectedContact({ item, index });
    }
  }

  const onThrottledPress = useThrottle(chooseRecipient, 500)
 
  return (
    <>
      <TouchableOpacity
        style={[styles.contactInfo, { backgroundColor: isSelected ? "#F89D4C" : "white" }]}
        onPress={onThrottledPress}
      >
        <Text style={[styles.contactInfoName, { color: isSelected ? "white" : "black" } ]}>
          {item.name}
        </Text>
        {/* <Text style={[styles.contactInfoNumber, { color: isSelected ? "white" : "black" }]}>
          {item.number.replace('+63', '0')}
        </Text> */}
      </TouchableOpacity>
      <View style={styles.divider}/>
    </>
  )
}

const styles = StyleSheet.create({
  contactInfo: {
    padding: 16
  },
  contactInfoName: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.L,
  },
  contactInfoNumber: {
    color: "#A6A8A9",
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    paddingTop: 5
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#F6841F",
  }
})
