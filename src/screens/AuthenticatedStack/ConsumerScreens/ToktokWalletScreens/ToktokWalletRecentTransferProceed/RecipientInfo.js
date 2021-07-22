import React, { useState } from 'react'
import {View,Text,StyleSheet,Dimensions,Image} from 'react-native'
import { COLORS, FONTS, INPUT_HEIGHT, SIZES } from '../../../../../res/constants'

const {width,height} = Dimensions.get("window")

const RecipientInfo = ({recentTransfer})=> {

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.recipient}>
                        {/* <View style={{flexBasis: 40}}>
                            <Image resizeMode="contain" source={require('../../../../../assets/toktokwallet-assets/user_png.png')} style={styles.recipientImage}/>
                        </View> */}
                        <View style={{flex: 1,justifyContent:"flex-start",justifyContent:'center'}}>
                            <Text style={styles.recipientName}>{recentTransfer.destinationPerson.firstName} {recentTransfer.destinationPerson.lastName[0]}.</Text>
                            <Text style={styles.recipientContact}>{recentTransfer.destinationWallet.account.mobileNumber.replace("+63","0")}</Text>
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
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 10,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:'center',
        flexDirection: "row",
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
        fontFamily: FONTS.BOLD,
        fontSize: SIZES.M,
        marginTop: -5,
        color: COLORS.DARK
    },
    recipientContact: {
        color:"#929191",
        fontSize: SIZES.S,
        fontFamily: FONTS.REGULAR,
        marginTop: -2
    }

})

export default RecipientInfo