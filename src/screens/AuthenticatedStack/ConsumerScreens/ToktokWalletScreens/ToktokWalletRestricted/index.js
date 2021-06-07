import React from 'react'
import {View,StyleSheet,Image} from 'react-native'

//SELF IMPORTS
import WalletOnHold from './WalletOnHold'
import ApprovedRegistration from './ApprovedRegistration'
import SecurewithPIN from './SecurewithPIN'
import NoAccount from './NoAccount'
import PendingKyc from './PendingKyc'
import RejectedKyc from './RejectedKyc'
import BlockedAccount from './BlockedAccount'
import DeletedAccount from './DeletedAccount'
import { HeadingBannerLogo }from '../Components'

const ToktokWalletRestricted = ({navigation,route})=> {
    
    navigation.setOptions({
        headerShown: false
    })

    const DisplayComponent = ()=> {
        switch(route.params.component){
            case "onHold":
                return <WalletOnHold navigation={navigation} walletinfo={route.params.walletinfo}/>
            case "approvedRegistration":
                return <ApprovedRegistration/>
            case "noPin":
                return <SecurewithPIN navigation={navigation} walletinfo={route.params.walletinfo}/>
            case "noAccount":
                return <NoAccount />
            case "pendingKYC": 
                return <PendingKyc />
            case "rejectedKYC":
                return <RejectedKyc />
            case "blockedAccount":
                return <BlockedAccount />
            case "deletedAccount":
                return <DeletedAccount/>
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