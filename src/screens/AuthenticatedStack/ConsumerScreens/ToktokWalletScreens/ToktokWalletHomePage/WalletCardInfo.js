import React , {useContext} from 'react'
import {View,Text,StyleSheet,Dimensions,TouchableOpacity,Animated,RefreshControl,ScrollView,ActivityIndicator} from 'react-native'
import { COLOR , FONT , FONT_SIZE} from '../../../../../res/variables';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native'
import {CheckWalletRestrictionContext} from './CheckWalletRestrictionProvider'
import {Separator , HeaderImageBackground, HeaderTitle} from '../Components';
import { numberFormat } from '../../../../../helper';


//SELF IMPORTS
import WalletMethods from './WalletMethods'
import { HeaderBack } from '../../../../../revamp';


const {height,width} = Dimensions.get("window")

const WalletCardInfo = ({account , loading})=> {
    const navigation = useNavigation()
    const rotateY = new Animated.Value(0)
    const {checkIfResctricted} = useContext(CheckWalletRestrictionContext)
    const walletinfo = account.wallet

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
           <HeaderImageBackground>
               <HeaderTitle isLogo={true} headerBackLabel="Home"/>
               <View style={{height: 28}}/>
                <View style={styles.walletContent}>
                    <View>
                        {
                            loading
                            ? <ActivityIndicator size={24} color={COLOR.YELLOW}/>
                            : <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{walletinfo.currency.code} {numberFormat(walletinfo.balance)}</Text>
                        }         
                        <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Available Balance</Text>
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
           </HeaderImageBackground>
    
            <View style={styles.whitespace}>
                <WalletMethods account={account} walletinfo={walletinfo}/>
            </View>
            <Separator />
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // height: 215, // ios
        height: 255,
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
        marginTop: 42,
        height: 24,
        width: width,
        flexDirection:"row"
    },
    walletContent: {
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