import React, {useEffect, useState} from 'react'
import {View,Text,StyleSheet,TextInput} from 'react-native'
import { numberFormat } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants'

const { FONT_SIZE , COLOR , SIZE , FONT_FAMILY: FONT} = CONSTANTS

export const EnterAmount = ({tokwaAccount , setSwipeEnabled , amount  ,setAmount , recipientDetails}) => {

    const [errorAmountMessage,setErrorAmountMessage] = useState("")
    const [tempAmount,setTempAmount] = useState("")


    const changeAmount = (value)=>{
        const num = value.replace(/[^0-9.]/g, '')
        const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
        if(!checkFormat) return       
        let decimalValueArray = num.split(".")
        if(decimalValueArray[0].length > 6) return
        if(num[0] == ".") return setAmount("0.")
        setAmount(num)
    }

    useEffect(()=>{
   
            if(amount >= 1 && amount <= tokwaAccount.wallet.balance){
                setSwipeEnabled(true)
                setErrorAmountMessage("")
            }else if(amount < 1 && amount != ""){
                setSwipeEnabled(false)
                setErrorAmountMessage(`Please enter atleast ${tokwaAccount.wallet.currency.code} 1.00.`)
            }else{
                setSwipeEnabled(false)
                setErrorAmountMessage(amount == "" ? "" : "You do not have enough balance.")
            }


        return ()=> {
            setErrorAmountMessage("")
        }
    },[amount,recipientDetails])

    return (
        <>
        <View style={{marginTop: 20}}>
            <View style={{flexDirection:'row',alignItems:"center"}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Enter Amount</Text>
            </View>
            <View style={[styles.input, {borderWidth: 1, borderColor: errorAmountMessage == "" ? "transparent" : COLOR.RED}]}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,alignSelf:"center"}}>{tokwaAccount.wallet.currency.code} </Text>
                    <TextInput
                            caretHidden
                            value={amount}
                            onChangeText={changeAmount}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                            keyboardType="numeric"
                            returnKeyType="done"
                    />
                    <View style={{marginLeft: 5,alignSelf: "center",flex: 1}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                    </View>
            </View>
            <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#F93154"}}>{errorAmountMessage}</Text>
    </View>
        </>
    )
}

const styles = StyleSheet.create({
     input: {
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
