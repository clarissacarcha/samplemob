import React , {useRef , useState} from 'react'
import { Modal , StyleSheet , Text , View , TouchableOpacity , } from 'react-native'
import {RNCamera} from 'react-native-camera';
import { HeaderBack , HeaderTitle } from '../../../../../components';

const SelfieImageCamera = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={["Take Selfie",""]}/>
    })

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
            route.params.setImage(data)
            navigation.pop()
          }
        } catch (error) {
            console.log(error)
        //   Alert.alert('Something went wrong with taking a picture.');
        }
      };


    return (
        <View style={styles.camera}>
        <View style={styles.cameraContainer}>
        <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={RNCamera.Constants.Type.front}
            flashMode={RNCamera.Constants.FlashMode.off}
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

    </View>
    )
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
    cameraContainer: {
         flex: 1,
        // height: 240,
        // width: 240,
        // borderRadius: 120,
        // overflow: 'hidden', // to make it circle
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

export default SelfieImageCamera