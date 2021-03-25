import React , {useRef , useState} from 'react'
import { Modal , StyleSheet , Text , View , TouchableOpacity , } from 'react-native'
import {RNCamera} from 'react-native-camera';

const ModalCamera = ({showCamera , setShowCamera , setImage , showFrontCam})=> {

    const cameraRef = useRef(null)
    const [isBarcodeRead, setIsBarcodeRead] = useState(false)

      // const barcodeRecognized = (e)=> {
    //     console.log(e)
    //     setIsBarcodeRead(true)
    //     setShowCamera(false)
    //     setIsBarcodeRead(false)
    // }

    // const onFacesDetected = (data)=> {
    //     console.log(JSON.stringify(data))
    //   }

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
            // changeVerifyID("idImage",data);
            setImage(data)
            setShowCamera(false)
          }
        } catch (error) {
            console.log(error)
        //   Alert.alert('Something went wrong with taking a picture.');
        }
      };


    return (
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
            type={showFrontCam ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
            // type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            captureAudio={false}
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
            //  onBarCodeRead={!isBarcodeRead ? barcodeRecognized : null}
            //   faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
            //   onFacesDetected={onFacesDetected}
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
}

const styles = StyleSheet.create({
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

export default ModalCamera