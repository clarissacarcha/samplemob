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
            navigation.replace("ToktokWalletRestricted" , {component: "notVerified" , walletinfo: walletinfo})
            return true
        }

        // checking if pin is set
        if(!walletinfo.pincode || walletinfo.pincode == null){
            navigation.replace("ToktokWalletRestricted" , {component: "noPin", walletinfo: walletinfo})
            return true
        }

         // checking if wallet is on hold
        if(walletinfo.isHold){
            navigation.push("ToktokWalletRestricted" , {component: "onHold", walletinfo: walletinfo})
            return true
        } 

        return false

    }


    if(walletinfo.id){
        if(!walletinfo.isVerified || !walletinfo.pincode){
            //  navigation.pop()
             return checkIfResctricted()
        }
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