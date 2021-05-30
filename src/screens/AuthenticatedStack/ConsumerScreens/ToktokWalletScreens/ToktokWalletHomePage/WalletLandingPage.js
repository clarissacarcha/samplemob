import React , {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,RefreshControl} from 'react-native'
import { COLOR } from '../../../../../res/variables'
import {useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../graphql'
import { GET_WALLET , GET_MY_ACCOUNT } from '../../../../../graphql/toktokwallet'
import { useAlert } from '../../../../../hooks'
import { onErrorAlert } from '../../../../../util/ErrorUtility'
import { connect } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

//SELF IMPORTS
import WalletCardInfo from './WalletCardInfo'
import WalletRecentOutgoingTransfer from './WalletRecentOutgoingTransfer'
import WalletRecentTransactions from './WalletRecentTransactions'
import WalletVerificationStatus from './WalletVerificationStatus'

const WalletLandingPage = ({refreshing, onRefresh})=> {
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
                    <WalletCardInfo/>
                </ScrollView>
            </View>
            <View style={{flex: 1,}}>
                <WalletRecentOutgoingTransfer/>
                <WalletRecentTransactions/>
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