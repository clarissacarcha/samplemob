import React, { useState , useRef ,useEffect } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,TextInput,Dimensions,StatusBar,Image} from 'react-native';
import { ICON_SET, VectorIcon, YellowButton , HeaderBack , HeaderTitle } from 'src/revamp'
import { AlertOverlay } from 'src/components';
import { CheckIdleState  , DisabledButton , NumberBoxes, HeaderCancel, CircleIndicator , NumPad } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import { BuildingBottom } from '../../../components';
import { TransactionUtility } from 'toktokwallet/util'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_VERIFY_ACCOUNT_TPIN } from 'toktokwallet/graphql'
import {useMutation} from '@apollo/react-hooks'
import {useAlert, usePrompt} from 'src/hooks'
import AntDesign from 'react-native-vector-icons/AntDesign';
import tokwaLogo from 'toktokwallet/assets/images/tokwa2.png';


const {COLOR , FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS
const { width , height } = Dimensions.get("window")

export const ToktokWalletTPINValidator = ({navigation,route})=> {

    const callBackFunc = route?.params?.callBackFunc ? route.params.callBackFunc : null
    const errorMessage = route?.params?.errorMessage ? route.params.errorMessage : null
    const data = route?.params?.data ? route.params.data : null
    const btnLabel = route?.params?.btnLabel ? route.params.btnLabel : "Proceed"

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[""]}/>,
        headerRight: ()=> btnLabel == "Cash In" && <HeaderCancel navigation={navigation} screenPopNo={4} />
    })

    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const [showPin,setShowPin] = useState(false)
    const prompt = usePrompt()
    const alert = useAlert()

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };

    const [postVerifyAccountTPIN , {loading}] = useMutation(POST_VERIFY_ACCOUNT_TPIN, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postVerifyAccountTPIN})=> {
            return callBackFunc({pinCode , data})
        },
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt,
                alert      
            })
        }
    })

    useEffect(()=>{
        if(pinCode.length == 6){
            postVerifyAccountTPIN({
               variables: {
                   input: {
                     tpin: pinCode
                   }
               }
            })
            // callBackFunc({pinCode , data})
        }
    },[pinCode])

    useEffect(()=>{
        if(errorMessage != ""){
            setPinCode("")
        }
    },[errorMessage])


    return(
        <CheckIdleState>
            <AlertOverlay visible={loading}/>
            <View
                style={styles.container}
            >
                 <View style={styles.content}>

                    <Image
                        style={styles.tokwaLogo}
                        source={tokwaLogo}
                        resizeMode="contain"
                    />

                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,alignSelf:"center",marginTop: 20}}>Enter TPIN</Text>
                    <View style={{flexDirection:"row", justifyContent:"center",alignItems:"center"}}>
                            <View style={{backgroundColor:COLOR.YELLOW, marginRight: 5, justifyContent:"center",alignItems:"center", height: FONT_SIZE.M,width: FONT_SIZE.M,borderRadius:  FONT_SIZE.M}}>
                                <AntDesign name="exclamation" size={FONT_SIZE.XS} color="white"/>
                            </View>
                            <Text style={{ fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Do not share your TPIN with anyone.</Text>
                    </View>
                    <View style={{position: 'relative',height: 20,marginTop: 20,justifyContent:"center",alignItems:"center"}}>
                        <CircleIndicator pinCode={pinCode} showPin={showPin} numberOfBox={6}/>
                    </View>
                
                    {
                        errorMessage != "" && <Text style={{fontFamily: FONT.REGULAR,color:"red",alignSelf:"center",fontSize: 12,textAlign:'center'}}>{errorMessage}</Text>
                    }
                    <NumPad
                        setPinCode={setPinCode}
                        pinCode={pinCode}
                    />
            
                    <View style={{justifyContent:"center", alignItems: "center",flex: 1}}>
                        <TouchableOpacity
                                style={{}}
                                onPress={()=>navigation.navigate("ToktokWalletRecoveryMethods", {type: "TPIN", event: "enterprise"})}
                        >
                                <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Forgot TPIN?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <BuildingBottom/>
            </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    content: {
        flex: 1,
        justifyContent:"flex-start",
        alignItems:"center",
        textAlign:"center",
    },
    tpinBody: {
        flex: 1,
        alignItems:"center",
        justifyContent: "center",
    },
    backBtn: {
        backgroundColor:"#F7F7FA",
        top: Platform.OS == "ios" ? 40 : 10, 
        left: 16,
        position:"absolute",
        zIndex: 1,
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 100,
        height: 35,
        width: 35,
    },
    proceedBtn: {
        height: 70,
        width: "100%",
        justifyContent:"flex-end"
    },
    tokwaLogo: {
        height: 80,
        width: 200,
        marginTop: 20,
    },
})