import React , {useState} from 'react'
import {View,Text,StyleSheet,TextInput} from 'react-native'
import { numberFormat , formatAmount } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants'

const { FONT_SIZE , COLOR , SIZE , FONT_FAMILY: FONT} = CONSTANTS

export const InputAmount = ({
    errorMessage="",
    amount,
    changeAmount,
    currency,
    onBlur,
    disabled = false,
})=> {

    const [isFocus,setIsFocus] = useState(false)

    return (
        <View style={[styles.input, {borderWidth: 1, borderColor: errorMessage == "" ? "transparent" : COLOR.RED}]}>
                    { currency && <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,alignSelf:"center"}}>{currency} </Text>}
                    <TextInput
                            onFocus={()=>setIsFocus(true)}
                            onBlur={()=>{
                                setIsFocus(false)
                                if(onBlur) onBlur()
                            }}
                            value={amount}
                            caretHidden={!isFocus}
                            onChangeText={changeAmount}
                            style={{height: '100%', width: '100%', ...(!isFocus && amount != "" ? {position: 'absolute', color: 'transparent',zIndex: 1} : {})}}
                            keyboardType="numeric"
                            returnKeyType="done"
                            placeholder="0.00"
                    />
                    
                    {
                        !isFocus && amount != "" &&
                        <View style={{marginLeft: 5,alignSelf: "center",flex: 1}}>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                        </View>
                    }
            </View>
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