import React , {useRef , useState} from 'react'
import { Modal , StyleSheet , Text , View , TouchableOpacity , Dimensions,Platform} from 'react-native'
import {RNCamera} from 'react-native-camera';
import { HeaderBack , HeaderTitle } from '../../../../../components';
import FIcon from 'react-native-vector-icons/Feather'

const {width,height} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.70;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH;


const SelfieImageCamera = ({navigation,route})=> {

    navigation.setOptions({
        // headerLeft: ()=> <HeaderBack/>,
        // headerTitle: ()=> <HeaderTitle label={["Take Selfie",""]}/>
        headerShown: false
    })

    const cameraRef = useRef(null)
    const [canDetectFaces,setCanDetectFaces] = useState(null)
    const [box,setBox] = useState(null)
    const [boundary,setBoundary] = useState({
        x: 0,
        y: 0,
        height: 0,
        width: 0,
    })
  
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

      const onFacesDetected = (e)=> {

        const result = {
            x: e.faces[0].bounds.origin.x,
            y: e.faces[0].bounds.origin.y,
            width: e.faces[0].bounds.size.width,
            height: e.faces[0].bounds.size.height,
            rotateX: e.faces[0].yawAngle,
            rotateY: e.faces[0].rollAngle,
        }

        setBox(result)
        
        // const boundary = {
        //     height: CROP_AREA_HEIGHT,
        //     width: CROP_AREA_WIDTH,
        //     x:  ( width - CROP_AREA_WIDTH ) / 2,
        //     y:  ( height - 200 - CROP_AREA_HEIGHT) / 2
        // }


        if(checkifOutsideBox(boundary,result)){
           console.log("Outside the box")
        }else{
           console.log("Inside the box")
        }


        // console.log(result.x)



        // console.log(`${result.x} > (${boundary.x + boundary.width})`)


        // console.log(boundary)
      }

  
      const checkifOutsideBox = (boundary, result)=>{
          return result.x < boundary.x
             || (result.x + result.width) > (boundary.x + boundary.width)
             || result.y < boundary.y
             || (result.y + result.height) > (boundary.y + boundary.height)
        //   && result.height > boundary.height
        //   && result.width > boundary.width
      } 


    return (
        <View style={styles.camera}>

            <TouchableOpacity onPress={()=>navigation.goBack()} style={{top: Platform.OS === "android" ? 20 : 40, left: 5,position:"absolute",zIndex: 1}}>
                <FIcon name="chevron-left" size={35} color={'white'} /> 
            </TouchableOpacity>
   
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
            // faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
            // // faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
            // // faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
            onFacesDetected={canDetectFaces ? onFacesDetected : null}
            onFaceDetectionError={(err)=>{
                console.log(err)
            }}
            onCameraReady={()=>setCanDetectFaces(true)}

        >   

                    {
                        box && <View style={{
                            // borderRadius: 100,
                            position:'absolute',
                            backgroundColor:"transparent",
                            borderWidth: 1,
                            borderColor:"orange",
                            zIndex:9999, 
                            width: box.width ,
                            height: box.height,
                            transform: [{
                              translateX: box.x,
                            }, {
                            translateY: box.y,
                            },{
                            rotateX: `${box.rotateX}deg`
                        }]}}/>
                    }


                <View style={{flex: 1,justifyContent:"center",alignItems:"center",backgroundColor:"transparent"}}>
                    <View style={styles.cameraBox} onLayout={(event)=>{
                         const layout = event.nativeEvent.layout;
                         setBoundary(layout)
                    }}>

                

                    </View>
                </View>
                
        </RNCamera>

        <View style={styles.instructions}>

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
        backgroundColor: "black",
        justifyContent:"center"

    },
    cameraBox: {
        height: CROP_AREA_HEIGHT,
        width: CROP_AREA_WIDTH,
        // borderRadius: CROP_AREA_WIDTH,
        // overflow: 'hidden', // to make it circle
        backgroundColor: "rgba(255,255,255,0.3)",
        position:"absolute",
    },
    preview: {
        flex: 1,
    },
    instructions: {
        height: 200,
        backgroundColor:"white"
    }
})

export default SelfieImageCamera