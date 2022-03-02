import React , {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,RefreshControl,Dimensions} from 'react-native'
import { connect } from 'react-redux'

//SELF IMPORTS
import { Advertisements } from '../Advertisements'
import WalletCardInfo from '../WalletCardInfo'
import WalletRecentTransactions from '../WalletRecentTransactions'


const {height,width} = Dimensions.get("window")

const mapDispatchtoProps = (dispatch) => ({
    saveTokwaAccount: (payload)=> dispatch({
        type: "SET_TOKTOKWALLET_ACCOUNT",
        payload: payload
    })
})

export const WalletLandingPage = connect(null,mapDispatchtoProps)(({refreshing, onRefresh})=> {
    return (
        <View style={styles.container}>
            <ScrollView 
                    alwaysBounceVertical={false}
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
                    <WalletCardInfo/>
                </View>
                <View>
                    <WalletRecentTransactions/>
                     <Advertisements/> 
                </View>
         
            </ScrollView>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    }
})
