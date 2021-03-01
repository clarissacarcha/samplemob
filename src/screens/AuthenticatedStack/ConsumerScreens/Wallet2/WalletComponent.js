import React, {useRef,useState,useEffect,useCallback} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TouchableHighlight,Animated,ActivityIndicator,ImageBackground,ScrollView,Image} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong} from '../../../../components'
import {useNavigation,useFocusEffect} from '@react-navigation/native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import WalletRecentTransactions from './RecentTransactions'
import {GET_TOKTOK_WALLET, POST_TOKTOK_WALLET} from '../../../../graphql'
import {numberFormat} from '../../../../helper'
import {useQuery,useLazyQuery,useMutation} from '@apollo/react-hooks'
import {useSelector,useDispatch} from 'react-redux'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM} from '../../../../res/constants'
import TransactionsModal from './TransactionsModal'
import CreateWallet from './VerifyUser/CreateWallet'
import { RefreshControl } from 'react-native';

const WalletComponent = ()=> {
    const navigation = useNavigation()
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['My Wallet','']}/>,
    })
    const session = useSelector(state=> state.session)
    const [mounted, setMounted] = useState(true)
    const [modalVisible,setModalVisible] = useState(false)
    const [refreshing,setRefreshing] = useState(false)

    const rotateY = new Animated.Value(0)

    const animation = Animated.timing(rotateY,{
        toValue: 200,
        duration: 500,
        useNativeDriver: false
    })

    const rotateanimation = rotateY.interpolate({
        inputRange: [0,100,200],
        outputRange: ["0deg","60deg","90deg"]
    })


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
            getToktokWallet()
            setRefreshing(false)
        }, 200);

    },[])

    //  useFocusEffect(useCallback(()=>{
    //         //setMounted(true)
    //         getToktokWallet()
    //         return ()=> {
    //          //   setMounted(false)
    //         }
    //  },[]))


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

    const WalletCardInfo = ()=> (
        <View style={[styles.walletCard]}>
            <ImageBackground  imageStyle={{ borderRadius: 10}} style={styles.walletbackgroundimage} source={require('../../../../assets/images/walletcard.png')}>
            <View style={{padding: 30}}>
                <View style={styles.walletInfo}>
                    <View>
                        <Text style={{fontSize: 24,fontWeight: "500",color: "white"}}>{'\u20B1'} {numberFormat(data.getToktokWallet.record.balance)}</Text>
                        <Text style={{fontSize: 14,color: "white"}}>Available Balance</Text>
                    </View>
                    <TouchableOpacity style={styles.walletSettings} onPress={()=>{
                        // rotateY.setValue(0)
                        animation.start(()=> {
                            animation.reset()
                            navigation.navigate("TokTokWalletSettings")
                        })

                    }}>
                        <Animated.View style={[{transform: [{rotate: rotateanimation}]}]}>
                            <FIcon5 name={'cog'} size={30} color="white"/>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.topUp} onPress={()=>navigation.navigate("TokTokWalletCashIn",{walletId: data.getToktokWallet.record.id,balance: data.getToktokWallet.record.balance})}>
                        <Text style={{fontSize: 12,color: "white"}}>+ Top up</Text>
                </TouchableOpacity>
             </View>
            </ImageBackground>
        </View>
    )

    const WalletMethods = ()=> (
        <View style={styles.walletMethodsContainer}>
            <View style={[styles.walletMethod]}>
                <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletActionsSend")} style={styles.methodItem}>
                    <Image style={{height: 30,width: 30}} source={require('../../../../assets/icons/walletSend.png')} resizeMode="contain" />
                </TouchableOpacity>

                <Text style={{alignSelf: "center",marginTop: 10,color: "gray"}}>Send</Text>
            </View>
            <View style={[styles.walletMethod]}>
                <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletActionsRequest")} style={styles.methodItem}>
                    <Image style={{height: 30,width: 30}} source={require('../../../../assets/icons/walletRequest.png')} resizeMode="contain" />
                </TouchableOpacity>

                <Text style={{alignSelf: "center",marginTop: 10,color: "gray"}}>Request</Text>
            </View>
            <View style={[styles.walletMethod]}>
                <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletActionsScantoPay",{walletId: data.getToktokWallet.record.id,balance: data.getToktokWallet.record.balance})} style={styles.methodItem}>
                    <Image style={{height: 30,width: 30}} source={require('../../../../assets/icons/walletScan.png')} resizeMode="contain" />
                </TouchableOpacity>

                <Text style={{alignSelf: "center",marginTop: 10,color: "gray"}}>Scan</Text>
            </View>
            <View style={[styles.walletMethod]}>
                <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletActionsTransfer")} style={styles.methodItem}>
                    <Image style={{height: 30,width: 30}} source={require('../../../../assets/icons/walletTransfer.png')} resizeMode="contain" />
                </TouchableOpacity>

                <Text style={{alignSelf: "center",marginTop: 10,color: "gray"}}>Transfer</Text>
            </View>
        </View>
    )

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
                <WalletCardInfo />
                <WalletMethods />
                <WalletRecentTransactions seeAll={OpenCloseTransactionsModal} walletId={data.getToktokWallet.record.id}/>
                <TransactionsModal modalVisible={modalVisible} closeModal={OpenCloseTransactionsModal}/>
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
    walletCard: {
        height: 194,
        width: "100%",
        backgroundColor: "#FCB91A",
        borderRadius: 10,
        // padding: 30,
   
    },
    walletbackgroundimage: {
        flex: 1,
        resizeMode: "cover",
    },
    walletInfo: {
        justifyContent: "flex-start",
        flexDirection: "row"
    },
    walletSettings: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end"
    },
    topUp: {
        height: 23,
        width: 81,
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 10,
        marginTop: 18,
        justifyContent: "center",
        alignItems: "center"
    },
    walletMethodsContainer: {
        flex: 1,
        flexDirection: "row",
        height: 120,
        marginTop: 10
    },
    walletMethod: {
        flex: 1,
        padding:10,
    },
    methodItem: {
        flex: 1,
        borderColor: "silver",
        borderWidth:0.5,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default WalletComponent