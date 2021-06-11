import React , {useState} from 'react'
import {View,Text,StyleSheet,TextInput} from 'react-native'
import { numberFormat } from '../../../../../../helper'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'

const EnterAmount = ({amount , setAmount , setSwipeEnabled  , tokwaAccount})=> {

    const [errorMessage,setErrorMessage] = useState("")

    const changeAmount = (value)=>{
        const num = value.replace(/[^0-9.]/g, '')
        const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
        if(!checkFormat) return  
        let decimalValueArray = num.split(".")
        if(decimalValueArray[0].length > 6) return
        // if(num.length > 6) return
        if(num[0] == ".") return setAmount("0.")
        // setTempAmount(num)
        setAmount(num)

        if(num >= 1 && num <= tokwaAccount.wallet.balance){
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

        if(num > tokwaAccount.wallet.balance){
            setSwipeEnabled(false)
            return setErrorMessage("You do not have enough balance")
        }

    }

    return (
        <View style={styles.container}>
             <View style={{flexDirection:'row',alignItems:"center"}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Enter Amount</Text>
            </View>
            <View style={[styles.amount, {borderWidth: 1, borderColor: errorMessage == "" ? "transparent" : COLOR.RED}]}>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,alignSelf:"center"}}>{tokwaAccount.wallet.currency.code} </Text>
                        <TextInput
                                caretHidden
                                value={amount}
                                onChangeText={changeAmount}
                                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1,fontSize: FONT_SIZE.M}}
                                keyboardType="numeric"
                                returnKeyType="done"
                        />
                        <View style={{marginLeft: 5,alignSelf: "center",flex: 1}}>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                        </View>
                </View>
                <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.RED}}>{errorMessage}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal:16,
        marginTop: 55
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

export default EnterAmount