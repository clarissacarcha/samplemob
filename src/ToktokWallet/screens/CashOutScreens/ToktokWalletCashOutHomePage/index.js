import React from 'react'
import {View,StyleSheet,Text} from 'react-native'
import { numberFormat } from 'toktokwallet/helper';
import { 
    HeaderImageBackground,
    HeaderTitle,
    Separator
} from 'toktokwallet/components'
import { useSelector } from 'react-redux';
import CONSTANTS from 'common/res/constants'

//SElF IMPORTS
import CashOutOption from './CashOutOption';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
export const ToktokWalletCashOutHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false
     })

     const tokwaAccount = useSelector(state=>state.toktokWallet)

    return (
        <>
        <View style={styles.container}>
            <View style={styles.headings}>
                <HeaderImageBackground>
                    <HeaderTitle label="Fund Transfer"/>
                    <View style={styles.walletBalance}>
                                <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance ? tokwaAccount.wallet.balance : 0)}</Text>
                                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR,marginBottom: 5}}>Available Balance</Text>
                    </View>
                </HeaderImageBackground>
            </View>
            <Separator/>
            <View style={styles.transferOptions}>
                   <CashOutOption label="Enrolled Accounts" route="ToktokWalletCashOut"/>
                   <CashOutOption label="Other Banks" route="ToktokWalletCashOutOtherBanks"/>
            </View>
      </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    headings: {
        height: 190,
        backgroundColor:"black"
    },  
    walletBalance: {
        flex: 1,
        justifyContent:"center",
        alignItems:'center'
    },
    cashoutoptions: {
        padding: 16,
    },
    transferDetails: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor:"#F4F4F4",
        justifyContent:"center",
        alignItems:"center"
    },
    transferOptions: {
        flex: 1,
        paddingHorizontal: 16,
    },
})
