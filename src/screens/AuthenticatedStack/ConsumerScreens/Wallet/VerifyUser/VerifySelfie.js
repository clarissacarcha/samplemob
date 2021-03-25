import React, { useState ,useRef , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Alert,Dimensions,Modal,Image} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_LIGHT, FONT_REGULAR} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {RNCamera} from 'react-native-camera';
import ImageCropper from 'react-native-simple-image-cropper';
import {VerifyContext} from './Context/VerifyContextProvider'
import {SAVE_VERIFICATION_INFO} from '../../../../../graphql'
import {useMutation} from '@apollo/react-hooks'
import {onError} from '../../../../../util/ErrorUtility'
import {AlertOverlay} from '../../../../../components';
import {ReactNativeFile} from 'apollo-upload-client';
import {useNavigation} from '@react-navigation/native'
import ModalCamera from './ModalCamera';

const VerifySelfie = ()=> {

    const VerifyUserData = useContext(VerifyContext)
    const {setCurrentIndex , selfieImage, setSelfieImage} = VerifyUserData

    const [showCamera,setShowCamera] = useState(false)
    const cameraRef = useRef(null)

    const navigation = useNavigation()

    const [saveVerificationInfo,{data,error,loading}] = useMutation(SAVE_VERIFICATION_INFO, {
        onError: onError,
        onCompleted: (response)=> {
            navigation.navigate("TokTokWalletVerifyUser")
        }
    })

    const setImage = (data)=> {
        setSelfieImage(data);
    }

    
    const ImageIDSet = ()=> (
        <TouchableOpacity onPress={()=>setShowCamera(true)}>
                <Image resizeMode="contain" style={{height: "100%",width: "100%"}} source={{uri: selfieImage.uri}} />
        </TouchableOpacity>
    )



    return (
        <>
            <ModalCamera showCamera={showCamera} setShowCamera={setShowCamera} setImage={setImage} showFrontCam/>
            <AlertOverlay visible={loading} />
            <View style={styles.content}>
                <View style={styles.mainInput}>
                        <Text style={{fontSize: 14, fontFamily: FONT_MEDIUM}}>One last step before you get a verified toktok wallet!</Text>
                        <Text style={{fontFamily: FONT_LIGHT,marginTop: 8,fontSize: 12}}>Take a photo to verify your identity.</Text>  
                        
                       
                        <View style={[styles.input,{padding: 20,}]}>
                            <Text style={{fontSize: 14, fontFamily: FONT_MEDIUM}}>Take a selfie</Text>
                            <Text style={{color: 'gray',marginTop: 8,fontSize: 12,fontFamily: FONT_REGULAR}}>Show us that you match your photo ID with a selfie</Text>  

                            <TouchableOpacity onPress={()=>setShowCamera(true)} style={[styles.input,{borderColor: "#F6841F",justifyContent: "center",alignItems: "center",marginTop: 20,}]}>
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
                    }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: "transparent" ,borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_MEDIUM}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
         
                        if(selfieImage == null) return Alert.alert("Selfie Image is required")

                        const rnValidIDFile = new ReactNativeFile({
                            ...VerifyUserData.verifyID.idImage,
                            name: 'documentValidID.jpg',
                            type: 'image/jpeg',
                        });

                        const rnSelfieFile = new ReactNativeFile({
                            ...VerifyUserData.selfieImage,
                            name: 'documentSelfie.jpg',
                            type: 'image/jpeg'
                        })

                        saveVerificationInfo({
                            variables: {
                                input: {
                                    fullname: VerifyUserData.fullname,
                                    nationality: VerifyUserData.nationality,
                                    address: `${VerifyUserData.address.streetAddress} ${VerifyUserData.address.village} ${VerifyUserData.address.city} ${VerifyUserData.address.region}, ${VerifyUserData.address.country} ${VerifyUserData.address.zipCode}`,
                                    birthdate: VerifyUserData.birthInfo.birthdate,
                                    validIdType: VerifyUserData.verifyID.idType,
                                    validIdNumber: VerifyUserData.verifyID.idNumber,
                                    validIdCountry: VerifyUserData.verifyID.idCountry,
                                    validIdPicture: rnValidIDFile,
                                    picture: rnSelfieFile
                                }
                            }
                        })
                    }} style={{height: "100%",flex: 1,marginLeft: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 40,
        width: "100%",
        flexDirection: "row"
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