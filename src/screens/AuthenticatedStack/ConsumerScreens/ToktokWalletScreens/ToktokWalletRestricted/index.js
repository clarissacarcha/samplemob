import React from 'react'
import {View,StyleSheet,Image} from 'react-native'

//SELF IMPORTS
import WalletOnHold from './WalletOnHold'
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
                navigation.pop()
                return navigation.navigate("ToktokWalletVerifySetup")
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
        backgroundColor:"white",
        padding: 10,
    },

})
