import React from 'react'
import {useNavigation} from '@react-navigation/native'

//SELF IMPORT
import { 
    NoAccount , 
    PendingKyc , 
    RejectedKyc
} from "toktokwallet/screens/LandingScreens/ToktokWalletRestricted/Components"

export const CheckTokwaKYCRegistration = ({children, kycStatus})=>{

    const navigation = useNavigation()

    console.log(`MY KYC STATUS IS ${kycStatus}`)

     // If KYC status is Rejected
     if(kycStatus == 0){
        return <RejectedKyc/>
    }

     // If have pending KYC record and status is Pending
     if(kycStatus == 2){
         return <PendingKyc/>
     }

     // If KYC record does not exist, proceed to KYC Registration or Linking
    if(!kycStatus || kycStatus == null){
         return <NoAccount/>
    }

    return (
        <>
            {children}
       </>
    )
}
