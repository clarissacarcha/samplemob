import React , {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,RefreshControl,Dimensions} from 'react-native'
import { connect } from 'react-redux'
import {APP_FLAVOR , ACCOUNT_TYPE} from '../../../../../res/constants'

//SELF IMPORTS
import WalletCardInfo from './WalletCardInfo'
import WalletRecentOutgoingTransfer from './WalletRecentOutgoingTransfer'
import WalletRecentTransactions from './WalletRecentTransactions'
import DriverWalletCardInfo from './DriverWalletCardInfo'


const {height,width} = Dimensions.get("window")

const WalletLandingPage = ({refreshing, onRefresh})=> {
    return (
        <View style={styles.container}>
            <ScrollView 
                    stickyHeaderIndices={[0]}
                    nestedScrollEnabled
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                <View style={{height:280}}>
                   {
                       APP_FLAVOR == "D" && ACCOUNT_TYPE == 2
                       ? <DriverWalletCardInfo/>
                       : <WalletCardInfo/>
                   }
                </View>
                <View>
                    <WalletRecentTransactions/>
                </View>
         
            </ScrollView>
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
        backgroundColor:"white"
    }
})

export default connect(null,mapDispatchtoProps)(WalletLandingPage)