import React , {createContext,useState, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native'
import { Alert , View } from 'react-native'
import { useSelector } from 'react-redux'

export const CheckWalletRestrictionContext = createContext({
    checkIfResctricted: null
})
const {Provider} = CheckWalletRestrictionContext

const CheckTokwaKYCRegistration = ({children, kycStatus})=>{

    const navigation = useNavigation()

    console.log(`MY KYC STATUS IS ${kycStatus}`)

     // If KYC status is Rejected
     if(kycStatus == 0){
        navigation.replace("ToktokWalletRestricted" , {component: "rejectedKYC"})
        return true
    }

     // If have pending KYC record and status is Pending
     if(kycStatus == 2){
        navigation.replace("ToktokWalletRestricted" , {component: "pendingKYC"})
        return true
    }

     // If KYC record does not exist, proceed to KYC Registration or Linking
    if(!kycStatus || kycStatus == null){
       navigation.replace("ToktokWalletRestricted" , {component: "noAccount"})
       return true
    }

    return (
        <>
            {children}
       </>
    )
}

export default CheckTokwaKYCRegistration