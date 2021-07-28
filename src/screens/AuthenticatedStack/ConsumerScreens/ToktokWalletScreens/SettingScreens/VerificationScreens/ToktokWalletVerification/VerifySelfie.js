import React, { useState ,useRef , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Alert,Dimensions,Modal,Image,Platform,ScrollView} from 'react-native'
import {FONTS, SIZES, BUTTON_HEIGHT, COLORS} from '../../../../../../../res/constants'
import EIcon from 'react-native-vector-icons/EvilIcons'
import {VerifyContext} from './VerifyContextProvider'
import {useNavigation} from '@react-navigation/native'
import { ICON_SET, VectorIcon, YellowButton } from '../../../../../../../revamp'
import ImageCropper from 'react-native-simple-image-cropper'
import { COLOR, FONT, FONT_SIZE } from '../../../../../../../res/variables'
import { BuildingBottom } from '../../../Components'

const {width,height} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH;

const ratio = Math.min(width / CROP_AREA_WIDTH , height / CROP_AREA_HEIGHT)

const Reminder = ({children})=> {
    return (
        <View style={{flexDirection: "row",marginVertical: 5}}>
            <View style={{padding: 2, borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1,marginRight: 10}}>
                <VectorIcon size={12} iconSet={ICON_SET.Feather} name="check"/>
            </View>
           {children}
    </View>
    )
}


const MainComponent = ({children , onPress })=> {
    return (
        <>
        <ScrollView style={styles.content}>
        <View style={styles.mainInput}>
                <Text style={{fontSize: SIZES.M, fontFamily: FONTS.BOLD,color: COLORS.DARK}}>One last step before you get a verified toktokwallet</Text>
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,color:"#929191"}}>Take a photo to verify your identity.</Text>  
                
               
                <View style={{marginTop: 20,flex: 1}}>
                <Text style={{fontSize: SIZES.M, fontFamily: FONTS.BOLD,color:COLORS.DARK}}>Take a selfie</Text>
                        {children}
                </View>
                <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{textAlign:"left",fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10,}}>Reminders</Text>
                        <View>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Position</Text> your face within the frame</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Don't</Text> wear anything covering your face</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Follow</Text> instructions</Text>
                            </Reminder>
                        </View>
                   
                </View>
               
              
            </View>
        </ScrollView>
        <View style={styles.proceedBtn}>
                    <YellowButton label="Next" onPress={onPress}/>
                </View>
        <BuildingBottom/>
        </>
    )
}

const VerifySelfie = ()=> {

    const VerifyUserData = useContext(VerifyContext)
    const {setCurrentIndex , selfieImage, setSelfieImage} = VerifyUserData
    const [cropperParams, setCropperParams] = useState({});
    const navigation = useNavigation()
    const cropSize = {
        // width: Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH + 100,
        // height: Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT + 100,
        width: CROP_AREA_WIDTH,
        height: CROP_AREA_HEIGHT,
    }
    const cropAreaSize = {
        // width: Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 20,
        // height: Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100,
        width: CROP_AREA_WIDTH,
        height: CROP_AREA_HEIGHT
    }

    const setImage = (data)=> {
        setSelfieImage(data);
        // setCurrentIndex(oldval => oldval + 1)
    }

    const Proceed = async ()=> {
        if(selfieImage == null){
            // return navigation.push("ToktokWalletSelfieCamera", {setImage})
            return navigation.push("ToktokWalletSelfieImageCamera", {setImage})
        }
        try {
            const croppedResult = await ImageCropper.crop({
                ...cropperParams,
                imageUri: selfieImage.uri,
                cropSize,
                cropAreaSize,
            });

            setSelfieImage(state => ({
                ...state,
                uri: croppedResult
            }))
        }catch(err){
            console.log(err)
        }
        return setCurrentIndex(oldval => oldval + 1)

    }

    if(selfieImage){
        return(
            <MainComponent onPress={Proceed}>
                <View style={styles.PreviewImage}>
                    <ImageCropper
                        imageUri={selfieImage.uri}
                        cropAreaWidth={Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110}
                        cropAreaHeight={Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100}
                        containerColor="transparent"
                        areaColor="black"
                        setCropperParams={cropperParams =>{
                            setCropperParams(cropperParams)
                        }}
                    />
                <TouchableOpacity onPress={()=>navigation.push("ToktokWalletSelfieImageCamera", {setImage})} style={styles.changePhoto}>
                    <EIcon name="camera" color={COLORS.YELLOW} size={20} />
                    <Text style={{textAlign:"center",color: COLORS.YELLOW,fontFamily: FONTS.REGULAR,fontSize: SIZES.S,marginTop: -2}}>Change Photo</Text>
                </TouchableOpacity>
                </View>
            </MainComponent>
        )
    }
    

    return (
        <>
        <MainComponent onPress={Proceed}>
                <TouchableOpacity onPress={()=>{
                    // navigation.push("ToktokWalletSelfieCamera", {setImage})
                    navigation.push("ToktokWalletSelfieImageCamera", {setImage})
                }} style={styles.selfieBtn}>
                    <EIcon name="camera" color="#CCCCCC" size={25} />
                    <Text style={{color:"#CCCCCC",marginBottom:5,fontFamily: FONTS.BOLD,fontSize: SIZES.S}}>Take a photo</Text>
                </TouchableOpacity>
        </MainComponent>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 70,
        width: "100%",
        padding: 16,
        marginBottom: 16,
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
    selfieBtn: {
        height: 180,
        width: 180,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: "#F7F7FA",
        alignSelf:"center",
        marginTop: 7,
        borderStyle: "dashed",
        borderColor: "#CCCCCC",
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 10,
    },
    PreviewImage: {
        height: Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100 + 10, 
        width: Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110 + 10, 
        alignSelf:"center",
        marginTop: 7,
        padding: 2,
        borderStyle: "dashed",
        borderColor: COLORS.YELLOW,
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 5,
        transform: [
            {
                scaleX: -1,
            }
        ]
    },
    changePhoto: {
        position:"absolute",
        bottom: 15,
        width: 180,
        height: 20, 
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center",  
        transform: [
        {
            scaleX: -1,
        }
    ]}
})

export default VerifySelfie