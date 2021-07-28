import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View  , ActivityIndicator,StatusBar,Text} from 'react-native'
import {SomethingWentWrong} from '../../../../../components'
import { COLOR } from '../../../../../res/variables'
import {GET_USER_TOKTOK_WALLET_DATA} from '../../../../../graphql/toktokwallet'
import {useLazyQuery, useQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

//SELF IMPORTS
import WalletLandingPage from './WalletLandingPage'
import CheckTokwaKYCRegistration from './CheckTokwaKYCRegistration'
import CheckWalletAccountRestriction from "./CheckWalletAccountRestriction"


const LoadingPage = ()=> {
    return (
        <View style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator color={COLOR.YELLOW} size={25}/>
        </View>
    )
}



const ToktokWalletHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false,
    })

    const session = useSelector(state=> state.session)
    const [mounted, setMounted] = useState(true)
    const [pageLoading,setPageLoading] = useState(true)
    const [refreshing,setRefreshing] = useState(false)
    const [accountToken,setAccountToken] = useState(null)
    const [enterpriseToken,setEnterpriseToken] = useState(null)
    const [kycStatus,setKycStatus] = useState(null)
  

    const  [getUserToktokWalletData,{data,error,loading}] = useLazyQuery(GET_USER_TOKTOK_WALLET_DATA , {
        fetchPolicy:"network-only",
        onCompleted: async ({getUserToktokWalletData})=> {
            if( getUserToktokWalletData.accountToken ) {
                setAccountToken(getUserToktokWalletData.accountToken)
                await AsyncStorage.setItem('toktokWalletAccountToken', getUserToktokWalletData.accountToken);
            }

            if( getUserToktokWalletData.enterpriseToken ){
                setEnterpriseToken(getUserToktokWalletData.enterpriseToken)
                await AsyncStorage.setItem('toktokWalletEnterpriseToken', getUserToktokWalletData.enterpriseToken);
            }
            
            if(getUserToktokWalletData.kycStatus){
                setKycStatus(getUserToktokWalletData.kycStatus)
                await AsyncStorage.setItem('toktokWalletKycStatus',JSON.stringify(getUserToktokWalletData.kycStatus))
            }

            setKycStatus(getUserToktokWalletData.kycStatus)
        }
    })


    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        setTimeout(() => {
            prepareHomepage()
            setRefreshing(false)
        }, 200);

    },[])

    const checkIfTokenIsSet = async ()=>{
        try {
            const accountTokenAsync = await AsyncStorage.getItem("toktokWalletAccountToken")
            if(accountTokenAsync) {
                setAccountToken(accountTokenAsync)
                setKycStatus(1)
            }
            const enterpriseTokenAsync = await AsyncStorage.getItem("toktokWalletEnterpriseToken")
            if(enterpriseTokenAsync) setEnterpriseToken(enterpriseTokenAsync)


            if(accountTokenAsync || enterpriseTokenAsync){
                return true
            }

            return false
        }catch(err){
            throw err
        }
    }

    useEffect(()=>{
        console.log(kycStatus)
    },[kycStatus])

    const prepareHomepage = async()=> {
        const checkiftoken = await checkIfTokenIsSet()
        if(checkiftoken){
            console.log("TOKEN IS SET")
            setKycStatus(1)
            setPageLoading(false)
            return
        }else{
            getUserToktokWalletData({
                variables: {
                    input: {
                        userId: session.user.id,
                    }
                },
            })
        }
    }


    useEffect(()=>{
        setMounted(true)
        if(mounted){
            prepareHomepage()
            setPageLoading(false)
        }
        return ()=> setMounted(false) 
    },[])


    return (
        <>
        {
            pageLoading
            ? <LoadingPage/>
            // : <View style={{flex:1,justifyContent:"center",alignItems:'center'}}><Text>{kycStatus}</Text></View>
            :  <>
             <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
           
                <CheckTokwaKYCRegistration kycStatus={kycStatus}/>
                    {
                        accountToken != null &&
                        <CheckWalletAccountRestriction>
                            <WalletLandingPage onRefresh={onRefresh} refreshing={refreshing}/>
                        </CheckWalletAccountRestriction>
                    }
        
                <Text>{kycStatus}</Text>
            </>
        }
           
        </>
    )
}

export default ToktokWalletHomePage