import React , {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,RefreshControl} from 'react-native'
import { COLOR } from '../../../../../res/variables'
import {useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../graphql'
import { GET_WALLET , GET_MY_ACCOUNT } from '../../../../../graphql/toktokwallet'
import { useAlert } from '../../../../../hooks'
import { onErrorAlert } from '../../../../../util/ErrorUtility'
import { connect } from 'react-redux'

//SELF IMPORTS
import WalletCardInfo from './WalletCardInfo'
import WalletRecentOutgoingTransfer from './WalletRecentOutgoingTransfer'
import WalletRecentTransactions from './WalletRecentTransactions'
import WalletVerificationStatus from './WalletVerificationStatus'

const WalletLandingPage = ({refreshing, onRefresh , saveTokwaAccount})=> {

    const alert = useAlert()
    const [account,setAccount] = useState({
        wallet: {
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
        }
    })

    const [getMyAccount , {data,error,loading}] = useLazyQuery(GET_MY_ACCOUNT , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        onCompleted: ({getMyAccount})=> {
            setAccount(getMyAccount)
            saveTokwaAccount(getMyAccount)
        },
        onError: (error)=> {
            onErrorAlert({alert,error})
        }
    })

    useEffect(()=>{
       getMyAccount()
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
                    <WalletCardInfo account={account} loading={loading}/>
                </ScrollView>
            </View>
            <View style={{flex: 1,}}>
                <WalletRecentOutgoingTransfer account={account} walletinfo={account.wallet}/>
                <WalletRecentTransactions account={account}/>
            </View>

        </View>
    )
}

const mapDispatchtoProps = (dispatch) => ({
    saveTokwaAccount: (payload)=> dispatch({
        type: "SET_TOKTOKWALLET_ACCOUNT",
        payload: payload
    })
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default connect(null,mapDispatchtoProps)(WalletLandingPage)