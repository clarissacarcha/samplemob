import React , {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,RefreshControl} from 'react-native'
import { COLOR } from '../../../../../res/variables'
import {useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../graphql'
import { GET_WALLET } from '../../../../../graphql/toktokwallet'
import { useAlert } from '../../../../../hooks'
import { onErrorAlert } from '../../../../../util/ErrorUtility'

//SELF IMPORTS
import WalletCardInfo from './WalletCardInfo'
import WalletRecentOutgoingTransfer from './WalletRecentOutgoingTransfer'
import WalletRecentTransactions from './WalletRecentTransactions'
import WalletVerificationStatus from './WalletVerificationStatus'

const WalletLandingPage = ({refreshing, onRefresh })=> {

    const alert = useAlert()
    const [wallet,setWallet] = useState({
        id: 0,
        balance: 0,
        status: 0,
        accountId: 0,
        motherId: 0,
        currencyId: 0,
        currency: {
            id: 0,
            name: "",
            code: "",
            phpValue: 0
        }
    })

    const [getWallet , {data,error,loading}] = useLazyQuery(GET_WALLET , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        onCompleted: ({getWallet})=> {
            setWallet(getWallet)
        },
        onError: (error)=> {
            onErrorAlert({alert,error})
        }
    })

    useEffect(()=>{
       getWallet()
    },[onRefresh])

    return (
        <View style={styles.container}>
            <View style={{height:255}}>
                <ScrollView 
                    style={{flex: 1,backgroundColor:COLOR.YELLOW}}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <WalletCardInfo walletinfo={wallet}/>
                </ScrollView>
            </View>
            <View style={{flex: 1,}}>
                {/* <WalletVerificationStatus walletinfo={data.getToktokWallet.record}/>
                <WalletRecentOutgoingTransfer walletinfo={data.getToktokWallet.record}/>
                <WalletRecentTransactions session={session}/> */}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default WalletLandingPage