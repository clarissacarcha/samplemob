import React, {useState, useRef} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Dimensions,Platform} from 'react-native'
import {RNCamera} from 'react-native-camera';
import FIcon from 'react-native-vector-icons/Feather'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import ImageCropper from 'react-native-simple-image-cropper';
import EIcon from 'react-native-vector-icons/EvilIcons'
import { CheckIdleState } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

const {width,height} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = height * 0.40;

const MainComponent = ({checkTimeout , children})=> {

    if(checkTimeout){
        return (
            <CheckIdleState>
                {children}
            </CheckIdleState>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export const ToktokWalletValidIDCamera = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false,
    })

    // const [image,setImage] = useState(null)
    const cameraRef = useRef(null)
    const [tempImage,setTempImage] = useState(null)
    const [cropperParams, setCropperParams] = useState({});
    const checkTimeout = route?.params?.checkTimeout ? true : false

    const takePicture = async () => {
        try {
          if (cameraRef) {
            const options = {
            //   quality: 0.5,
              quality: 1,
              // base64: true,
              width: 1024,
              fixOrientation: true,
              orientation: "portrait"
            };
            const data = await cameraRef.current.takePictureAsync(options);
          //  route.params.setImage(data)
            setTempImage(data)
            // navigation.pop()
          }
        } catch (error) {
            console.log(error)
        //   Alert.alert('Something went wrong with taking a picture.');
        }
      };

      const cropSize = {
        // height: 480,
        // width: 480,
        width: Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH + 100,
        height: Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT + 100,
        // width: CROP_AREA_WIDTH + 70,
        // height: CROP_AREA_HEIGHT + 100,
      };
    
      const cropAreaSize = {
        // width: CROP_AREA_WIDTH - 60,
        // height: CROP_AREA_HEIGHT -70,
        width: Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 20,
        height: Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100,
        // width: CROP_AREA_WIDTH - 100,
        // height: CROP_AREA_HEIGHT - 100,
      };

      const confirmPicture = async ()=> {
        try {
            const croppedResult = await ImageCropper.crop({
              ...cropperParams,
              imageUri: tempImage.uri,
              cropSize,
              cropAreaSize,
            });

            route.params.setImage({
                ...tempImage,
                uri: croppedResult
            }, route.params.placement) //front or back
            navigation.pop()
      
          } catch (error) {
            console.log(error);
            Alert.alert('', 'Sorry, we cannot process this image. Please select another one.');
          }
      }


      if(tempImage){
          return (
            <MainComponent
                checkTimeout={checkTimeout}
            >
            <View style={{flex: 1}}>
                <View style={{flex: 1,justifyContent:"center", alignItems: "center"}}>
                    {/* <View style={{height: CROP_AREA_HEIGHT - 100, width: CROP_AREA_WIDTH - 110, borderRadius: 10}}>
                        <ImageCropper
                        imageUri={tempImage.uri}
                        cropAreaWidth={CROP_AREA_WIDTH - 110}
                        cropAreaHeight={CROP_AREA_HEIGHT - 100}
                        containerColor="black"
                        areaColor="black"
                        setCropperParams={cropperParams =>{
                            setCropperParams(cropperParams)
                        }}
                        />
                    </View> */}

                    <View style={{height: Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100, width: Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110, borderRadius: 10}}>
                        <ImageCropper
                        imageUri={tempImage.uri}
                        cropAreaWidth={Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110}
                        cropAreaHeight={Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100}
                        containerColor="black"
                        areaColor="black"
                        setCropperParams={cropperParams =>{
                            setCropperParams(cropperParams)
                        }}
                        />
                    </View>


                    <View style={{marginTop: 20}}>
                        <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M }}><FIcon5 color="orange" name="check" /> Make sure the picture has no glare and not blur.</Text>
                        <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M }}><FIcon5 color="orange" name="check" /> Make sure your Valid ID is not expired.</Text>
                    </View>
                    
                </View>

                <View style={{alignItems:"flex-end",flexDirection:"row",padding: 16,height: 70}}>
                    <TouchableOpacity style={[styles.actionbtn, {marginRight: 10,backgroundColor:"#F7F7FA"}]} onPress={()=>setTempImage(null)}>
                        <Text style={{fontFamily: FONT.BOLD,color: "gray", fontSize: FONT_SIZE.M}}>Retake</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionbtn,{marginLeft: 10,backgroundColor: COLOR.YELLOW}]} onPress={confirmPicture}>
                        <Text style={{fontFamily: FONT.BOLD , fontSize: FONT_SIZE.M}}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </MainComponent>
          )
      }

      return (
        <MainComponent
            checkTimeout={checkTimeout}
        >
        <View style={styles.container}>
             <TouchableOpacity onPress={()=>navigation.pop()} style={styles.backBtn}>
                <FIcon name="chevron-left" size={20} color={'#222222'} /> 
            </TouchableOpacity>

             <View style={styles.cameraContainer}>
                <RNCamera
                    ref={cameraRef}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    captureAudio={false}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                >

                        <View style={{flex: 1,justifyContent:"center",alignItems:"center",backgroundColor:"transparent"}}>
                            <View style={styles.cameraBox}>
                                        <View style={[styles.borderEdges,{borderTopWidth: 5,borderLeftWidth: 5,top: 0,left: 0,}]}/>
                                        <View style={[styles.borderEdges,{borderTopWidth: 5,borderRightWidth: 5,top: 0,right: 0,}]}/>
                                        <View style={[styles.borderEdges,{borderBottomWidth: 5,borderLeftWidth: 5,bottom:0,left: 0,}]}/>
                                        <View style={[styles.borderEdges,{borderBottomWidth: 5,borderRightWidth: 5,bottom:0,right:0,}]}/>

                                        <View style={{position:"absolute" , bottom : -60, flex: 1,justifyContent:"center",alignItems:"center"}}>
                                            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M , color:"white",paddingHorizontal: 5,paddingVertical: 2,backgroundColor:"rgba(255,255,255,0.1)",borderRadius: 5}}>Position your ID within the frame.</Text>
                                            <Text style={{marginTop: 5,fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M , color:"white",paddingHorizontal: 5,paddingVertical: 2,backgroundColor:"rgba(255,255,255,0.1)",borderRadius: 5}}>Make sure the picture has no glare and not blur.</Text>
                                        </View>
                            </View>
                        </View>
                </RNCamera>
                
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
                        <View style={styles.inCapture}>
                            <EIcon name="camera" color={COLOR.YELLOW} size={40} />
                        </View>
                    </TouchableOpacity>
                </View>

             </View>
        </View>
        </MainComponent>
      )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    cameraContainer: {
        flex: 1,
        backgroundColor:"black"
    },
    cameraBox: {
        height: CROP_AREA_HEIGHT,
        width: CROP_AREA_WIDTH,
        backgroundColor: "rgba(255,255,255,0.1)",
        alignItems:"center"
    },
    preview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        flexBasis: 80,
    },
    capture: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: COLOR.YELLOW,
        justifyContent: 'center',
        alignItems: 'center',
      },
    inCapture: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        justifyContent:"center",
        alignItems:"center"
    },
    actionbtn: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
        paddingHorizontal: 10,
        borderRadius: 5,
        height: SIZE.FORM_HEIGHT
    },
    borderEdges: {
        height: 40,
        width: 40,
        position: "absolute",
        borderColor: COLOR.YELLOW,
    },
    backBtn: {
        backgroundColor:"#FFFFFF",
        top: Platform.OS === "android" ? 30 : 20, 
        // top: 30,
        left: 16,
        position:"absolute",
        zIndex: 1,
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 100,
        height: 35,
        width: 35,
    }
})
