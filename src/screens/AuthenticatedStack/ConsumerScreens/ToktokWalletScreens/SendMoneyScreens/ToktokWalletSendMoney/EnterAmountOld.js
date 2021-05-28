import React, {useEffect, useState} from 'react'
import {View,Text,StyleSheet,TextInput} from 'react-native'
import { numberFormat } from '../../../../../../helper'
import {FONT,FONT_SIZE,COLOR,SIZE} from '../../../../../../res/variables'

const EnterAmount = ({tokwaAccount , setSwipeEnabled , amount  ,setAmount , recipientDetails}) => {

    const [errorAmountMessage,setErrorAmountMessage] = useState("")
    const [tempAmount,setTempAmount] = useState("")



    const changeAmount = (value)=>{
        const num = value.replace(/[^0-9]/g, '')
        if(num.length > 8) return
        setTempAmount(num)
        setAmount(num * 0.01)
    }

    useEffect(()=>{
   
            if(amount >= 1 && amount <= tokwaAccount.wallet.balance){
                setSwipeEnabled(true)
                setErrorAmountMessage("")
                // checkSenderWalletLimitation()
                // checkRecipientWalletLimitation()
                
            }else if(amount < 1 && amount != ""){
                setSwipeEnabled(false)
                setErrorAmountMessage(`Please Enter atleast ${tokwaAccount.wallet.currency.code} 1.00`)
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
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Enter Amount</Text>
                <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.M,color:"red",marginLeft: 10}}>{errorAmountMessage}</Text>
            </View>
            <View style={styles.input}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,alignSelf:"center"}}>{tokwaAccount.wallet.currency.code} </Text>
                    <TextInput
                            caretHidden
                            value={tempAmount}
                            onChangeText={changeAmount}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                            keyboardType="numeric"
                            returnKeyType="done"
                    />
                    <View style={{marginLeft: 5,alignSelf: "center",flex: 1}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                    </View>
            </View>
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

export default EnterAmount