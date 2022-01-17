import React from 'react'
import {StyleSheet,View,Text} from 'react-native';
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT  } = CONSTANTS

export const HeaderReminders = ()=> {

    return (
        <>
          <View style={styles.headingUpload}>
                <Text style={styles.headingUploadText}>Upload the following documents for upgrading your account to 
                    <Text style={{...styles.headingUploadText, color:"#2899FB"}}> Enterprise</Text>
                </Text>
            </View>
            <View style={styles.headingAccepted}>
                <Text style={styles.headingAcceptedText}>Accepted file types are JPG, JPEG and PDF. File size should be Max of 2mb  </Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    headingUpload: {
        padding: 16,
        backgroundColor: COLOR.LIGHT
    },
    headingUploadText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M
    },  
    headingAccepted: {
        padding: 16,
        backgroundColor: COLOR.TRANSPARENT_YELLOW
    },
    headingAcceptedText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        color: COLOR.DARK
    }
})