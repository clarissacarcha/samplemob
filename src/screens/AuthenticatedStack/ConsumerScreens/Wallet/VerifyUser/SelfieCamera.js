import React, {useRef,useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Dimensions,ActivityIndicator} from 'react-native'
import { HeaderTitle , HeaderBack } from '../../../../../components'
import ImageCropper from 'react-native-simple-image-cropper';
import {RNCamera} from 'react-native-camera';
import { COLOR, FONT_MEDIUM } from '../../../../../res/constants';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

const {width,height} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.60;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH;


const SelfieCamera = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={["Scan face",""]}/>
    })

    const cameraRef = useRef(null)
    const [tempImage,setTempImage] = useState(null)
    const [cropperParams, setCropperParams] = useState({});
    const [box,setBox] = useState(null)
    const [check,setCheck] = useState(false)
    const [message,setMessage] = useState({
        msg: "Position your face within the frame",
        icon: "bullseye"
    })
    const [canDetectFaces,setCanDetectFaces] = useState(null)
  
    const takePicture = () => {
        setCheck(true)
        try {
          if (cameraRef) {
            const options = {
              quality: 0.5,
              // base64: true,
              width: 1024,
              fixOrientation: true,
              orientation: "portrait"
            };
            setTimeout(async ()=>{

                const data = await cameraRef.current.takePictureAsync(options);
                route.params.setImage(data)
                navigation.pop()
    
            },200)
            // setTempImage(data)
            // navigation.pop()
          }
        } catch (error) {
            console.log(error)
        //   Alert.alert('Something went wrong with taking a picture.');
        }
      };

    const checkifInsideBox = (box)=> {
        return box.y >= 20 
        && box.x >= 20
        && (box.x + box.width + 20) < CROP_AREA_WIDTH
        && (box.y + box.height + 20) < CROP_AREA_HEIGHT
    }

    const onFacesDetected = (e)=> {
       // console.log(height / 2)
 
     setBox({
         x: e.faces[0].bounds.origin.x,
         y: e.faces[0].bounds.origin.y,
         width: e.faces[0].bounds.size.width,
         height: e.faces[0].bounds.size.height,
         rotateX: e.faces[0].yawAngle,
         rotateY: e.faces[0].rollAngle,
     })

    if(!checkifInsideBox({
        x: e.faces[0].bounds.origin.x,
        y: e.faces[0].bounds.origin.y,
        width: e.faces[0].bounds.size.width,
        height: e.faces[0].bounds.size.height,
        rotateX: e.faces[0].yawAngle,
        rotateY: e.faces[0].rollAngle,
    })){
        setMessage({
            msg: "Position your face within the frame",
            icon: "bullseye"
        })
        return 
    }

    if(e.faces[0].bounds.size.height < ((CROP_AREA_HEIGHT / 2) - 20 )){
        setMessage({
            msg: "Bring your phone closer to you",
            icon: "mobile-alt"
        })
        return 
    }


    setMessage({
        msg: `Don't move , Scanning Face`,
        icon: null
    })
    if(!check) takePicture()
  
    }

    return (
        <View style={styles.container}>
            <View style={{position:"absolute",top:0,marginTop: 50,justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontFamily: FONT_MEDIUM,fontSize: 18}}>{message.msg}</Text>
                {
                    message.icon == null
                    ? <ActivityIndicator style={{marginTop: 10}} color={COLOR} />
                    : <FIcon5 style={{marginTop: 10}} size={30} color="orange" name={message.icon}/>
                }
            </View>

            <View style={styles.cameraBox} onLayout={(event)=>{
                 const layout = event.nativeEvent.layout;
                //  setBoundary({
                //      height: layout.height,
                //      width: layout.width,
                //      x: layout.x / 2,
                //      y: layout.y / 2,
                //  })
            }}>
                {
                    box && <View style={{position:'absolute',backgroundColor:"transparent",borderWidth: 1,borderColor:"orange",zIndex:9999, width: box.width ,height: box.height,transform: [{
                        translateX: box.x,
                    }, {
                        translateY: box.y,
                    },{
                        rotateX: `${box.rotateX}deg`
                    }]}}/>
                }
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
                />

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        // justifyContent:'flex-start', // center
        // paddingTop: 50
    },
    cameraBox: {
        height: CROP_AREA_HEIGHT,
        width: CROP_AREA_WIDTH,
        borderRadius: CROP_AREA_WIDTH,
        overflow: 'hidden', // to make it circle
        backgroundColor: "black",
    },
    preview: {
        // flex: 1,
        height: CROP_AREA_HEIGHT,
        width: CROP_AREA_WIDTH,
        // justifyContent: 'flex-end',
        // alignItems: 'center',
    },
})

export default SelfieCamera
