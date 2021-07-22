import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import { numberFormat } from 'toktokwallet/helper'
import {useSelector} from 'react-redux'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const TransactionInfo = ({label,value})=> {
    return (
        <View style={styles.information}>
                <View style={{flex:1,alignItems:"flex-start"}}>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{label}</Text>  
                </View>
                <View style={{flex:1,alignItems:"flex-end"}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,textAlign:"right"}}>{value}</Text>
                </View>
        </View>
    )
}

export const CashOutOtherBank = ({data})=>{

    const tokwaAccount = useSelector(state=> state.toktokWallet)

    return(
       <View style={styles.container}>
                <TransactionInfo label="Bank" value={data.method}/>
                <TransactionInfo label="Account Name" value={data.accountName}/>
                <TransactionInfo label="Account Number" value={data.accountNumber}/>
                <TransactionInfo label="Amount" value={`${tokwaAccount.wallet.currency.code} ${numberFormat(data.amount)}`}/>
                {data.note != "" && <TransactionInfo label="Note" value={data.note}/>}
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    information: {
        paddingVertical: 15,
        borderBottomColor:"#F4F4F4",
        borderBottomWidth: 1,
        flexDirection:"row"
    }
})
