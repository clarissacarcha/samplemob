import React , {createContext,useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import { Alert } from 'react-native'

export const CheckWalletRestrictionContext = createContext({
    checkIfResctricted: null
})
const {Provider} = CheckWalletRestrictionContext

const CheckWalletRestrictionProvider = ({children, kycStatus})=>{

    const navigation = useNavigation()

    const checkIfResctricted = ()=> {

      

         // If KYC record does not exist, proceed to KYC Registration or Linking
        if(!kycStatus && kycStatus == null){
           navigation.replace("ToktokWalletRestricted" , {component: "noAccount"})
           return true
        }

        // If have pending KYC record and status is Pending
        if(kycStatus == 2){
            navigation.replace("ToktokWalletRestricted" , {component: "pendingKYC"})
            return true
        }

         // If KYC status is Rejected
         if(kycStatus == 0){
            navigation.replace("ToktokWalletRestricted" , {component: "rejectedKYC"})
            return true
        }

        // // checking if wallet is not verified
        // if(!walletinfo.isVerified){
        //     navigation.replace("ToktokWalletRestricted" , {component: "notVerified" , walletinfo: walletinfo})
        //     return true
        // }

        // // checking if pin is set
        // if(!walletinfo.pincode || walletinfo.pincode == null){
        //     navigation.replace("ToktokWalletRestricted" , {component: "noPin", walletinfo: walletinfo})
        //     return true
        // }

        //  // checking if wallet is on hold
        // if(walletinfo.isHold){
        //     navigation.push("ToktokWalletRestricted" , {component: "onHold", walletinfo: walletinfo})
        //     return true
        // } 

        return false

    }

    checkIfResctricted()

    return (
        <Provider
            value={{
                checkIfResctricted: checkIfResctricted
            }}
        >
            {children}
        </Provider>
    )
}

export default CheckWalletRestrictionProvider