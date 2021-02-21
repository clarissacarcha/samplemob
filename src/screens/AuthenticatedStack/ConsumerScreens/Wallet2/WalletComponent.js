import React, {useRef,useState,useEffect,useCallback} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TouchableHighlight,Animated,ActivityIndicator} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../components'
import {useNavigation,useFocusEffect} from '@react-navigation/native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import WalletRecentTransactions from './RecentTransactions'
import {GET_TOKTOK_WALLET, POST_TOKTOK_WALLET} from '../../../../graphql'
import {numberFormat} from '../../../../helper'
import {onError} from '../../../../util/ErrorUtility'
import {useQuery,useLazyQuery,useMutation} from '@apollo/react-hooks'
import {useSelector,useDispatch} from 'react-redux'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM} from '../../../../res/constants'

const WalletComponent = ()=> {
    const navigation = useNavigation()
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['My Wallet','']}/>,
    })
    const session = useSelector(state=> state.session)
    const [mounted, setMounted] = useState(true)

    const rotateY = new Animated.Value(0)

    const animation = Animated.timing(rotateY,{
        toValue: 200,
        duration: 1000,
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


    const [postToktokWallet, {loading: postLoading}] = useMutation(POST_TOKTOK_WALLET, {
        fetchPolicy: 'no-cache',
        onError: onError,
        variables: {
          input: {
            userId: session.user.id,
          },
        },
        onCompleted: (result) => {
          getToktokWallet();
        },
      });

     useFocusEffect(useCallback(()=>{
            //setMounted(true)
            getToktokWallet()
            return ()=> {
             //   setMounted(false)
            }
     },[]))


    // useEffect(()=>{
    //     setMounted(true)
    //     getToktokWallet()
    //     return ()=> {
    //         setMounted(false)
    //     }
    // },[])

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
        return (
          <>
            <AlertOverlay visible={postLoading} />
            <View style={{height: 20}} />
            <TouchableHighlight onPress={onPost} underlayColor={COLOR} style={[styles.submitBox, {margin: 20}]}>
              <View style={styles.submit}>
                <Text style={{color: COLOR, fontSize: 20}}>Create My Toktok Wallet</Text>
              </View>
            </TouchableHighlight>
          </>
        );
      }



    const WalletCardInfo = ()=> (
        <View style={[styles.walletCard]}>
            <View style={styles.walletInfo}>
                <View>
                    <Text style={{fontSize: 24,fontWeight: "500",color: "white"}}>{'\u20B1'} {numberFormat(data.getToktokWallet.record.balance)}</Text>
                    <Text style={{fontSize: 14,color: "white"}}>Available Balance</Text>
                </View>
                <TouchableOpacity style={styles.walletSettings} onPress={()=>{
                    // rotateY.setValue(0)
                    animation.start(()=> {
                        console.log("test")
                        animation.reset()
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
    )

    return (
        <View style={styles.container}>
            <WalletCardInfo />
            <WalletRecentTransactions />
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
        padding: 30,
   
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
})

export default WalletComponent