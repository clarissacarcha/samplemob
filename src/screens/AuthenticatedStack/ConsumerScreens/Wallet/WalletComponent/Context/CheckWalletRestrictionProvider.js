import React , {createContext,useState} from 'react'
import {useNavigation} from '@react-navigation/native'

export const CheckWalletRestrictionContext = createContext({
    checkIfResctricted: null
})
const {Provider} = CheckWalletRestrictionContext

const CheckWalletRestrictionProvider = ({children, walletinfo})=>{

    const navigation = useNavigation()

    const checkIfResctricted = ()=> {
        // checking if wallet is not verified
        if(!walletinfo.isVerified){
            navigation.push("TokTokWalletRestricted" , {component: "notVerified" , walletinfo: walletinfo})
            return true
        }

        // checking if pin is set
        if(!walletinfo.pincode || walletinfo.pincode == null){
            navigation.push("TokTokWalletRestricted" , {component: "noPin", walletinfo: walletinfo})
            return true
        }

         // checking if wallet is on hold
        if(walletinfo.isHold){
            navigation.push("TokTokWalletRestricted" , {component: "onHold", walletinfo: walletinfo})
            return true
        } 

        return false

    }

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