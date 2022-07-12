import React, { useState , useRef , useContext, useEffect } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Dimensions,Alert,Image,ScrollView,TextInput,FlatList,Platform, Linking, KeyboardAvoidingView} from 'react-native'
import EIcon from 'react-native-vector-icons/EvilIcons'
import {VerifyContext} from '../VerifyContextProvider'
import {useNavigation} from '@react-navigation/native'
import {useHeaderHeight} from '@react-navigation/stack';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ImageCropper from 'react-native-simple-image-cropper';
import { YellowButton, VectorIcon, ICON_SET } from 'src/revamp'
import validator from 'validator'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS 
import {PreviousNextButton, CustomTextInput} from 'toktokwallet/components';
import BottomSheetIDType from './BottomSheetIDType'


//HELPER
import {moderateScale} from 'toktokwallet/helper';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

const {height,width} = Dimensions.get("window")
const screen = Dimensions.get('window');

const CROP_AREA_WIDTH = width * 0.40
const CROP_AREA_HEIGHT = height * 0.12;

export const VerifyID = ()=> {

    const {
        setCurrentIndex , 
        setModalCountryVisible , 
        changeIncomeInfo,
        verifyID, 
        changeVerifyID, 
        changeVerifyIDErrors,
        verifyIDErrors,
        frontImage, 
        setFrontImage, 
        backImage, 
        setBackImage,
        isBackRequired, 
        setIsbackRequired,
        setCacheImagesList
    } = useContext(VerifyContext)
    const [isFront, setIsFront] = useState(false);
    const [isBack, setIsBack] = useState(false);
    const [cropperParams, setCropperParams] = useState({});
    const navigation = useNavigation()
    const scrollviewRef = useRef();
    const IDTypeRef = useRef()
    const headerHeight = useHeaderHeight();
    const keyboardVerticalOffset = headerHeight + getStatusBarHeight() + 10;
    

    const setImage = (data, placement)=> {
        console.log("here", data, placement)
        setCacheImagesList(state=> {
            return [...state, data.uri]
        })
        if(placement == "front") setFrontImage(data), setIsFront(false)
        else if(placement == "back") setBackImage(data), setIsBack(false)
        
    }

    // const Proceed = ()=>{
    //     if(verifyID.idType == "") return Alert.alert("","ID Type is required.")
    //     if (validator.isEmpty(verifyID.idNumber, {ignore_whitespace: true})) {
    //         return Alert.alert("","ID Number is required.")
    //     }
    //     if(frontImage == null) return Alert.alert("","Front of ID photo is required.")
    //     if(isBackRequired && backImage == null)  return Alert.alert("","Back of ID photo is required.")
    //     setCurrentIndex(oldval => oldval + 1)
    // }

    const checkFieldIsEmpty = (key, value, fieldType) => {
        let message = fieldType === 'selection' ? 'Please make a selection' : 'This is a required field';
        let errorMessage = validator.isEmpty(value, {ignore_whitespace: true}) ? message : '';
        if (value != '' && key == 'emailError' && !validator.isEmail(contactInfo.email, {ignore_whitespace: true})) {
            errorMessage = 'Email format is invalid';
        }
        changeVerifyIDErrors(key, errorMessage);

        return !errorMessage;
    };

    const Next = () => {    
        if (frontImage == null) {setIsFront(true)}
        if (backImage == null) {setIsBack(true);}
        const isIdtypeValid = checkFieldIsEmpty('idError', verifyID.idType != '' ? verifyID.idType.name : '', 'selection');
        const isIdnumberValid = !verifyID.idType.id ? true : verifyID.idType.id && verifyID.idNumber ? true : checkFieldIsEmpty('idNumberError', verifyID.idNumber)
        if (isIdtypeValid && isIdnumberValid && frontImage && backImage) {
          setCurrentIndex(oldval => oldval + 1);
        }
    };

    const Previous = () => {
        setCurrentIndex(oldval => oldval - 1);
    };

    const ChooseImage = ({placement})=> (
        <TouchableOpacity 
            onPress={()=>{
               if(verifyID.idType == "") return Next()
                navigation.push("ToktokWalletValidIDCamera",{setImage, placement: placement})
            }}
            style={styles.chooseImage}>   
                <EIcon name="camera" color="#F6841F" size={25} />
                <Text style={styles.photoText}>Take a photo</Text>
        </TouchableOpacity>
    )


    const ImageIDSet = ({placement})=> (
        <View style={styles.chooseImage}>
                {/* <Image resizeMode="cover" style={{height: CROP_AREA_HEIGHT ,width: width - 40}} source={{uri: placement == "front" ? frontImage.uri : backImage.uri}} /> */}
                <ImageCropper
                    cropAreaWidth={Platform.OS === 'ios' ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 5}
                    cropAreaHeight={Platform.OS === 'ios' ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 10}
                    containerColor="transparent"
                    areaColor="black"
                    areaOverlay={<View style={styles.overlay} />}
                    imageUri={placement == "front" ? frontImage.uri : backImage.uri}
                    setCropperParams={cropperParams => {
                        setCropperParams(cropperParams);
                    }}
                />
                <TouchableOpacity onPress={()=> {
                    console.log("setImage", setImage)
                    // if(verifyID.idType == "") return Next()
                    navigation.push("ToktokWalletValidIDCamera",{setImage, placement: placement})
                }} style={styles.changePhoto}>
                    <EIcon name="camera" color="#F6841F" size={25} />
                    <Text style={styles.changeText}>Change Photo</Text>
                </TouchableOpacity>               
        </View>
    )

    const renderImageSetOptions = () => {
        if(isBackRequired){
            return (
                <>
                <View style={styles.front}>
                    <Text style={styles.frontText}>Front of ID</Text>
                    {frontImage ? <ImageIDSet placement="front" /> : <ChooseImage placement="front" />}
                    {isFront && <Text style={styles.requiredText}>Photo is required</Text>}
                </View>
                <View style={styles.front}>
                    <Text style={styles.frontText}>Back of ID</Text>
                    {backImage ? <ImageIDSet placement="back" /> : <ChooseImage placement="back" />}
                    {isBack && <Text style={styles.requiredText}>Photo is required</Text>}
                </View>
                </>
            )
        }else if(!isBackRequired){
            return <>
                <View style={styles.frontText}>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M, alignSelf:"center"}}>Front of ID</Text>
                    {frontImage ? <ImageIDSet placement="front" /> : <ChooseImage placement="front" />}
                </View>              
                {
                    backImage &&
                    <View style={styles.frontText}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M, alignSelf:'center'}}>Back of ID</Text>
                        {backImage ? <ImageIDSet placement="back" /> : <ChooseImage placement="back" />}
                    </View>

                }
            </>
        }
    }
    const ViewPrivacyPolicy = () => {
        return Linking.openURL('https://toktok.ph/privacy-policy');
    };

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardVerticalOffset : screen.height * 0.5}
                style={{flex: 1}}>
                <ScrollView
                         style={{flex: 1}}
                         showsVerticalScrollIndicator={false}
                         keyboardShouldPersistTaps="handled"
                         ref={scrollviewRef}
                >
                        <TouchableOpacity onPress={ViewPrivacyPolicy} style={styles.policyView}>
                            <View>
                            <Image
                                style={styles.policyIcon}
                                source={require('toktokwallet/assets/icons/walletVerify.png')}
                                resizeMode="contain"
                            />
                            </View>
                            <View style={styles.privacyPolicyContainer}>
                            <Text style={styles.detailsText}>
                                All your details are protected in accordance with our{' '}
                                <Text style={styles.privacyPolicy}>Privacy Policy.</Text>
                            </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.mainInput}>
                            <Text style={styles.title}>Upload Valid ID</Text>
                            <Text style={styles.information}>Help us verify your identity with a photo of your valid government-issued ID. Make sure your valid ID is not expired.</Text>

                            <View style={{marginTop: 20}}>
                                <Text style={styles.label}>ID Type</Text>
                                <BottomSheetIDType 
                                 selectedValue={verifyID?.idType.name}
                                 changeVerifyID={changeVerifyID}
                                 changeVerifyIDErrors={changeVerifyIDErrors} 
                                 verifyIDErrors={verifyIDErrors}
                                />
                            </View>
                            {verifyID.idType != '' && (
                                <View style={{marginTop: 20}}>
                                    <Text style={styles.label}>ID Number</Text>
                                    <CustomTextInput
                                        value={verifyID.idNumber}
                                        onChangeText={value => {
                                            changeVerifyID('idNumber', value);
                                            changeVerifyIDErrors('idNumberError', '')
                                        }}
                                        maxLength={30}
                                        errorMessage={verifyIDErrors.idNumberError}
                                    />
                                </View>
                            )}
                            <View style={{flex: 1,paddingVertical: 20 }}>
                                <Text style={styles.label}>Photo of your ID</Text>
                                {renderImageSetOptions()}
                            </View>
                        </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <PreviousNextButton label="Previous" labelTwo={"Next"} hasShadow onPressNext={Next} onPressPrevious={Previous}/>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        flex: 1,
    },
    policyView: {
        flexDirection: 'row',
        backgroundColor: '#FFFCF4',
        padding: 16,
        alignItems: 'center',
    },
    policyIcon: {
        height: 21,
        width: 21,
        alignSelf: 'center',
    },
    privacyPolicyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(20),
    },
    detailsText: {
        marginHorizontal: moderateScale(10),
        fontSize: FONT_SIZE.S,
        fontFamily: FONT.REGULAR,
        color: COLOR.ORANGE,
    },
    privacyPolicy: {
        color: COLOR.ORANGE,
        fontSize: FONT_SIZE.S,
        fontFamily: FONT.SEMI_BOLD,
        textDecorationLine: 'underline',
    },
    mainInput: {
        flex: 1,
        padding: 16,
    },
    labelText: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.BOLD
    },
    label: {
        fontFamily: FONT.BOLD,
        marginBottom: moderateScale(5),
        color: '#525252',
        fontSize: FONT_SIZE.S,
      },
    title: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M,
      },
    information: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        color: '#525252',
        marginTop: 5,
    },
    proceedBtn: {
        width: "100%",
        // marginBottom: 10,
        marginTop: 20,
    },
    chooseImage:{
        flex: 1,
        marginTop: 16,
        borderRadius: 8,
        borderStyle: "dashed",
        height:  Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 5,
        width:  Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 10,
        borderWidth: 1,
        borderColor: "#F6841F",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FEFAF6",
        borderRadius: 8,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'black',
        opacity: 0.5,
      },
    front: {
        flex: 1, 
        paddingVertical: 10, 
        marginBottom: 15, 
        justifyContent: "center", 
        alignItems: "center"
    },
    frontText:{
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        alignSelf:"center"
    },
    photoText:{
        color:"#000000",
        marginTop:5,
        fontSize: FONT_SIZE.S,
        fontFamily: FONT.REGULAR
    },
    requiredText: {
        fontSize: FONT_SIZE.S,
        textAlign: 'center',
        color: COLOR.RED,
        marginTop: moderateScale(10),
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor: '#F7F7FA',
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: moderateScale(15),
    },
    selectionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    changePhoto: {
        position:"absolute",
        alignSelf:"center", 
        justifyContent:"center",
        alignItems:"center"
    },
    changeText: {
        color: COLOR.WHITE,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        marginTop: moderateScale(5),
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
    },
        shadowOpacity: 0.22,
        shadowRadius: 2,
        elevation: 3,
        backgroundColor: 'white',
    },
    selectionText: {
        flex: 1,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
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
    pickerContainer: {
        height: 50,
        flex: 1,
      },
      pickerStyle: {
        backgroundColor: 'white',
        borderColor: "silver",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
      },
      pickerDropDown: {
        backgroundColor: 'white',
        width: '100%',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: COLOR.MEDIUM,
      },
      pickerLabel: {
        alignItems: 'flex-end',
      },
      pickerItem: {
        marginLeft: 0,
      },
      pickerActiveItem: {
        alignItems: 'flex-start',
      },
})
