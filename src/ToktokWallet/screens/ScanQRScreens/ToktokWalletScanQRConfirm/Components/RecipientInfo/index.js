import React from 'react'
import {View,Text,StyleSheet,Dimensions,Image} from 'react-native'
import CONSTANTS from 'common/res/constants'
const { COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE } = CONSTANTS

const {width,height} = Dimensions.get("window")

export const RecipientInfo = ({recipientInfo})=> {

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.recipient}>
                        {/* <View style={{flexBasis: 40}}>
                            <Image resizeMode="contain" source={require('../../../../../../assets/toktokwallet-assets/user_png.png')} style={styles.recipientImage}/>
                        </View> */}
                        <View style={{flex: 1,justifyContent:"flex-start",justifyContent:'center'}}>
                            <Text style={styles.recipientName}>{recipientInfo.person.firstName} {recipientInfo.person.lastName[0]}.</Text>
                            <Text style={styles.recipientContact}>{recipientInfo.mobileNumber}</Text>
                        </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 55,
        width: width,
        paddingHorizontal: 16,
        position:"absolute",  
        bottom: -32,
    },
    content: {
        height:"100%",
        width:"100%",
        alignSelf:"center",
        backgroundColor:"white",
        borderRadius: 5,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:'center',
        padding: 10, 
    },
    recipient: {
        flexDirection:"row"
    },
    recipientImage: {
        height: 35,
        width: 35,
    },
    recipientName: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M,
        marginTop: -5,
    },
    recipientContact: {
        color:"#929191",
        fontSize: FONT_SIZE.S,
        fontFamily: FONT.REGULAR,
        marginTop: -2
    }

})
