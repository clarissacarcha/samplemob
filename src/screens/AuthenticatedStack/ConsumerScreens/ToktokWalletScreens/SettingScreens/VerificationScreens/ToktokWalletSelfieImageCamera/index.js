import React , {useRef , useState , useEffect} from 'react'
import { Modal , StyleSheet , Text , View , TouchableOpacity , Dimensions,Platform , ActivityIndicator} from 'react-native'
import {RNCamera} from 'react-native-camera';
import FIcon from 'react-native-vector-icons/Feather'
import { COLOR, COLORS, FONTS, FONT_MEDIUM, SIZES } from '../../../../../../../res/constants';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

const {width,height} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.65;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH;


export default ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false
    })

    const cameraRef = useRef(null)
    const [canDetectFaces,setCanDetectFaces] = useState(null)
    const [box,setBox] = useState(null)
    const [check,setCheck] = useState(false)
    const [boundary,setBoundary] = useState({
        x: 0,
        y: 0,
        height: 0,
        width: 0,
    })
    const [message,setMessage] = useState({
        msg: "Position your face within the frame",
        icon: "bullseye"
    })
    const [boxColor,setBoxColor] = useState("white")
  
    const takePicture = async () => {
        setCheck(true)
        try {
          if (cameraRef) {
            const options = {
              quality: 0.5,
              // base64: true,
              width: 1024,
              fixOrientation: true,
            };

            setTimeout(async ()=>{
                const data = await cameraRef.current.takePictureAsync(options);
                route.params.setImage(data)
                navigation.pop()
    
            },200)
          }
        } catch (error) {
            console.log(error)
        //   Alert.alert('Something went wrong with taking a picture.');
        }
      };

      const onFacesDetected = async (e)=> {

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
           setMessage({
                msg: "Position your face within the frame",
                icon: "bullseye"
            })
            return 
        }

        if(e.faces[0].bounds.size.height < ((CROP_AREA_HEIGHT - 100))){
            setMessage({
                msg: "Bring your phone closer to you",
                icon: "mobile-alt"
            })
            return 
        }else{
            setMessage({
                msg: `Don't move , Scanning Face`,
                icon: null
            })
    
            if(!check){
                setBoxColor(COLOR)
                takePicture()
            }
        }

    
     
      }
  
      const checkifOutsideBox = (boundary, result)=>{
          return result.x < boundary.x
             || (result.x + result.width) > (boundary.x + boundary.width)
             || result.y < boundary.y
             || (result.y + result.height) > (boundary.y + boundary.height)
             || result.height > boundary.height
             || result.width > boundary.width
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
                            // borderRadius: box.width,
                            position:'absolute',
                            backgroundColor:"transparent",
                            borderWidth: 1,
                            borderColor:boxColor,
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
                                <View style={[styles.borderEdges,{borderTopWidth: 5,borderLeftWidth: 5,top: 0,left: 0,}]}/>
                                <View style={[styles.borderEdges,{borderTopWidth: 5,borderRightWidth: 5,top: 0,right: 0,}]}/>
                                <View style={[styles.borderEdges,{borderBottomWidth: 5,borderLeftWidth: 5,bottom:0,left: 0,}]}/>
                                <View style={[styles.borderEdges,{borderBottomWidth: 5,borderRightWidth: 5,bottom:0,right:0,}]}/>

                

                    </View>
                </View>
                
        </RNCamera>

        <View style={styles.instructions}>
             <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.L}}>{message.msg}</Text>
                {
                    message.icon == null
                    ? <ActivityIndicator style={{marginTop: 10}} color={COLORS.YELLOW} />
                    : <FIcon5 style={{marginTop: 10}} size={30} color={COLORS.YELLOW} name={message.icon}/>
                }
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
        backgroundColor: "rgba(255,255,255,0.1)",
        position:"absolute",
    },
    preview: {
        flex: 1,
    },
    instructions: {
        height: 100,
        backgroundColor:"white",
        justifyContent:"center",
        alignItems:"center"
    },
    borderEdges: {
        height: 40,
        width: 40,
        position: "absolute",
        borderColor: "#F6841F",
    }
})
