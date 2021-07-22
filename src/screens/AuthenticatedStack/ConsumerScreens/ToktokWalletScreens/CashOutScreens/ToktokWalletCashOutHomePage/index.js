import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image,Dimensions, ImageBackground,ActivityIndicator,FlatList} from 'react-native'
import { COLOR , FONT , FONT_SIZE  } from '../../../../../../res/variables';
import { numberFormat } from '../../../../../../helper';
import { 
    HeaderImageBackground,
    HeaderTitle,
    Separator
} from '../../Components'
import { useSelector } from 'react-redux';

//SElF IMPORTS
import CashOutOption from './CashOutOption';

const ToktokWalletCashOutHomePage = ({navigation,route})=> {

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

export default ToktokWalletCashOutHomePage