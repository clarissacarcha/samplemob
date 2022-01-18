import React , {useEffect} from "react";
import { View , Text , StyleSheet } from 'react-native';
import {Receipt} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_WALLET } from 'toktokwallet/graphql'
import { useLazyQuery } from '@apollo/react-hooks'
import { useAlert  , useThrottle } from 'src/hooks'
import { onErrorAlert} from 'src/util/ErrorUtility'
import { useAccount } from 'toktokwallet/hooks'
import { numberFormat } from 'toktokwallet/helper'


const {COLOR , FONT_FAMILY: FONT, FONT_SIZE , SIZE } = CONSTANTS


const TransactionInfo = ({label,value})=> (
    <>
    <View style={styles.transactionInfoView}>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-start"}}>
            <Text style={{fontFamily: FONT.REGULAR,color:"dimgray",fontSize: FONT_SIZE.M}}>{label}</Text>
        </View>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M}}>{value}</Text>
        </View>
    </View>
    <View style={styles.divider}/>
    </>
)



export const ToktokWalletReceipt = ({
    navigation,
    route
})=> {

    navigation.setOptions({
        headerShown:false,
    })

    const { informations , onCashIn , referenceNumber } = route.params
    const {tokwaAccount,refreshWallet} = useAccount();
    const alert = useAlert();
    const [getWallet] = useLazyQuery(GET_WALLET, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        onError: (error) => onErrorAlert({alert,error}),
        onCompleted: ({getWallet})=> {
            refreshWallet();
            onCashIn({
                balance: getWallet.balance
            })
            return navigation.pop(4)
        }
    })
    const onThrottledPress = useThrottle(onPress , 2000)
    const onPress = () => {
        if(onCashIn){
            getWallet() 
        }else{
            navigation.navigate("ToktokWalletHomePage")
            navigation.replace("ToktokWalletHomePage")
        }
    }

    return (
        <View style={styles.container}>
            <Receipt
                refNo={referenceNumber}
                onPress={onThrottledPress}
            >
                {
                    informations.map((info)=>(
                        <TransactionInfo label={info.label} value={info.value}/>
                    ))
                }
            </Receipt>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "white",
        justifyContent: "center"
    },
    content: {
        flex: 1,
    },
    transactionInfo: {
        marginTop: 40,
    },
    transactionInfoView: {
        width:"100%",
        flexDirection:"row",
        paddingVertical: 12
    },
    divider: {
        height: 1,
        width:"100%",
        backgroundColor: COLOR.LIGHT
    }
})