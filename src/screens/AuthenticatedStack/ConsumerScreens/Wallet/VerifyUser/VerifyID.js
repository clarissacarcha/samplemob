import React, { useState , useRef , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Dimensions,Alert,Image,ScrollView,TextInput,FlatList} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_LIGHT, FONT_REGULAR, FONT_SEMIBOLD} from '../../../../../res/constants'
import EIcon from 'react-native-vector-icons/EvilIcons'
import {RNCamera} from 'react-native-camera';
import ImageCropper from 'react-native-simple-image-cropper';
import {VerifyContext} from './Context/VerifyContextProvider'
import ModalCountry from './ModalCountry'

const {height,width} = Dimensions.get("window")

const imageWidth = width - 40;

const CROP_AREA_WIDTH = imageWidth;
const CROP_AREA_HEIGHT = imageWidth;



const ValidIDModal = ({validIdModal,setValidIdModal,changeVerifyID})=> {

    const ValidIDList = [
        "Passport",
        "Driver's Licence",
        "SSS UMID Card",
        "Philhealth ID",
        "TIN Card",
        "Postal ID",
        "Voter's ID",
        "Professional Regulation Commission ID",
        "Senior Citizen ID",
        "OFW ID",
        "School ID",
    ]


    return (
        <Modal
            visible={validIdModal}
            onRequestClose={()=>setValidIdModal(false)}
            transparent={true}
        >

            <View style={{flex: 1,justifyContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.5)"}}> 
                <View style={{height: "90%", width: "85%",backgroundColor:"white",paddingVertical: 20,borderRadius: 10}}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={ValidIDList}
                        keyExtractor={item=>item}
                        renderItem={({item,index})=>{
                            return (
                                <TouchableOpacity
                                        onPress={()=> {
                                            changeVerifyID("idType", item)
                                            setValidIdModal(false)
                                        }}
                                >
                                    <Text style={{fontFamily: FONT_REGULAR,fontSize:14,padding: 15,}}>{item}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </View>

        </Modal>
    )
}


const VerifyID = ()=> {

    const {setCurrentIndex , setModalCountryVisible  , verifyID, changeVerifyID} = useContext(VerifyContext)

    const [showCamera,setShowCamera] = useState(false)
    const cameraRef = useRef(null)
    const [validIdModal,setValidIdModal] = useState(false)
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
            changeVerifyID("idImage",data);
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
                flashMode={RNCamera.Constants.FlashMode.off}
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
                height: width,
                width: "100%",
                borderWidth: 2,
                borderColor: "#FCB91A",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Text style={{color:"#FCB91A",marginBottom:5,fontFamily: FONT_SEMIBOLD}}>Add a photo</Text>
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
        <TouchableOpacity style={{marginTop: 10,width: width , height: width}} onPress={()=>setShowCamera(true)}>
                <Image resizeMode="contain" style={{height: "100%",width: "100%"}} source={{uri: verifyID.idImage.uri}} />
        </TouchableOpacity>
    )

    return (
        <>
            <CameraModal />
            <ModalCountry type="validID"/>
            <ValidIDModal validIdModal={validIdModal} setValidIdModal={setValidIdModal} changeVerifyID={changeVerifyID}/>
            <View style={styles.content}>
                <ScrollView
                         showsVerticalScrollIndicator={false}
                         style={styles.mainInput}
                >
                        <Text style={{fontSize: 14, fontFamily: FONT_MEDIUM}}>Take a photo of your ID?</Text>
                        <Text style={{fontFamily: FONT_LIGHT,marginTop: 5,fontSize: 12}}>Help us verify your identity with a photo of your valid government-issued ID, as required by local regulations.</Text>  
                  
                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>Country</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>{verifyID.idCountry}</Text>
                                <TouchableOpacity
                                    onPress={()=>setModalCountryVisible(true)}
                                >
                                    <Text style={{color: ORANGE,fontWeight: "bold",fontSize: 12,fontFamily: FONT_MEDIUM}}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{marginTop: 15,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>ID Type</Text>
                            <TouchableOpacity onPress={()=>setValidIdModal(true)} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>{verifyID.idType == "" ? "Select one" : verifyID.idType}</Text>
                                <EIcon name="chevron-down" size={24} color="#FCB91A"/>

                            </TouchableOpacity>
                            
                        </View>

                        <View style={{marginTop: 15,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>ID Number</Text>
                            <TextInput 
                                    value={verifyID.idNumber}
                                    onChangeText={text=>changeVerifyID("idNumber",text)}
                                    placeholder="0000-000"
                                    style={[styles.input,{padding: 5,paddingLeft: 10, color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}]} 
                            />
                        </View>

                        <View style={{flex: 1,paddingVertical: 25, alignItems: "center"}}>
                                <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM,alignSelf: "flex-start"}}>Photo of your ID?</Text>
                                { verifyID.idImage ? <ImageIDSet/> : <ChooseImage/> }
                        </View>

                  

                </ScrollView>

                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: "transparent" ,borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_MEDIUM}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        // if(nationality == "") return Alert.alert("Please provide Nationality")
                        setCurrentIndex(oldval => oldval + 1)
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