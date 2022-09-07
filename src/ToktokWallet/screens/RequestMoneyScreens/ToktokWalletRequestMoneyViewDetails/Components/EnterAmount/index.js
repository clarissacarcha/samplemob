import React , {useState , useEffect} from 'react'
import { View ,Text ,StyleSheet} from 'react-native'
import { InputAmount } from 'toktokwallet/components'
import { numberFormat , formatAmount } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants'

const { FONT_SIZE , COLOR , SIZE , FONT_FAMILY: FONT} = CONSTANTS


export const EnterAmount = ({setEnabled, amount,setAmount,tokwaAccount}) => {
    const [errorAmountMessage,setErrorAmountMessage] = useState("")

    const changeAmount = (value)=>{
        formatAmount(value , setAmount)
    }

    useEffect(()=>{
        if(amount >= 1 && amount <= tokwaAccount.wallet.balance){
            setEnabled(true)
            setErrorAmountMessage("")
        }else if(amount < 1 && amount != ""){
            setEnabled(false)
            setErrorAmountMessage(`Please enter atleast ${tokwaAccount.wallet.currency.code} 1.00.`)
        }else{
            setEnabled(false)
            setErrorAmountMessage(amount == "" ? "" : "You do not have enough balance.")
        }
    },[amount])

    return (
        <View style={{marginTop: 20}}>
                <View style={{flexDirection:'row',alignItems:"center"}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Enter amount to be sent</Text>
                </View>
                <InputAmount
                    errorMessage={errorAmountMessage}
                    amount={amount}
                    changeAmount={changeAmount}
                    currency={tokwaAccount.wallet.currency.code}
                />
                <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#F93154"}}>{errorAmountMessage}</Text>
        </View>
    )
}