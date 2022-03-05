import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native'
import { numberFormat } from 'toktokwallet/helper';
import { 
    HeaderImageBackground,
    HeaderTitle,
    Separator,
    CheckIdleState,
    TransferableHeaderReminder
} from 'toktokwallet/components'
import { useSelector } from 'react-redux';
import { VectorIcon , ICON_SET } from 'src/revamp';
import CONSTANTS from 'common/res/constants'

//SElF IMPORTS
import CashOutOption from './CashOutOption';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
export const ToktokWalletCashOutHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false
    })

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const screenLabel = route.params ? route.params.screenLabel : null

    return (
        <CheckIdleState>
        <View style={styles.container}>
            <View style={styles.headings}>
                <HeaderImageBackground>
                    <HeaderTitle label={screenLabel ?? "Fund Transfer"} />
                    <View style={styles.walletBalance}>
                        <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance ? tokwaAccount.wallet.balance + tokwaAccount.wallet.creditCardBalance : 0)}</Text>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR,marginBottom: 5}}>Available Balance</Text>
                    </View>
                </HeaderImageBackground>
            </View>
            <TransferableHeaderReminder/>
            <Separator/>
            <View style={styles.transferOptions}>
                { tokwaAccount.constants.isFundTransferEnrolledAccountEnabled == "1" && <CashOutOption label="Enrolled Accounts" route="ToktokWalletCashOut" screenLabel={screenLabel} /> }
                <CashOutOption label="Bank Transfer" route="ToktokWalletCashOutOtherBanks" screenLabel={screenLabel} />
            </View>
      </View>
        </CheckIdleState>
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
    headerReminder: {
        padding: 16,
        backgroundColor:"#FFF2D5"
    },
})
