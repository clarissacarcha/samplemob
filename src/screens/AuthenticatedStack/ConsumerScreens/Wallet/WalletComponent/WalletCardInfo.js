import React , {useState,useContext} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TouchableHighlight,Animated,ActivityIndicator,ImageBackground,ScrollView,Image,Dimensions} from 'react-native'
import { FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants'
import { useNavigation } from '@react-navigation/native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import { numberFormat } from '../../../../../helper';
import {CheckWalletRestrictionContext} from './Context/CheckWalletRestrictionProvider'


const WalletCardInfo = ({walletinfo , children})=> {
    const navigation = useNavigation()


    const {checkIfResctricted} = useContext(CheckWalletRestrictionContext)

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

    const cashIn = ()=> {
        if(!checkIfResctricted()){
            return navigation.navigate("TokTokWalletCashIn" , {walletinfo})
        }
    }

    return (
        <>
        <View style={[styles.walletCard]}>
        <ImageBackground  imageStyle={{ borderRadius: 10}} style={styles.walletbackgroundimage} source={require('../../../../../assets/images/walletcard.png')}>
        <View style={{padding: 25}}>
            <View style={styles.walletInfo}>
                <View>
                    <Text style={{fontSize: 20,fontFamily: FONT_MEDIUM, color: "white"}}>{'\u20B1'} {numberFormat(walletinfo.balance ? walletinfo.balance : 0)}</Text>
                    <Text style={{fontSize: 12,color: "white",fontFamily: FONT_REGULAR}}>Available Balance</Text>
                </View>
                <TouchableOpacity onPress={cashIn} style={styles.topUp}>
                    <View style={styles.topUpbtn}>
                            <FIcon5 name={'plus'} size={12} color="white"/> 
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.walletSettings} onPress={()=>{
                    // rotateY.setValue(0)
                    animation.start(()=> {
                        animation.reset()
                        navigation.navigate("TokTokWalletSettings", {walletinfo})
                    })

                }}>
                    <Animated.View style={[{transform: [{rotate: rotateanimation}]}]}>
                        {/* <FIcon5 name={'cog'} size={25} color="white"/> */}
                        <Image source={require('../../../../../assets/icons/settings.png')} style={{height: 25,width: 25}} resizeMode="contain" />
                    </Animated.View>
                </TouchableOpacity>
            </View>
          
            {/* <View style={styles.toktoklogo}>
                <Image style={{height: 50, width: 50}} resizeMode="contain" source={require('../../../../../assets/images/toktokwalletlanding.png')} />
            </View> */}
         </View>
        </ImageBackground>

        {children}
    </View>
    </>
    )
}

const styles = StyleSheet.create({
   
    walletCard: {
        height: 125,
        // height: 194,
        width: "100%",
        backgroundColor: "#FCB91A",
        borderRadius: 10,
        position:"relative",
        marginBottom: 40
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
    topUp: {
        justifyContent:"center",
        alignItems: "center",
        width: 40,
        // paddingBottom: 6,
        // backgroundColor:"red",
        marginLeft: 5
    },
    topUpbtn: {
        height: 30,
        width: 30,
        borderRadius: 100,
        borderColor: "white",
        borderWidth: 1,
        justifyContent:"center",
        alignItems:"center"
    }
})

export default WalletCardInfo