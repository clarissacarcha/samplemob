import React from 'react'
import {View,StyleSheet,Image} from 'react-native'

//SELF IMPORTS
import {
    ApprovedRegistration,
    BlockedAccount,
    DeletedAccount,
    NoAccount,
    PendingKyc,
    RejectedKyc,
    SecurewithPIN,
    SecureWithMPIN,
    WalletOnHold
} from "./Components"

export const ToktokWalletRestricted = ({navigation,route})=> {
    
    navigation.setOptions({
        headerShown: false
    })

    const data = route.params.data ? route.params.data : null

    const DisplayComponent = ()=> {
        switch(route.params.component){
            case "onHold":
                return <WalletOnHold navigation={navigation} walletinfo={route.params.walletinfo}/>
            case "approvedRegistration":
                return <ApprovedRegistration/>
            case "noPin":
                return <SecurewithPIN navigation={navigation} walletinfo={route.params.walletinfo}/>
            case "noMpin":
                return <SecureWithMPIN navigation={navigation} walletinfo={route.params.walletinfo}/>
            case "noAccount":
                return <NoAccount />
            case "pendingKYC": 
                return <PendingKyc />
            case "rejectedKYC":
                return <RejectedKyc />
            case "blockedAccount":
                return <BlockedAccount data={data}/>
            case "deletedAccount":
                return <DeletedAccount/>
            default:
                break
        }
    }

    return (
        <>
       <View style={styles.container}>
           {DisplayComponent()}
       </View>
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        // padding: 16,
    },

})
