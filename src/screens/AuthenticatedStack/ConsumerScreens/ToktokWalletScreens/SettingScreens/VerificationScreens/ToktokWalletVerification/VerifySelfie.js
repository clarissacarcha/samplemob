import React, { useState ,useRef , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Alert,Dimensions,Modal,Image,Platform} from 'react-native'
import {FONTS, SIZES, BUTTON_HEIGHT, COLORS} from '../../../../../../../res/constants'
import EIcon from 'react-native-vector-icons/EvilIcons'
import {VerifyContext} from './VerifyContextProvider'
import {useNavigation} from '@react-navigation/native'
import { YellowButton } from '../../../../../../../revamp'

const {width,height} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH;

const ratio = Math.min(width / CROP_AREA_WIDTH , height / CROP_AREA_HEIGHT)

const VerifySelfie = ()=> {

    const VerifyUserData = useContext(VerifyContext)
    const {setCurrentIndex , selfieImage, setSelfieImage} = VerifyUserData

    const navigation = useNavigation()

    const setImage = (data)=> {
        setSelfieImage(data);
        // setCurrentIndex(oldval => oldval + 1)
    }

    const Proceed = ()=> {
        if(selfieImage == null){
            // return navigation.push("ToktokWalletSelfieCamera", {setImage})
            return navigation.push("ToktokWalletSelfieImageCamera", {setImage})
        }
        return setCurrentIndex(oldval => oldval + 1)

    }
    
    const ImageIDSet = ()=> (
        <View style={{
            alignSelf:"center",
            marginTop: 7,
            padding: 2,
            borderStyle: "dashed",
            borderColor: COLORS.YELLOW,
            borderWidth: 2,
            borderRadius: 5,
            marginBottom: 5,
        }}>
                <Image resizeMode="cover" style={{height: CROP_AREA_HEIGHT,width: CROP_AREA_WIDTH,backgroundColor:"transparent"}} source={{uri: selfieImage.uri}} />
                <TouchableOpacity onPress={()=>navigation.push("ToktokWalletSelfieImageCamera", {setImage})} style={{position:"absolute",bottom: 15,width: 180,height: 20, justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                    <EIcon name="camera" color={COLORS.YELLOW} size={20} />
                    <Text style={{textAlign:"center",color: COLORS.YELLOW,fontFamily: FONTS.REGULAR,fontSize: SIZES.S,marginTop: -2}}>Change Photo</Text>
                </TouchableOpacity>
        </View>
    )

    return (
        <>
            <View style={styles.content}>
                <View style={styles.mainInput}>
                        <Text style={{fontSize: SIZES.M, fontFamily: FONTS.BOLD,color: COLORS.DARK}}>One last step before you get a verified toktokwallet</Text>
                        <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,color:"#929191"}}>Take a photo to verify your identity.</Text>  
                        
                       
                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: SIZES.M, fontFamily: FONTS.BOLD,color:COLORS.DARK}}>Take a selfie</Text>

                            { selfieImage 
                              ? <ImageIDSet/>
                              : <TouchableOpacity onPress={()=>{
                                    // navigation.push("ToktokWalletSelfieCamera", {setImage})
                                    navigation.push("ToktokWalletSelfieImageCamera", {setImage})
                                }} style={styles.selfieBtn}>
                                    <EIcon name="camera" color="#CCCCCC" size={25} />
                                    <Text style={{color:"#CCCCCC",marginBottom:5,fontFamily: FONTS.BOLD,fontSize: SIZES.S}}>Take a photo</Text>
                                </TouchableOpacity>
                            }
                     
                            

                            <Text style={{fontSize: SIZES.M, fontFamily: FONTS.REGULAR,color:"#929191",alignSelf:"center"}}>Show us that you match your photo ID with a selfie.</Text>
                        </View>

                        {/* <View style={{
                            flex: 1,
                            paddingVertical: 20,
                        }}> 
                             { selfieImage && <ImageIDSet/>}
                        </View> */}

                </View>

                <View style={styles.proceedBtn}>
                    <YellowButton label="Next" onPress={Proceed}/>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 50,
        width: "100%",
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
    selfieBtn: {
        height: 180,
        width: 180,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: "#F7F7FA",
        alignSelf:"center",
        marginTop: 7,
        borderStyle: "dashed",
        borderColor: "#CCCCCC",
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 10,
    }
})

export default VerifySelfie