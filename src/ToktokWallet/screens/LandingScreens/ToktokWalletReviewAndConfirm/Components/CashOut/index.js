import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import { numberFormat } from 'toktokwallet/helper'
import {useSelector} from 'react-redux'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

export const CashOut = ({data})=>{

    const tokwaAccount = useSelector(state=> state.toktokWallet)

    return(
       <View style={styles.container}>
            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Bank</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,textAlign:"right"}}>{data.method}</Text>
                    </View>
            </View>
            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Account Name</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,textAlign:"right"}}>{data.accountName}</Text>
                    </View>
            </View>
            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Account Number</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,textAlign:"right"}}>{data.accountNumber}</Text>
                    </View>
            </View>
            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Amount</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,textAlign:"right"}}>{tokwaAccount.wallet.currency.code} {numberFormat(data.amount)}</Text>
                    </View>
            </View>
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
