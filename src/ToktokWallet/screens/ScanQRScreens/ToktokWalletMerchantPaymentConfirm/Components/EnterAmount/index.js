import React , {useState} from 'react'
import {View,Text,StyleSheet,TextInput} from 'react-native'
import { numberFormat , AmountLimitHelper } from 'toktokwallet/helper'
import { InputAmount } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
const { COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE } = CONSTANTS

export const EnterAmount = ({amount , setAmount , setSwipeEnabled  , tokwaAccount,errorMessage,setErrorMessage,serviceFee})=> {

    const changeAmount = (value)=>{
        const num = value.replace(/[^0-9.]/g, '')
        const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
        if(!checkFormat) return  
        let decimalValueArray = num.split(".")
        if(decimalValueArray[0].length > 6) return
        if(num[0] == ".") return setAmount("0.")
        setAmount(num)

        if(+num >= 1 && (+num + +serviceFee ) <= tokwaAccount.wallet.balance){
            setSwipeEnabled(true)
            setErrorMessage("")
        }else if(num < 1 && num != ""){
            setSwipeEnabled(false)
            setErrorMessage(`Please Enter atleast ${tokwaAccount.wallet.currency.code} 1.00`)
        }else if(num == ""){
            setSwipeEnabled(false)
            setErrorMessage("")
        }else{
            setErrorMessage("")
        }

        // checkSenderWalletLimitation(num * 0.01)
        // checkRecipientWalletLimitation(num * 0.01)

        if((+num + +serviceFee) > tokwaAccount.wallet.balance){
            setSwipeEnabled(false)
            return setErrorMessage("Insufficient wallet balance.")
        }

    }

    return (
        <View style={styles.container}>
             <View style={{flexDirection:'row',alignItems:"center"}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Enter Amount</Text>
            </View>
            <InputAmount
                errorMessage={errorMessage}
                amount={amount}
                changeAmount={changeAmount}
                currency={tokwaAccount.wallet.currency.code}
            />
            <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.RED}}>{errorMessage}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal:16,
        marginTop: 20
    },
    amount: {
        height: SIZE.FORM_HEIGHT,
        paddingHorizontal: 5,
        width: "100%",
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
        fontSize: FONT_SIZE.M
    }
})
