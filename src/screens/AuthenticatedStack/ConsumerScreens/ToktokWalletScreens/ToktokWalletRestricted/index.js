import React from 'react'
import {View,StyleSheet,Image} from 'react-native'

//SELF IMPORTS
import WalletOnHold from './WalletOnHold'
import SecurewithPIN from './SecurewithPIN'
import NoAccount from './NoAccount'
import { HeadingBannerLogo }from '../Components'

const ToktokWalletRestricted = ({navigation,route})=> {
    
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
                // navigation.pop()
                // return navigation.navigate("ToktokWalletVerifySetup", {walletinfo: route.params.walletinfo})
                return <NoAccount />
            default:
                break
        }
    }

    return (
        <>
        {/* <HeadingBannerLogo/> */}
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

export default ToktokWalletRestricted