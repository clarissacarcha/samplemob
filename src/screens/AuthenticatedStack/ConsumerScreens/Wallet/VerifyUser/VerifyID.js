import React, { useState , useRef } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Dimensions,Alert,Image} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE} from '../../../../../res/constants'
import EIcon from 'react-native-vector-icons/EvilIcons'
import {RNCamera} from 'react-native-camera';
import ImageCropper from 'react-native-simple-image-cropper';

const imageWidth = Dimensions.get('window').width - 40;

const CROP_AREA_WIDTH = imageWidth;
const CROP_AREA_HEIGHT = imageWidth;


const VerifyID = ({setCurrentIndex, image, setImage})=> {

    const [showCamera,setShowCamera] = useState(false)
    const cameraRef = useRef(null)
    const [cropperParams, setCropperParams] = useState({})
    const [isBarcodeRead, setIsBarcodeRead] = useState(false)

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

    // const barcodeRecognized = (e)=> {
    //     console.log(e)
    //     setIsBarcodeRead(true)
    //     setShowCamera(false)
    //     setIsBarcodeRead(false)
    // }

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
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                captureAudio={false}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
              //  onBarCodeRead={!isBarcodeRead ? barcodeRecognized : null}
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

    const ChooseImage = ()=> (
        <TouchableOpacity 
            onPress={()=>setShowCamera(true)}
            style={{
                marginTop: 10,
                borderRadius: 5,
                borderStyle: "dashed",
                flex: 1,
                width: "100%",
                borderWidth: 2,
                borderColor: "#FCB91A",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Text style={{color:"#FCB91A",marginBottom: 10,}}>Add a photo</Text>
                <EIcon name="camera" color="#FCB91A" size={40} />
        </TouchableOpacity>
    )

    // const ImageIDSet = ()=> (
    //     <>
    //     <View style={{backgroundColor: "green",flex: 1}}>
    //     <Text>{image.uri}</Text>
    //     <ImageCropper
    //         imageUri={image.uri}
    //         cropAreaWidth={CROP_AREA_WIDTH}
    //         cropAreaHeight={CROP_AREA_HEIGHT}
    //         containerColor="black"
    //         areaColor="black"
    //         setCropperParams={cropperParams => setCropperParams(cropperParams)}
    //         />
    //     </View>
    //     </>
    // )

    const ImageIDSet = ()=> (
        <TouchableOpacity style={{marginTop: 10,}} onPress={()=>setShowCamera(true)}>
                <Image style={{height: "100%",width: "100%"}} source={{uri: image.uri}} />
        </TouchableOpacity>
    )

    return (
        <>
            <CameraModal />
            <View style={styles.content}>
                <View style={styles.mainInput}>
                        <Text style={{fontSize: 14, fontWeight: '400'}}>Take a photo of your ID?</Text>
                        <Text style={{color: 'gray',marginTop: 8,fontSize: 12}}>Make sure the information matches your government-issued ID.</Text>  
                  
                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 12, fontWeight: '400'}}>Country?</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12}}></Text>
                                <TouchableOpacity>
                                    <Text style={{color: ORANGE,fontWeight: "bold",fontSize: 12}}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 12, fontWeight: '400'}}>ID Type?</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12,}}>MM/DD/YY</Text>
                                <EIcon name="calendar" size={24}/>
                            </View>
                        </View>

                        <View style={{flex: 1,paddingVertical: 20}}>
                                <Text style={{fontSize: 12, fontWeight: '400'}}>Photo of your ID?</Text>
                                { image ? <ImageIDSet/> : <ChooseImage/> }
                        </View>

                  

                </View>

                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        // if(nationality == "") return Alert.alert("Please provide Nationality")
                        setCurrentIndex(oldval => oldval + 1)
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
        marginTop: 10,
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

export default VerifyID