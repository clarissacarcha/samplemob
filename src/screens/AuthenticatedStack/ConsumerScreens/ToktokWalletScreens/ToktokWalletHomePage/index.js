import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View  , ActivityIndicator,StatusBar} from 'react-native'
import {SomethingWentWrong} from '../../../../../components'
import { COLOR } from '../../../../../res/variables'
import {GET_USER_TOKTOK_WALLET_DATA} from '../../../../../graphql/toktokwallet'
import {useLazyQuery, useQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

//SELF IMPORTS
import WalletLandingPage from './WalletLandingPage'
import CheckWalletRestrictionProvider from './CheckWalletRestrictionProvider'


const ToktokWalletHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false,
    })

    const session = useSelector(state=> state.session)
    const [mounted, setMounted] = useState(true)
    const [refreshing,setRefreshing] = useState(false)
  

    const  {data,error,loading} = useQuery(GET_USER_TOKTOK_WALLET_DATA , {
        fetchPolicy:"network-only",
        variables: {
            input: {
                userId: session.user.id,
            }
        },
        onCompleted: async ({getUserToktokWalletData})=> {
            // console.log(JSON.stringify(getUserToktokWalletData))
            if( getUserToktokWalletData.accountToken ) {
                await AsyncStorage.setItem('toktokWalletAccountToken', getUserToktokWalletData.accountToken);
            }

            if( getUserToktokWalletData.enterpriseToken ){
                await AsyncStorage.setItem('toktokWalletAccountToken', getUserToktokWalletData.enterpriseToken);
            }
        }
    })

    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        setTimeout(() => {
            // getToktokWallet()
            navigation.replace("ToktokWalletHomePage")
            setRefreshing(false)
        }, 200);

    },[])



    useEffect(()=>{
        setMounted(true)
        // getUserToktokWalletData()
        if(route.params){
            if(route.params.isHold){
                return navigation.push("ToktokWalletRestricted", {component: "onHold"})
            }
        }
        return ()=> {
            setMounted(false)
        }
    },[])


    if (loading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR.YELLOW} />
          </View>
        );
    }

    if (error) {
        return <SomethingWentWrong />;
    }


    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <CheckWalletRestrictionProvider kycStatus={data.getUserToktokWalletData.kycStatus}>
                {
                    data.getUserToktokWalletData.accountToken != null &&
                    <WalletLandingPage onRefresh={onRefresh} refreshing={refreshing}/>
                }
            </CheckWalletRestrictionProvider>
        </>
    )
}

export default ToktokWalletHomePage