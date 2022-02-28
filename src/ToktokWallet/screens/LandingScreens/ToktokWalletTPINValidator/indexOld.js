import React, { useState , useRef } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,TextInput,Dimensions,StatusBar} from 'react-native';
import { ICON_SET, VectorIcon, YellowButton , HeaderBack , HeaderTitle } from 'src/revamp'
import { AlertOverlay } from 'src/components';
import { CheckIdleState  , DisabledButton , NumberBoxes, HeaderCancel} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import { BuildingBottom } from '../../../components';


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


    return(
        <CheckIdleState>
            <View
                style={styles.container}
            >
                 <View style={styles.content}>
                    <View style={styles.tpinBody}>
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
                       
                    </View>
                    <View style={styles.proceedBtn}>
                            {
                                pinCode.length < 6
                                ? <DisabledButton label={btnLabel} />
                                : <YellowButton label={btnLabel} onPress={()=>{
                                    // setPinCode("")
                                    callBackFunc({pinCode , data})
                                }} />
                            }
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
        padding: 16,
        justifyContent: "center",
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
})