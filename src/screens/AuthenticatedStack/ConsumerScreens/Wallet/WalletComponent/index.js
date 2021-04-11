import React, {useState,useEffect,useCallback} from 'react'
import {View,StyleSheet,ActivityIndicator,ScrollView} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong} from '../../../../../components'
import {useNavigation} from '@react-navigation/native'
import WalletRecentTransactions from '../Records/RecentTransactions'
import {GET_TOKTOK_WALLET} from '../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import {COLOR} from '../../../../../res/constants'
import TransactionsModal from '../Records/TransactionsModal'
import CreateWallet from '../VerifyUser/CreateWallet'
import { RefreshControl } from 'react-native';
import WalletCardInfo from './WalletCardInfo'
import WalletMethods from './WalletMethods'
import WalletVerificationStatus from './WalletVerficationStatus'

export default ()=> {
    const navigation = useNavigation()
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['toktok wallet','']}/>,
    })
    const session = useSelector(state=> state.session)
    const [mounted, setMounted] = useState(true)
    const [modalVisible,setModalVisible] = useState(false)
    const [refreshing,setRefreshing] = useState(false)

    const [getToktokWallet, {data = {getToktokWallet: {record: {}}}, loading , error}] = useLazyQuery(GET_TOKTOK_WALLET, {
        fetchPolicy: 'network-only',
        variables: {
            input: {
                userId: session.user.id,
            },
        },
        onCompleted: ({getToktokWallet}) => {
           console.log(getToktokWallet)
        },
    });


    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        setTimeout(() => {
            getToktokWallet()
            setRefreshing(false)
        }, 200);

    },[])

    useEffect(()=>{
        setMounted(true)
        getToktokWallet()
        return ()=> {
            setMounted(false)
        }
    },[])

    const OpenCloseTransactionsModal = ()=> setModalVisible(!modalVisible)

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
        <View style={styles.container}>
        <ScrollView
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <WalletCardInfo walletinfo={data.getToktokWallet.record}/>
            <WalletVerificationStatus walletinfo={data.getToktokWallet.record}/>
            <WalletMethods walletinfo={data.getToktokWallet.record}/>
            <WalletRecentTransactions session={session} seeAll={OpenCloseTransactionsModal} walletId={data.getToktokWallet.record.id}/>
            <TransactionsModal session={session} modalVisible={modalVisible} closeModal={OpenCloseTransactionsModal}/>
           
        </ScrollView>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "white"
    },
})