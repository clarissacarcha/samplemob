import React , {useState} from 'react'
import {View,Text,StyleSheet,TextInput} from 'react-native'
import { numberFormat } from '../../../../../../helper'
import { COLORS, FONTS, INPUT_HEIGHT, SIZES } from '../../../../../../res/constants'

const EnterAmount = ({amount , setAmount , setSwipeEnabled  , tokwaAccount})=> {

    const [tempAmount,setTempAmount] = useState("")
    const [errorMessage,setErrorMessage] = useState("")

    const changeAmount = (value)=>{
        const num = value.replace(/[^0-9]/g, '')
        if(num.length > 8) return
        setTempAmount(num)
        setAmount(num * 0.01)

        if((num * 0.01) >= 1 && (num * 0.01) <= tokwaAccount.wallet.balance){
            setSwipeEnabled(true)
            setErrorMessage("")
        }else if((num * 0.01) < 1 && num != ""){
            setSwipeEnabled(false)
            setErrorMessage(`Please Enter atleast ${'\u20B1'} 1.00`)
        }else{
            setErrorMessage("")
        }

        // checkSenderWalletLimitation(num * 0.01)
        // checkRecipientWalletLimitation(num * 0.01)

        if((num * 0.01) > tokwaAccount.wallet.balance){
            setSwipeEnabled(false)
            return setErrorMessage("You do not have enough balance")
        }

    }

    return (
        <View style={styles.container}>
             <View style={{flexDirection:'row',alignItems:"center"}}>
                <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>Enter Amount</Text>
                <Text style={{fontFamily:FONTS.REGULAR,fontSize: SIZES.M,color:"red",marginLeft: 10}}>{errorMessage}</Text>
            </View>
            <View style={styles.amount}>
                        <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,alignSelf:"center",color: COLORS.DARK}}>{tokwaAccount.wallet.currency.code} </Text>
                        <TextInput
                                caretHidden
                                value={tempAmount}
                                onChangeText={changeAmount}
                                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1,fontSize: SIZES.M}}
                                keyboardType="numeric"
                                returnKeyType="done"
                        />
                        <View style={{marginLeft: 5,alignSelf: "center",flex: 1}}>
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                        </View>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal:16,
        marginTop: 55
    },
    amount: {
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