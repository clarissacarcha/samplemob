import React from 'react'
import {StyleSheet,Text,View,TouchableOpacity} from 'react-native'
import { FONTS, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../../res/constants'

const ContactInfoRender = ({item,index,checkAccount})=> {
    
    const chooseRecipient = ()=> {
        return checkAccount(item.number)
    }

    return (
      <TouchableOpacity
        key={`contactInfo-${index}`}
        style={styles.contactInfo}
        onPress={chooseRecipient}
      >
        <Text style={styles.contactInfoName}>{item.name}</Text>
        <Text style={styles.contactInfoNumber}>{item.number}</Text>
        
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    contactInfo: {
        paddingVertical: 10,
        borderBottomColor: "silver",
        borderBottomWidth: 0.2
      },
      contactInfoName: {
        fontFamily: FONTS.FONT_REGULAR,
        fontSize: SIZES.M,
      },
      contactInfoNumber: {
        color: "#A6A8A9",
        fontFamily: FONTS.FONT_REGULAR,
        fontSize: SIZES.S,
      },
})

export default ContactInfoRender