import React, {useState,useEffect,useCallback, useContext ,useRef} from 'react'
import {View,StyleSheet,ActivityIndicator,ScrollView,Image,Text,TouchableOpacity} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong} from '../../../../../components'
import WalletRecentTransactions from '../Records/RecentTransactions'
import {GET_TOKTOK_WALLET} from '../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import {COLOR, FONT_BOLD, FONT_REGULAR, SIZES, ORANGE} from '../../../../../res/constants'
import TransactionsModal from '../Records/TransactionsModal'
import CreateWallet from '../VerifyUser/CreateWallet'
import { RefreshControl } from 'react-native';



import WalletCardInfo from './WalletCardInfo'
import WalletMethods from './WalletMethods'
import WalletVerificationStatus from './WalletVerficationStatus'
import WalletHoldMessageModal from '../Notification/WalletHoldMessageModal'
import Advertisements from './Advertisements'
import RecentOutgoingTransfer from './RecentOutgoingTransfer'



import CheckWalletRestrictionProvider from './Context/CheckWalletRestrictionProvider'
import ConfirmBottomSheet from '../Components/ConfirmBottomSheet'
import ConfirmRecentTransaction from './ConfirmRecentTransaction'

export default ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <View style={{justifyContent:"center",alignItems:"center"}}>
            <Text style={{fontFamily: FONT_BOLD,fontSize: SIZES.XL,marginRight: 50,color: COLOR}}>toktok<Text style={{color: ORANGE}}>wallet</Text></Text>
        </View>,
    })
    const session = useSelector(state=> state.session)
    const [mounted, setMounted] = useState(true)
    const [modalVisible,setModalVisible] = useState(false)
    const [refreshing,setRefreshing] = useState(false)
    const bottomSheetRef = useRef()
    const [recentTransfer,setRecentTransfer] = useState(null)

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
        <CheckWalletRestrictionProvider walletinfo={data.getToktokWallet.record}>
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
                    <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletSecurityAndPrivacy")} underlayColor="transparent" style={styles.securityAndPrivacy}>
                        <Image style={{height: 10,width: 9,marginRight: 5}} source={require('../../../../../assets/icons/walletVerify.png')}/>
                        <Text style={{fontSize: SIZES.S,fontFamily: FONT_REGULAR}}>Your toktokwallet is <Text style={{color:"#F6841F"}}>encrypted and secure.</Text></Text>
                    </TouchableOpacity>
                    <WalletCardInfo walletinfo={data.getToktokWallet.record}>
                        <WalletMethods walletinfo={data.getToktokWallet.record}/>
                    </WalletCardInfo>
                    <WalletVerificationStatus walletinfo={data.getToktokWallet.record}/>
                    <Advertisements />
                    <RecentOutgoingTransfer walletinfo={data.getToktokWallet.record} onPress={(recentTransfer)=>{
                        setRecentTransfer(recentTransfer)
                        bottomSheetRef.current.snapTo(1)
                    }}/>
                    <WalletRecentTransactions session={session} seeAll={OpenCloseTransactionsModal} walletId={data.getToktokWallet.record.id}/>
                    <TransactionsModal session={session} modalVisible={modalVisible} closeModal={OpenCloseTransactionsModal}/>
                
                </ScrollView>

                <ConfirmBottomSheet
                        bottomSheetRef={bottomSheetRef}
                        onPress={()=>{
                            bottomSheetRef.current.snapTo(0)
                            navigation.navigate("ToktokWalletSendMoney", {walletinfo: data.getToktokWallet.record , recentTransfer})
                        }}
                        headerTitle="Do fund transfer again?" 
                        btnLabel="Confirm"
                    >
                        {
                            recentTransfer && <ConfirmRecentTransaction recentTransfer={recentTransfer}/>
                        }
               </ConfirmBottomSheet>

            </View>
        </CheckWalletRestrictionProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "white"
    },
    securityAndPrivacy: {
        flexDirection:"row",
        flex: 1,
        marginBottom: 5,
        justifyContent:"center",
        alignItems:"center",
        paddingBottom: 5,
    }
})