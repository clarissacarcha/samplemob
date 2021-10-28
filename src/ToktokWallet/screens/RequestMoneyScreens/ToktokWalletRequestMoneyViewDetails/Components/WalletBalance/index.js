import React from 'react'
import { View , Text , StyleSheet , Image, TouchableOpacity } from 'react-native'
import tokwaLogo from 'toktokwallet/assets/images/tokwaLogo.png'
import { Separator } from 'toktokwallet/components'
import { numberFormat , moderateScale } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN , SHADOW } = CONSTANTS

export const WalletBalance = ({tokwaAccount,navigation})=> {

    return (
       <>
         <View style={styles.container}>
            <Text style={[styles.label]}>Payment via</Text>
            <View style={styles.tokwaBalance}>
                <Image
                    source={tokwaLogo}
                    style={{height: moderateScale(40),width: moderateScale(40),borderRadius: 5}}
                />
                <View style={{justifyContent:"center",alignItems:"center",flex: 1}}>
                    <Text style={{fontFamily: FONT.BOLD, fontSize: moderateScale(FONT_SIZE.M),color: COLOR.YELLOW}}>toktok
                        <Text style={{color:COLOR.ORANGE}}>wallet</Text>
                    </Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: moderateScale(FONT_SIZE.XS)}}>Balance {tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance)}</Text>
                </View>
            </View>
        </View>
        <View style={styles.cashIn}>
            <TouchableOpacity 
                onPress={()=>{
                    navigation.navigate("ToktokWalletPaymentOptions", {
                        onCashIn: null,
                        amount: 0
                    })
                }} 
                hitSlop={{top: 20,bottom: 20,right: 20,left: 20}}
            >
                <Text style={{color: COLOR.YELLOW,fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>
                    Click here to Cash In
                </Text>
            </TouchableOpacity>
        </View>
       <Separator/>
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
        paddingVertical: 16,
        marginBottom: 10,
    },
    label: {
        flex: 1,
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M,
        color: COLOR.YELLOW,
        alignContent:"center",
        alignSelf:"center"
    },
    value: {
        flex: 1,
        justifyContent:"flex-end",
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M,
        textAlign:"right"
    },
    tokwaBalance: {
        ...SHADOW,
        backgroundColor: "white",
        flex: 1,
        flexDirection:"row",
        padding: 10,
        borderRadius: 5,
    },
    cashIn: {
        alignItems:"flex-end",
        marginTop: 0,
        marginBottom: 20
    }
})