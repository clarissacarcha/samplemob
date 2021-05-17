import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View , StyleSheet , ActivityIndicator,RefreshControl,ScrollView,StatusBar} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong} from '../../../../../components'
import { COLOR, FONT_BOLD, FONT_REGULAR, SIZES, ORANGE } from '../../../../../res/constants'
import {GET_TOKTOK_WALLET} from '../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'

//SELF IMPORTS
import WalletCardInfo from './WalletCardInfo'
import WalletRecentOutgoingTransfer from './WalletRecentOutgoingTransfer'
import WalletRecentTransactions from './WalletRecentTransactions'
import WalletVerificationStatus from './WalletVerificationStatus'
import CheckWalletRestrictionProvider from './CheckWalletRestrictionProvider'
import CreateWallet from './CreateWallet'


const ToktokWalletHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false,
    })

    const session = useSelector(state=> state.session)
    const [mounted, setMounted] = useState(true)
    const [refreshing,setRefreshing] = useState(false)

    const [getToktokWallet, {data = {getToktokWallet: {record: {}}}, loading , error}] = useLazyQuery(GET_TOKTOK_WALLET, {
        fetchPolicy: 'network-only',
        variables: {
            input: {
                userId: session.user.id,
            },
        },
        onCompleted: ({getToktokWallet}) => {

        },
    });

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
        getToktokWallet()
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
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        );
    }

    if (error) {
        return <SomethingWentWrong />;
    }

    if (!data.getToktokWallet.record) {
        return <CreateWallet getWallet={getToktokWallet} session={session}/>
    }



    return (
        <>
         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <CheckWalletRestrictionProvider walletinfo={data.getToktokWallet.record}>
            <View style={styles.container}>
                <View style={{height:255}}>
                    <ScrollView 
                        style={{flex: 1,backgroundColor:"green"}}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        <WalletCardInfo walletinfo={data.getToktokWallet.record}/>
                    </ScrollView>
                </View>
                <View style={{flex: 1,}}>
                    <WalletVerificationStatus walletinfo={data.getToktokWallet.record}/>
                    <WalletRecentOutgoingTransfer walletinfo={data.getToktokWallet.record}/>
                    <WalletRecentTransactions session={session}/>
                </View>
        
            </View>
        </CheckWalletRestrictionProvider>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default ToktokWalletHomePage