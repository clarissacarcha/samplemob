import React from 'react'
import {StyleSheet,View,Text} from 'react-native'
import {Separator} from 'toktokwallet/components'
import { HeaderBack, HeaderTitle , VectorIcon , ICON_SET , YellowButton} from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT  } = CONSTANTS

export const ToktokWalletEnterpriseApplication = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Upgrade Account','']}/>,
    })
    return (
        <>
        <Separator/>
        <View style={styles.container}>
            <View style={styles.headingUpload}>
                <Text style={styles.headingUploadText}>Upload the following documents for upgrading your account to 
                    <Text style={{...styles.headingUploadText, color:COLOR.ORANGE}}> Enterprise</Text>
                </Text>
            </View>
            <View style={styles.headingAccepted}>
                <Text style={styles.headingAcceptedText}>Accepted file types are JPG, JPEG and PDF. File size should be Max of 2mb  </Text>
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
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