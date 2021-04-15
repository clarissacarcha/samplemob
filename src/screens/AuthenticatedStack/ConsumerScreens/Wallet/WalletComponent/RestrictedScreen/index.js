import React from 'react'
import {View,StyleSheet,Image} from 'react-native'
import WalletOnHold from './WalletOnHold'
import VerifyWallet from './VerifyWallet'
import SecurewithPIN from './SecurewithPIN'

export default ({navigation,route})=> {
    
    navigation.setOptions({
        headerShown: false
    })

    const DisplayComponent = ()=> {
        switch(route.params.component){
            case "onHold":
                return <WalletOnHold navigation={navigation} walletinfo={route.params.walletinfo}/>
            case "noPin":
                return <SecurewithPIN navigation={navigation} walletinfo={route.params.walletinfo}/>
            case "notVerified":
                return <VerifyWallet navigation={navigation} walletinfo={route.params.walletinfo}/>
            default:
                break
        }
    }

    return (
       <View style={styles.container}>
           {DisplayComponent()}
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"white"
    },

})
