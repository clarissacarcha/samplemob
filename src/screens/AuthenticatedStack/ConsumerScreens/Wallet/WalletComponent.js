import React, {useRef,useState,useEffect,useCallback} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TouchableHighlight,Animated,ActivityIndicator,ImageBackground,ScrollView,Image,Dimensions} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong} from '../../../../components'
import {useNavigation,useFocusEffect} from '@react-navigation/native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import WalletRecentTransactions from './Records/RecentTransactions'
import {GET_TOKTOK_WALLET} from '../../../../graphql'
import {numberFormat} from '../../../../helper'
import {useQuery,useLazyQuery,useMutation} from '@apollo/react-hooks'
import {useSelector,useDispatch} from 'react-redux'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,FONT_MEDIUM, FONT_REGULAR} from '../../../../res/constants'
import TransactionsModal from './Records/TransactionsModal'
import CreateWallet from './VerifyUser/CreateWallet'
import NotVerifiedComponent from "./NotVerifiedComponent"
import { RefreshControl } from 'react-native';

const {width,height} = Dimensions.get("window")

const WalletComponent = ()=> {
    const navigation = useNavigation()
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['toktok wallet','']}/>,
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

    const WalletCardInfo = ()=> (
        <View style={[styles.walletCard]}>
            <ImageBackground  imageStyle={{ borderRadius: 10}} style={styles.walletbackgroundimage} source={require('../../../../assets/images/walletcard.png')}>
            <View style={{padding: 25}}>
                <View style={styles.walletInfo}>
                    <View>
                        <Text style={{fontSize: 20,fontFamily: FONT_MEDIUM, color: "white"}}>{'\u20B1'} {numberFormat(data.getToktokWallet.record.balance)}</Text>
                        <Text style={{fontSize: 12,color: "white",fontFamily: FONT_REGULAR}}>Available Balance</Text>
                    </View>
                    <TouchableOpacity style={styles.walletSettings} onPress={()=>{
                        // rotateY.setValue(0)
                        animation.start(()=> {
                            animation.reset()
                            navigation.navigate("TokTokWalletSettings", {walletinfo: data.getToktokWallet.record})
                        })

                    }}>
                        <Animated.View style={[{transform: [{rotate: rotateanimation}]}]}>
                            <FIcon5 name={'cog'} size={25} color="white"/>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
              
                <View style={styles.toktoklogo}>
                    <Image style={{height: 50, width: 50}} resizeMode="contain" source={require('../../../../assets/images/toktokwalletlanding.png')} />
                </View>
             </View>
            </ImageBackground>
        </View>
    )

    const WalletMethod = ({onPress , imageSource , label , imageSize})=> (
        <View style={[styles.walletMethod]}>
            <TouchableOpacity onPress={onPress} style={styles.methodItem}>
                <Image style={{height: imageSize.height,width: imageSize.width}} source={imageSource} resizeMode="contain" />
            </TouchableOpacity>

            <Text style={styles.walletMethodText}>{label}</Text>
        </View>
    )

    const WalletMethods = ()=> (
        <View style={styles.walletMethodsContainer}>
            {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                */}
                <WalletMethod label="Send" imageSize={{height: 26, width: 26}} onPress={()=>navigation.navigate("TokTokWalletActionsSend",{walletinfo: data.getToktokWallet.record})} imageSource={require('../../../../assets/icons/walletSend.png')}/>
                {/* <WalletMethod label="Request" imageSize={{height: 26, width: 26}} onPress={()=>navigation.navigate("TokTokWalletActionsRequest")} imageSource={require('../../../../assets/icons/walletRequest.png')}/> */}
                <WalletMethod label="Scan" imageSize={{height: 25, width: 23}} onPress={()=>navigation.navigate("TokTokWalletActionsScantoPay",{walletinfo: data.getToktokWallet.record})} imageSource={require('../../../../assets/icons/walletScan.png')}/>
                <WalletMethod label="Cash in" imageSize={{height: 26, width: 26}} onPress={()=>navigation.navigate("TokTokWalletCashIn",{walletinfo: data.getToktokWallet.record})} imageSource={require('../../../../assets/icons/methodCashin.png')}/>
                <WalletMethod label="Cash out" imageSize={{height: 26, width: 26}} onPress={()=>navigation.navigate("TokTokWalletCashout",{walletinfo: data.getToktokWallet.record})} imageSource={require('../../../../assets/icons/walletTransfer.png')}/>
            {/* </ScrollView> */}
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
            
                {
                    data.getToktokWallet.record.isVerified
                    ?  
                    <>
                        <WalletMethods />
                        <WalletRecentTransactions session={session} seeAll={OpenCloseTransactionsModal} walletId={data.getToktokWallet.record.id}/>
                        <TransactionsModal session={session} modalVisible={modalVisible} closeModal={OpenCloseTransactionsModal}/>
                    </>
                    : <NotVerifiedComponent />
                }
               
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
    toktoklogo: {
        marginTop: 10,
        justifyContent: "center",
    },
    walletMethodsContainer: {
        flexDirection: "row",
        height: 120,
        marginTop: 10,
        flexWrap: "nowrap",
        flex: 1,
       // paddingHorizontal: 5,
    },
    walletMethod: {
        flex: 1,
        padding:10,
        // height: 65,
        // width: 65,
        // marginRight: 10,
         alignItems:"center"
    },
    methodItem: {
        // flex: 1,
        height: 65,
        // width: 65,
        width: (width / 4 ) - 30,
        borderColor: "silver",
        borderWidth:0.5,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    walletMethodText: {
        alignSelf: "center",
        marginTop: 10,
        color: "gray",
        fontSize: 12,
        fontFamily: FONT_REGULAR
    }
})

export default WalletComponent