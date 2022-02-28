import React, { useState , useRef ,useEffect } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,TextInput,Dimensions,StatusBar,Image} from 'react-native';
import { ICON_SET, VectorIcon, YellowButton , HeaderBack , HeaderTitle } from 'src/revamp'
import { AlertOverlay } from 'src/components';
import { CheckIdleState  , DisabledButton , NumberBoxes, HeaderCancel, CircleIndicator , NumPad } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import { BuildingBottom } from '../../../components';
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

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };

    useEffect(()=>{
        if(pinCode.length == 6){
            callBackFunc({pinCode , data})
        }
    },[pinCode])

    useEffect(()=>{
        if(errorMessage != ""){
            setPinCode("")
        }
    },[errorMessage])


    return(
        <CheckIdleState>
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
                    <View style={{position: 'relative',flex: 1,justifyContent:"center",alignItems:"center"}}>
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
                  
                    {/* <View style={styles.tpinBody}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginVertical: 30}}>Enter TPIN</Text>
                        <View style={{flexDirection:"row"}}>
                        <NumberBoxes 
                            pinCode={pinCode} 
                            onNumPress={onNumPress} 
                            showPin={showPin}
                            error={errorMessage}
                        />
                         <TextInput
                                caretHidden
                                value={pinCode}
                                ref={inputRef}
                                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                                keyboardType="numeric"
                                returnKeyType="done"
                                onChangeText={(value) => {
                                if (value.length <= 6) {
                                    const replaceValue = value.replace(/[^0-9]/g,"")
                                    setPinCode(replaceValue);
                                }
                                }}
                               
                        />
                        
                        </View>
                        {
                            errorMessage != "" && <Text style={{fontFamily: FONT.REGULAR,color:"red",alignSelf:"center",fontSize: 12,textAlign:'center'}}>{errorMessage}</Text>
                        }

                        <TouchableOpacity
                            style={{paddingTop: height * .07, paddingVertical: 10, alignItems: "center"}}
                            onPress={()=>setShowPin(!showPin)}
                        >
                            <Text style={{color: COLOR.ORANGE,fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{showPin ? "Hide TPIN" : "Show TPIN"}</Text>
                        </TouchableOpacity> 

                        <TouchableOpacity
                            style={{paddingVertical: height * .03, alignItems: "center"}}
                            onPress={()=>navigation.navigate("ToktokWalletRecoveryMethods", {type: "TPIN", event: "enterprise"})}
                        >
                            <Text style={{color: COLOR.ORANGE,fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Forgot TPIN?</Text>
                        </TouchableOpacity> 
                       
                    </View> */}
                    {/* <View style={styles.proceedBtn}>
                            {
                                pinCode.length < 6
                                ? <DisabledButton label={btnLabel} />
                                : <YellowButton label={btnLabel} onPress={()=>{
                                    // setPinCode("")
                                    callBackFunc({pinCode , data})
                                }} />
                            }
                    </View> */}
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