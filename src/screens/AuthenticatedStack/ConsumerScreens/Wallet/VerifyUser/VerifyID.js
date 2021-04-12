import React, { useState , useRef , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Dimensions,Alert,Image,ScrollView,TextInput,FlatList} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_LIGHT, FONT_REGULAR, FONT_SEMIBOLD} from '../../../../../res/constants'
import EIcon from 'react-native-vector-icons/EvilIcons'
import {RNCamera} from 'react-native-camera';
import ImageCropper from 'react-native-simple-image-cropper';
import {VerifyContext} from './Context/VerifyContextProvider'
import ModalCountry from './ModalCountry'
import ValidIDModal from './ValidIDModal'
import {useNavigation} from '@react-navigation/native'
import validator from 'validator'

const {height,width} = Dimensions.get("window")


const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = height * 0.35;


const VerifyID = ()=> {

    const {setCurrentIndex , setModalCountryVisible  , verifyID, changeVerifyID} = useContext(VerifyContext)
    const [validIdModal,setValidIdModal] = useState(false)
  
    const navigation = useNavigation()

    const setImage = (data)=> {
        changeVerifyID("idImage",data);
    }


    const ChooseImage = ()=> (
        <TouchableOpacity 
            onPress={()=>{
               //setShowCamera(true)
                navigation.push("TokTokWalletValidIDCamera",{setImage})
              // navigation.push('ProfileCamera', {label: ["Take","Picture"], setImage});
            }}
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


    const ImageIDSet = ()=> (
        <TouchableOpacity style={{marginTop: 10,width: CROP_AREA_WIDTH , height: CROP_AREA_HEIGHT}} onPress={()=>{
            navigation.push("TokTokWalletValidIDCamera",{setImage})
        }}>
                <Image resizeMode="contain" style={{height: CROP_AREA_HEIGHT ,width: CROP_AREA_WIDTH}} source={{uri: verifyID.idImage.uri}} />
        </TouchableOpacity>
    )


    return (
        <>
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
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>ID Type <Text style={{color:"red"}}>*</Text></Text>
                            <TouchableOpacity onPress={()=>setValidIdModal(true)} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>{verifyID.idType == "" ? "Select one" : verifyID.idType}</Text>
                                <EIcon name="chevron-down" size={24} color="#FCB91A"/>

                            </TouchableOpacity>
                            
                        </View>

                        <View style={{marginTop: 15,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>ID Number <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                    value={verifyID.idNumber}
                                    onChangeText={text=>changeVerifyID("idNumber",text)}
                                    placeholder="0000000"
                                    style={[styles.input,{padding: 5,paddingLeft: 10, color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}]} 
                            />
                        </View>

                        <View style={{flex: 1,paddingVertical: 25, alignItems: "center"}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM,alignSelf: "flex-start"}}>Photo of your ID?</Text>
                            {verifyID.idImage ? <ImageIDSet/>:  <ChooseImage/>}
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
                        if(verifyID.idType == "") return Alert.alert("","ID type is required")
                        if (validator.isEmpty(verifyID.idNumber, {ignore_whitespace: true})) {
                            return Alert.alert("","ID number is required")
                         }
                        if(verifyID.idImage == null) return Alert.alert("","Please take a picture of your valid ID")
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