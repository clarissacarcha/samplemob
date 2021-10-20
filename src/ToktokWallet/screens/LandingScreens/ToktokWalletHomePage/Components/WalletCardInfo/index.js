import React , {useContext} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Animated,Alert,Image} from 'react-native'
import CONSTANTS from 'common/res/constants';
import { useNavigation } from '@react-navigation/native'
import {Separator , HeaderImageBackground, HeaderTitle} from 'toktokwallet/components';
import { numberFormat , getDeviceWidth as width  } from 'toktokwallet/helper';
import {useAccount} from 'toktokwallet/hooks'


//SELF IMPORTS
import WalletMethods from './WalletMethods'
import { ICON_SET, VectorIcon } from 'src/revamp';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const titleAccountTypeColor = ['','#929191','#00C851','#2699FB']

const WalletCardInfo = ({loading})=> {
    const navigation = useNavigation()
    const rotateY = new Animated.Value(0)
    const {checkIfTpinIsSet,tokwaAccount} = useAccount();

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
        const tpinIsSet = checkIfTpinIsSet();
        if(!tpinIsSet) return
        return navigation.navigate("ToktokWalletPaymentOptions")
        
    }

    const redirectLinking = () => {
        return navigation.navigate("ToktokWalletTransactionLimit");
    }

    const tokwaNotifications = ()=> navigation.navigate("ToktokWalletNotifications")

    return (
       <View style={styles.container}>
           <HeaderImageBackground>
               <HeaderTitle 
                    isRightIcon 
                    rightIconOnPress={()=>navigation.navigate("ToktokWalletNotifications")} 
                    isLogo
                    headerBackLabel="Home"
                />
               <View style={{flex: 1,justifyContent:"flex-end",paddingBottom: 45}}>
                    <View>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity onPress={redirectLinking} style={{paddingHorizontal: 16,flexDirection:"row"}}>
                                <View style={{alignSelf:'center', padding: 1 ,borderRadius: 100, borderWidth: 1,borderColor: titleAccountTypeColor[tokwaAccount.person.accountType.level],justifyContent:'center',marginRight: 5,}}>
                                    <VectorIcon size={FONT_SIZE.XS} iconSet={ICON_SET.Feather} name="check" color={titleAccountTypeColor[tokwaAccount.person.accountType.level]}/>
                                </View>
                                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color: titleAccountTypeColor[tokwaAccount.person.accountType.level]}}>{tokwaAccount.person.accountType.title}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.walletContent}>
                                 <View>
                                    {
                                    <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance)}</Text>
                                    }         
                                    <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Available Balance</Text>
                                </View>

                                <TouchableOpacity onPress={cashIn} style={styles.topUp}>
                                    <View style={styles.topUpbtn}>
                                    <VectorIcon iconSet={ICON_SET.Entypo} name="plus" color="black" size={20}/>
                                    </View>
                                </TouchableOpacity>
                                

                                <TouchableOpacity style={styles.walletSettings} onPress={()=>{
                              
                                            animation.start(()=> {
                                                animation.reset()
                                                navigation.navigate("ToktokWalletSettings")
                                            })
                                        
                                    }}>
                                            <Animated.View style={[{transform: [{rotate: rotateanimation}]}]}>
                                                <VectorIcon iconSet={ICON_SET.FontAwesome5} name="cog" color="black" size={30}/>
                                            </Animated.View>
                                    </TouchableOpacity>
                        </View>
                   </View>
               </View>
            
           </HeaderImageBackground>
    
            <View style={styles.whitespace}>
                <WalletMethods/>
                <View style={{flex: 1 ,marginTop: -40, justifyContent:"center",alignItems:"center"}}>
                    <TouchableOpacity onPress={()=>navigation.navigate("ToktokWalletHelpCentreSecurityPrivacy")} style={{flexDirection:"row",padding: 2,marginTop: 10}}>
                         <Image style={{height: 21,width: 21,marginRight: 5,}} source={require('toktokwallet/assets/icons/walletVerify.png')}/>
                         <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.S}}>Your wallet is <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.S,color: COLOR.ORANGE}}>encrypted and secure.</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Separator />
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // height: 215, // ios
        // height: 255,
        height: 280,
        width: width,
    },
    whitespace: {
        height: 80,
        backgroundColor:"white",
        position:'relative'
    },
    walletbackgroundimage: {
        flex: 1,
        resizeMode: "cover",
    },
    headings: {
        marginTop: 42,
        height: 24,
        width: width,
        flexDirection:"row"
    },
    walletContent: {
        flexDirection: "row",
        paddingHorizontal: 16,
    },
    topUp: {
        justifyContent:"flex-start",
        alignItems: "center",
        width: 40,
        marginLeft: 5,
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
        marginRight: 10,
    }
})

export default WalletCardInfo