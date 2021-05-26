import React, {useEffect, useState} from 'react'
import {View,Text,StyleSheet,TextInput} from 'react-native'
import { numberFormat } from '../../../../../../helper'
import { FONT_MEDIUM, FONT_REGULAR , FONT_LIGHT, INPUT_HEIGHT, SIZES, FONTS, FONT_BOLD, COLORS } from '../../../../../../res/constants'

const EnterAmount = ({walletinfo , setSwipeEnabled , amount  ,setAmount , recipientDetails}) => {

    const [errorAmountMessage,setErrorAmountMessage] = useState("")
    const [tempAmount,setTempAmount] = useState("")


    const changeAmount = (value)=>{
        const num = value.replace(/[^0-9]/g, '')
        if(num.length > 8) return
        setTempAmount(num)
        setAmount(num * 0.01)
    }

    useEffect(()=>{
   
            if(amount >= 1 && amount <= walletinfo.balance){
                setSwipeEnabled(true)
                setErrorAmountMessage("")
                // checkSenderWalletLimitation()
                // checkRecipientWalletLimitation()
                
            }else if(amount < 1 && amount != ""){
                setSwipeEnabled(false)
                setErrorAmountMessage(`Please Enter atleast PHP 1.00`)
            }else{
                setSwipeEnabled(false)
                setErrorAmountMessage(amount == "" ? "" : "Insufficient Fund")
            }


        return ()=> {
            setErrorAmountMessage("")
        }
    },[amount,recipientDetails])

    return (
        <>
        <View style={{marginTop: 20}}>
            <View style={{flexDirection:'row',alignItems:"center"}}>
                <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>Enter Amount</Text>
                <Text style={{fontFamily:FONTS.REGULAR,fontSize: SIZES.M,color:"red",marginLeft: 10}}>{errorAmountMessage}</Text>
            </View>
            <View style={styles.input}>
                    <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,alignSelf:"center",color: COLORS.DARK}}>PHP </Text>
                    <TextInput
                            caretHidden
                            value={tempAmount}
                            onChangeText={changeAmount}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                            keyboardType="numeric"
                            returnKeyType="done"
                    />
                    <View style={{marginLeft: 5,alignSelf: "center",flex: 1}}>
                        <Text style={{fontFamily: FONT_REGULAR,fontSize: SIZES.M}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                    </View>
            </View>
    </View>
        </>
    )
}

const styles = StyleSheet.create({
     input: {
        height: INPUT_HEIGHT,
        paddingHorizontal: 5,
        width: "100%",
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
        fontSize: SIZES.M
    }
})

export default EnterAmount