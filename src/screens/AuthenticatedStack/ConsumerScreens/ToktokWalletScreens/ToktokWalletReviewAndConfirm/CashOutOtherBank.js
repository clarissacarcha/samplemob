import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import { numberFormat } from '../../../../../helper'
import { COLORS, FONTS, SIZES } from '../../../../../res/constants'
import {useSelector} from 'react-redux'


const TransactionInfo = ({label,value})=> {
    return (
        <View style={styles.information}>
                <View style={{flex:1,alignItems:"flex-start"}}>
                    <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M,color: COLORS.DARK}}>{label}</Text>  
                </View>
                <View style={{flex:1,alignItems:"flex-end"}}>
                    <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK,textAlign:"right"}}>{value}</Text>
                </View>
        </View>
    )
}

const CashOutOtherBank = ({data})=>{

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

export default CashOutOtherBank