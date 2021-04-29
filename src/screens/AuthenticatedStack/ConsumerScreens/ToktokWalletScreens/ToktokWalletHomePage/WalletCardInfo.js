import React , {useContext} from 'react'
import {View,Text,StyleSheet,Dimensions,ImageBackground,Image,TouchableOpacity,Animated,RefreshControl,ScrollView} from 'react-native'
import { COLORS, FONTS, FONT_BOLD, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native'
import {CheckWalletRestrictionContext} from './CheckWalletRestrictionProvider'
import Separator from '../Components/Separator';
import { numberFormat } from '../../../../../helper';


//SELF IMPORTS
import WalletMethods from './WalletMethods'
import { HeaderBack } from '../../../../../revamp';

const {height,width} = Dimensions.get("window")

const WalletCardInfo = ({walletinfo})=> {
    const navigation = useNavigation()
    const rotateY = new Animated.Value(0)
    const {checkIfResctricted} = useContext(CheckWalletRestrictionContext)

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
            return navigation.navigate("ToktokWalletPaymentOptions" , {walletinfo})
        }
    }

    return (
       <View style={styles.container}>
            <ImageBackground imageStyle={[]} style={styles.walletbackgroundimage} source={require('../../../../../assets/toktokwallet-assets/header-bg.png')}>
                {/* <View style={{backgroundColor:"rgba(255, 235, 188, 0.1)",height:"100%",width:"100%",position:"absolute"}} /> */}
      
                <View style={styles.headings}>
                    <View style={{flex: 1}}>
                        <HeaderBack />
                    </View>
                    <View style={{width: 150,justifyContent:"center",alignItems:"center"}}>
                            <Image resizeMode="contain" style={{height: 23,width: 130}} source={require('../../../../../assets/toktokwallet-assets/toktokwallet.png')} />
                    </View>
                    <View style={{flex: 1}}>

                    </View>
                </View>
                <View style={{height: 38}}/>
                <View style={styles.walletContent}>
                    <View>
                        <Text style={{fontSize: 24,fontFamily: FONTS.BOLD}}>PHP {numberFormat(walletinfo.balance ? walletinfo.balance : 0)}</Text>
                        <Text style={{fontSize:SIZES.M,fontFamily: FONTS.REGULAR,color: COLORS.DARK}}>Available Balance</Text>
                    </View>
                    <TouchableOpacity onPress={cashIn} style={styles.topUp}>
                        <View style={styles.topUpbtn}>
                                <FIcon5 name={'plus'} size={12} color="black"/> 
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.walletSettings} onPress={()=>{
                        // rotateY.setValue(0)
                        animation.start(()=> {
                            animation.reset()
                            navigation.navigate("ToktokWalletSettings", {walletinfo})
                        })

                    }}>
                            <Animated.View style={[{transform: [{rotate: rotateanimation}]}]}>
                                <FIcon5 name={'cog'} size={25} color="black"/>
                            </Animated.View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <View style={styles.whitespace}>
                <WalletMethods walletinfo={walletinfo}/>
            </View>
            <Separator />
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 240,
        width: width,
    },
    whitespace: {
        height: 50,
        backgroundColor:"white",
        position:'relative'
    },
    walletbackgroundimage: {
        flex: 1,
        resizeMode: "cover",
    },
    headings: {
        marginTop: 20,
        height: 24,
        width: width,
        flexDirection:"row"
    },
    walletContent: {
        // flex: 1,
        // alignItems:"flex-start",
        // paddingHorizontal: 16,
        // flexDirection: "row",
        // justifyContent:"flex-start"
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 16,
        alignItems:"flex-start",
        justifyContent:"flex-start"
    },
    topUp: {
        justifyContent:"flex-start",
        alignItems: "center",
        width: 40,
        marginLeft: 5,
        paddingTop: 10,
    },
    topUpbtn: {
        height: 34,
        width: 34,
        borderRadius: 100,
        borderColor: "black",
        borderWidth: 2,
        justifyContent:"center",
        alignItems:"center",
    },
    walletSettings: {
        flex: 1,
        alignItems:'flex-end',
        paddingTop: 10,
        marginRight: 10,
    }
})

export default WalletCardInfo