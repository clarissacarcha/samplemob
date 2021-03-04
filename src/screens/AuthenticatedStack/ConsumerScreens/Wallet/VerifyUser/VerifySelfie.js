import React, { useState ,useRef } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Alert,Dimensions,Modal,Image} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {RNCamera} from 'react-native-camera';
import ImageCropper from 'react-native-simple-image-cropper';

const VerifySelfie = ({setCurrentIndex , image, setImage})=> {

    const [showCamera,setShowCamera] = useState(false)
    const cameraRef = useRef(null)

    const takePicture = async () => {
        try {
          if (cameraRef) {
            const options = {
              quality: 0.5,
              // base64: true,
              width: 1024,
              fixOrientation: true,
            };
            const data = await cameraRef.current.takePictureAsync(options);
            setImage(data);
            setShowCamera(false)
          }
        } catch (error) {
          console.log(error)
        //   Alert.alert('Something went wrong with taking a picture.');
        }
      };

      const CameraModal = ()=> (
        <Modal
            transparent={false}
            visible={showCamera}
            style={styles.camera}
            onRequestClose={()=>{
                setShowCamera(false)
            }}
        >
            <View style={styles.cameraContainer}>
            <RNCamera
                ref={cameraRef}
                style={styles.preview}
                // type={showFrontCam ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                type={RNCamera.Constants.Type.front}
                flashMode={RNCamera.Constants.FlashMode.on}
                captureAudio={false}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
            />
                 <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        marginBottom: 20,
                    }}>
                    <TouchableOpacity onPress={() => takePicture()} style={styles.capture}>
                        <View style={styles.inCapture} />
                    </TouchableOpacity>
                </View>

    
    
            </View>

        </Modal>
    )

    const ImageIDSet = ()=> (
        <TouchableOpacity onPress={()=>setShowCamera(true)}>
                <Image style={{height: "100%",width: "100%"}} source={{uri: image.uri}} />
        </TouchableOpacity>
    )



    return (
        <>
            <CameraModal />
            <View style={styles.content}>
                <View style={styles.mainInput}>
                        <Text style={{fontSize: 14, fontWeight: '400'}}>One last step before you get a Premium Wallet!</Text>
                        <Text style={{color: 'gray',marginTop: 8,fontSize: 12}}>Take a photo to verify your identity.</Text>  
                        
                       
                        <View style={[styles.input,{padding: 20,}]}>
                            <Text style={{fontSize: 14, fontWeight: '400'}}>Take a selfie</Text>
                            <Text style={{color: 'gray',marginTop: 8,fontSize: 12}}>Show us that you match your photo ID with a live selfie</Text>  

                            <TouchableOpacity onPress={()=>setShowCamera(true)} style={[styles.input,{borderColor: "#F6841F",justifyContent: "center",alignItems: "center",marginTop: 20,}]}>
                                <Text style={{color: "#F6841F",fontSize: 12}}>Start Now</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flex: 1,
                            paddingVertical: 20,
                        }}> 
                             { image && <ImageIDSet/>}
                        </View>

                </View>

                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        // start saving to DB
                    }} style={{height: "100%",flex: 1,marginLeft: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12}}>Next</Text>
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