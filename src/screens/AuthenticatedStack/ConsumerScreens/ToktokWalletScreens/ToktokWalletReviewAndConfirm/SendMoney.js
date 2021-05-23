import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import { numberFormat } from '../../../../../helper'
import { COLORS, FONTS, SIZES } from '../../../../../res/constants'
import {useSelector} from 'react-redux'


const SendMoney = ({data})=>{

    const tokwaAccount = useSelector(state=> state.toktokWallet)

    return(
       <View style={styles.container}>
            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M,color: COLORS.DARK}}>Payment Method</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>toktokwallet</Text>
                    </View>
            </View>
            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M,color: COLORS.DARK}}>Recipient Name</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>{data.recipient.name}</Text>
                    </View>
            </View>
            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M,color: COLORS.DARK}}>Recipient Mobile No.</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>{data.recipient.mobileNo}</Text>
                    </View>
            </View>
            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M,color: COLORS.DARK}}>Amount</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>{tokwaAccount.wallet.currency.code} {numberFormat(data.amount)}</Text>
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

export default SendMoney