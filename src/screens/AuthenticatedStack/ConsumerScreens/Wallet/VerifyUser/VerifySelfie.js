import React, { useState ,useRef , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Alert,Dimensions,Modal,Image} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_LIGHT, FONT_REGULAR, SIZES, BUTTON_HEIGHT} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {VerifyContext} from './Context/VerifyContextProvider'
import {useNavigation} from '@react-navigation/native'

const VerifySelfie = ()=> {

    const VerifyUserData = useContext(VerifyContext)
    const {setCurrentIndex , selfieImage, setSelfieImage} = VerifyUserData

    const navigation = useNavigation()

    const setImage = (data)=> {
        setSelfieImage(data);
        // setCurrentIndex(oldval => oldval + 1)
    }

    
    const ImageIDSet = ()=> (
        <View>
                <Image resizeMode="contain" style={{height: "100%",width: "100%"}} source={{uri: selfieImage.uri}} />
        </View>
    )



    return (
        <>
            <View style={styles.content}>
                <View style={styles.mainInput}>
                        <Text style={{fontSize: SIZES.M, fontFamily: FONT_MEDIUM}}>One last step before you get a verified toktokwallet</Text>
                        <Text style={{fontFamily: FONT_LIGHT,fontSize: SIZES.S}}>Take a photo to verify your identity.</Text>  
                        
                       
                        <View style={[styles.input,{padding: 20,}]}>
                            <Text style={{fontSize: SIZES.M, fontFamily: FONT_MEDIUM}}>Take a selfie</Text>
                            <Text style={{color: 'gray',marginTop: 8,fontSize: SIZES.S,fontFamily: FONT_REGULAR}}>Show us that you match your photo ID with a selfie</Text>  

                            <TouchableOpacity onPress={()=>{
                                // navigation.push("TokTokWalletSelfieCamera", {setImage})
                                navigation.push("ToktokWalletSelfieImageCamera", {setImage})
                            }} style={[styles.input,{height: BUTTON_HEIGHT, paddingHorizontal: 10,paddingVertical: 0, borderColor: "#F6841F",justifyContent: "center",alignItems: "center",marginTop: 20,}]}>
                                {/* <Text style={{color: "#F6841F",fontSize: 12,fontFamily: FONT_MEDIUM}}>Start Now</Text> */}
                                <FIcon5 name="camera" size={18} color="#F6841F" />
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flex: 1,
                            paddingVertical: 20,
                        }}> 
                             { selfieImage && <ImageIDSet/>}
                        </View>

                </View>

                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{height: "100%",flex: 1,marginRight: 10,backgroundColor: "transparent" ,borderColor: "gray", borderWidth: 1, borderRadius: 5, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: "gray",fontSize: SIZES.M,fontFamily: FONT_MEDIUM}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{

                        if(selfieImage == null){
                            // return navigation.push("ToktokWalletSelfieCamera", {setImage})
                            return navigation.push("ToktokWalletSelfieImageCamera", {setImage})
                        }
                        return setCurrentIndex(oldval => oldval + 1)
         
    
                    }} style={{height: "100%",flex: 1,marginLeft: 10,backgroundColor: DARK , borderRadius: 5, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: SIZES.M,fontFamily: FONT_MEDIUM}}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 10,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 50,
        width: "100%",
        flexDirection: "row",
    },
    input: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "silver",
        marginTop: 20,
    },
    camera: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: "black"
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
      },
    inCapture: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: 'white',
    },
})

export default VerifySelfie