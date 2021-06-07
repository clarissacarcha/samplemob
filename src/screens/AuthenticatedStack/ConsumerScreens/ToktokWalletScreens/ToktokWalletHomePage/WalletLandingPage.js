import React , {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,RefreshControl,Dimensions} from 'react-native'
import { connect } from 'react-redux'


//SELF IMPORTS
import WalletCardInfo from './WalletCardInfo'
import WalletRecentOutgoingTransfer from './WalletRecentOutgoingTransfer'
import WalletRecentTransactions from './WalletRecentTransactions'

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
                <View style={{height:255}}>
                    <WalletCardInfo/>
                </View>
                <View>
                    <WalletRecentOutgoingTransfer/>
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