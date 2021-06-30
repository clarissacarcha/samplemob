import React from 'react'
import {StyleSheet,Text,View,TouchableOpacity} from 'react-native'
import { COLOR , FONT, FONT_SIZE } from '../../../../../../res/variables'

const ContactInfoRender = ({item,index,checkAccount})=> {
    
    const chooseRecipient = ()=> {
        return checkAccount(item.number)
    }

    return (
      <>
      <TouchableOpacity
        key={`contactInfo-${index}`}
        style={styles.contactInfo}
        onPress={chooseRecipient}
      >
        <Text style={styles.contactInfoName}>{item.name}</Text>
        <Text style={styles.contactInfoNumber}>{item.number}</Text>
        
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

export default ContactInfoRender