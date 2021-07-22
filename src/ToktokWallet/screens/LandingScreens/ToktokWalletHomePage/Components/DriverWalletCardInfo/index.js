import React , {useContext} from 'react'
import {View,Text,StyleSheet,Dimensions,TouchableOpacity,Animated,Alert,Image} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {Separator , HeaderImageBackground, HeaderTitle} from 'toktokwallet/components';
import { numberFormat } from 'toktokwallet/helper';
import {useSelector} from 'react-redux'
import {APP_FLAVOR , ACCOUNT_TYPE} from 'src/res/constants'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import DriverWalletMethods from './DriverWalletMethods'
import { ICON_SET, VectorIcon } from 'src/revamp';
import { CheckWalletAccountRestrictionContext } from '../CheckWalletAccountRestriction';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS
const titleAccountTypeColor = ['','#929191','#00C851','#2699FB']


const {height,width} = Dimensions.get("window")

const DriverWalletCardInfo = ({loading})=> {
    const navigation = useNavigation()
    const rotateY = new Animated.Value(0)
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const checkWallet = useContext(CheckWalletAccountRestrictionContext)

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
        if(APP_FLAVOR == "D" && ACCOUNT_TYPE == 2){
            return Alert.alert("","Use the toktok customer app for toktokwallet full features.")
        }
        if(checkWallet.checkIfAllowed()){
            return navigation.navigate("ToktokWalletPaymentOptions")
        }
    }

    return (
       <View style={styles.container}>
           <HeaderImageBackground>
               <HeaderTitle isLogo={true} headerBackLabel="Home"/>
               <View style={{flex: 1,justifyContent:"flex-end",paddingBottom: 45}}>
                    <View>
                        <View style={{paddingHorizontal: 16,flexDirection:"row"}}>
                            <View style={{alignSelf:'center', padding: 1 ,borderRadius: 100, borderWidth: 1,borderColor: titleAccountTypeColor[tokwaAccount.person.accountType.level],justifyContent:'center',marginRight: 5,}}>
                                <VectorIcon size={FONT_SIZE.XS} iconSet={ICON_SET.Feather} name="check" color={titleAccountTypeColor[tokwaAccount.person.accountType.level]}/>
                            </View>
                                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color: titleAccountTypeColor[tokwaAccount.person.accountType.level]}}>{tokwaAccount.person.accountType.title}</Text>
                        </View>

                        <View style={styles.walletContent}>
                                <View>
                                    {
                                    <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance)}</Text>
                                    }         
                                    <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Available Balance</Text>
                                </View>
                                <TouchableOpacity style={styles.walletSettings} onPress={()=>{
                                    // rotateY.setValue(0)
                                    if(checkWallet.checkIfAllowed()){
                                        animation.start(()=> {
                                            animation.reset()
                                            navigation.navigate("ToktokWalletSettings")
                                        })
                                    }
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
                <DriverWalletMethods/>
                <View style={{flex: 1, justifyContent:"center",alignItems:"center"}}>
                    <TouchableOpacity onPress={()=>navigation.navigate("ToktokWalletHelpCentreSecurityPrivacy")} style={{flexDirection:"row",padding: 2}}>
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
        paddingTop: 10,
    }
})

export default DriverWalletCardInfo