import React, {useState, useRef} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Dimensions,Platform} from 'react-native'
import { HeaderTitle, HeaderBack } from '../../../../../components'
import {RNCamera} from 'react-native-camera';
import { BUTTON_HEIGHT, COLOR, DARK, FONT_MEDIUM, SIZES } from '../../../../../res/constants';
import FIcon from 'react-native-vector-icons/Feather'
import ImageCropper from 'react-native-simple-image-cropper';

const {width,height} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = height * 0.40;

const ValidIDCamera = ({navigation,route})=> {

    navigation.setOptions({
        // headerLeft: ()=> <HeaderBack />,
        // headerTitle: ()=> <HeaderTitle label={["Take photo of your ID",""]}/>
        headerShown: false,
    })

    // const [image,setImage] = useState(null)
    const cameraRef = useRef(null)
    const [tempImage,setTempImage] = useState(null)
    const [cropperParams, setCropperParams] = useState({});

    const takePicture = async () => {
        try {
          if (cameraRef) {
            const options = {
              quality: 0.5,
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
        width: CROP_AREA_WIDTH,
        height: CROP_AREA_HEIGHT,
      };
    
      const cropAreaSize = {
        width: CROP_AREA_WIDTH - 60,
        height: CROP_AREA_HEIGHT - 70,
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
                uri: croppedResult,
            })
            navigation.pop()
      
          } catch (error) {
            console.log(error);
            Alert.alert('', 'Sorry, we cannot process this image. Please select another one.');
          }
      }


      if(tempImage){
          return (
        <View style={{flex: 1 ,justifyContent:"center", alignItems: "center"}}>
            <View style={{height: CROP_AREA_HEIGHT - 70, width: CROP_AREA_WIDTH - 70, borderRadius: 10}}>
                <ImageCropper
                imageUri={tempImage.uri}
                cropAreaWidth={CROP_AREA_WIDTH -70}
                cropAreaHeight={CROP_AREA_HEIGHT - 70}
                containerColor="black"
                areaColor="black"
                setCropperParams={cropperParams =>{
                    setCropperParams(cropperParams)
                }}
                />
               
            </View>

            <View style={{marginTop: 20 ,flexDirection:"row",padding: 10}}>
                <TouchableOpacity style={[styles.actionbtn, {marginRight: 5,borderColor:"gray"}]} onPress={()=>setTempImage(null)}>
                    <Text style={{fontFamily: FONT_MEDIUM,color: "gray", fontSize: SIZES.M}}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionbtn,{marginLeft: 5,backgroundColor: DARK}]} onPress={confirmPicture}>
                    <Text style={{fontFamily: FONT_MEDIUM,color: COLOR , fontSize: SIZES.M}}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>

          )
      }

      return (
        <View style={styles.container}>
             <TouchableOpacity onPress={()=>navigation.goBack()} style={{top: Platform.OS === "android" ? 20 : 40, left: 5,position:"absolute",zIndex: 1}}>
                <FIcon name="chevron-left" size={35} color={'white'} /> 
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

                                        <View style={{position:"absolute" , top : -60, flex: 1,justifyContent:"center",alignItems:"center"}}>
                                            <Text style={{fontFamily: FONT_MEDIUM, fontSize: SIZES.M , color:"white",}}>Position your ID within the frame.</Text>
                                            <Text style={{fontFamily: FONT_MEDIUM, fontSize: SIZES.M , color:"white",}}>Make sure the picture has no glare and not blur.</Text>
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
                        <View style={styles.inCapture} />
                    </TouchableOpacity>
                </View>

             </View>
        </View>
      )

    // return (
    //    <View style={styles.container}>
    //        <View style={styles.cameraContainer}>
    //             <View style={styles.cameraBox}>
    //             <RNCamera
    //                 ref={cameraRef}
    //                 style={styles.preview}
    //                 type={RNCamera.Constants.Type.back}
    //                 flashMode={RNCamera.Constants.FlashMode.off}
    //                 captureAudio={false}
    //                 androidCameraPermissionOptions={{
    //                     title: 'Permission to use camera',
    //                     message: 'We need your permission to use your camera',
    //                     buttonPositive: 'Ok',
    //                     buttonNegative: 'Cancel',
    //                 }}
    //             />
          
    //             </View>

    //             <View
    //             style={{
    //                 flexDirection: 'row',
    //                 justifyContent: 'center',
    //                 position: 'absolute',
    //                 bottom: 0,
    //                 width: '100%',
    //                 marginBottom: 20,
    //             }}>
    //             <TouchableOpacity onPress={() => takePicture()} style={styles.capture}>
    //                 <View style={styles.inCapture}>
    //                         <FAIcon5 name="camera" color="orange" size={20}/>
    //                 </View>
    //             </TouchableOpacity>
    //         </View>
    //        </View>
    //        <View style={styles.actions}>
    //             <View style={{justifyContent:"center", alignItems:"center",flex: 1}}>
    //                 <Text style={{fontFamily: FONT_MEDIUM}}>Make sure the picture has no glare and not blur.</Text>
    //             </View>
    //        </View>
    //    </View>
    // )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    cameraContainer: {
        // // flex: height * 0.80,
        // flexGrow: 1,
        // backgroundColor:"dimgray",
        // justifyContent:"center",
        // alignItems:"center"

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
        // // flex: 1,
        // height: CROP_AREA_HEIGHT,
        // width: CROP_AREA_WIDTH,
        // // justifyContent: 'flex-end',
        // // alignItems: 'center',
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
        backgroundColor: 'orange',
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
        borderWidth: 1,
        justifyContent:"center",
        alignItems:"center",
        paddingHorizontal: 10,
        borderRadius: 5,
        height: BUTTON_HEIGHT
    },
    borderEdges: {
        height: 40,
        width: 40,
        position: "absolute",
        borderColor: "#F6841F",
    }
})

export default ValidIDCamera