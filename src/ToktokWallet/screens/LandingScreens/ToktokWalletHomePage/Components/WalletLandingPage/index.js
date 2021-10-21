import React , {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,RefreshControl,Dimensions} from 'react-native'
import { connect } from 'react-redux'
import {APP_FLAVOR , ACCOUNT_TYPE} from 'src/res/constants'

//SELF IMPORTS
import DriverWalletCardInfo from '../DriverWalletCardInfo'
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
                    {/* <Advertisements/> */}
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
