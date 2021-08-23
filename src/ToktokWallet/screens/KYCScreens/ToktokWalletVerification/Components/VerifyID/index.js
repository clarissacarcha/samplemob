import React, { useState , useRef , useContext, useEffect } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Dimensions,Alert,Image,ScrollView,TextInput,FlatList,Platform} from 'react-native'
import EIcon from 'react-native-vector-icons/EvilIcons'
import {VerifyContext} from '../VerifyContextProvider'
import {useNavigation} from '@react-navigation/native'
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp'
import validator from 'validator'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS 
import BottomSheetIDType from './BottomSheetIDType'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

const {height,width} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = height * 0.40;

export const VerifyID = ()=> {

    const {
        setCurrentIndex , 
        setModalCountryVisible , 
        verifyID, 
        changeVerifyID, 
        frontImage, 
        setFrontImage, 
        backImage, 
        setBackImage,
        isBackRequired, 
        setIsbackRequired
    } = useContext(VerifyContext)

    const navigation = useNavigation()
    const IDTypeRef = useRef()

    const setImage = (data, placement)=> {
        console.log(data, placement)
        if(placement == "front") setFrontImage(data)
        else if(placement == "back") setBackImage(data)
    }

    const Proceed = ()=>{
        if(verifyID.idType == "") return Alert.alert("","ID Type is required.")
        if (validator.isEmpty(verifyID.idNumber, {ignore_whitespace: true})) {
            return Alert.alert("","ID Number is required.")
        }
        if(frontImage == null) return Alert.alert("","Front of ID photo is required.")
        if(isBackRequired && backImage == null)  return Alert.alert("","Back of ID photo is required.")
        setCurrentIndex(oldval => oldval + 1)
    }

    const ChooseImage = ({placement})=> (
        <TouchableOpacity 
            onPress={()=>{
               if(verifyID.idType == "") return Alert.alert("","Please select ID Type first")
                navigation.push("ToktokWalletValidIDCamera",{setImage, placement: placement})
            }}
            style={{
                marginTop: 5,
                borderRadius: 5,
                borderStyle: "dashed",
                // height: 175,
                // width: 283,
                height:  Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100,
                width:  Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110,
                borderWidth: 2,
                borderColor: "#CCCCCC",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:"#F7F7FA"
            }}>
                
                <EIcon name="camera" color="#CCCCCC" size={40} />
                <Text style={{color:"#CCCCCC",marginBottom:5,fontFamily: FONT.BOLD}}>Take a photo</Text>
        </TouchableOpacity>
    )


    const ImageIDSet = ({placement})=> (
        <View style={{
            alignSelf:"center",
            marginTop: 7,
            padding: 2,
            borderStyle: "dashed",
            borderColor: COLOR.YELLOW,
            borderWidth: 2,
            borderRadius: 5,
            marginBottom: 5,
            height:  Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100,
            width:  Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110,
        }} 
        >
                {/* <Image resizeMode="cover" style={{height: CROP_AREA_HEIGHT ,width: width - 40}} source={{uri: placement == "front" ? frontImage.uri : backImage.uri}} /> */}
                <Image resizeMode="stretch" 
                    style={{
                        height:  Platform.OS === "ios" ? CROP_AREA_HEIGHT - 10 : CROP_AREA_HEIGHT - 110,
                        width:  Platform.OS === "ios" ? CROP_AREA_WIDTH - 10 : CROP_AREA_WIDTH - 120,
                    }} 
                    source={{uri: placement == "front" ? frontImage.uri : backImage.uri}} 
                />
                <TouchableOpacity onPress={()=>{
                    if(verifyID.idType == "") return Alert.alert("","Please select ID Type first")
                    navigation.push("ToktokWalletValidIDCamera",{setImage, placement: placement})
                }} style={{position:"absolute",alignSelf:"center", bottom: 15,width: 283,height: 20, justifyContent:"center",alignItems:"center"}}>
                    <EIcon name="camera" color={COLOR.YELLOW} size={20} />
                    <Text style={{color: COLOR.YELLOW,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,marginTop: -2}}>Change Photo</Text>
                </TouchableOpacity>
        </View>
    )

    const renderImageSetOptions = () => {
        if(isBackRequired){
            return (
                <>
                <View style={{flex: 1, paddingVertical: 10, marginTop: 0}}>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Front of ID</Text>
                    {frontImage ? <ImageIDSet placement="front" /> : <ChooseImage placement="front" />}
                </View>
                <View style={{flex: 1, paddingVertical: 5}}>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Back of ID</Text>
                    {backImage ? <ImageIDSet placement="back" /> : <ChooseImage placement="back" />}
                </View>
                </>
            )
        }else if(!isBackRequired){
            return <>
                <View style={{flex: 1, paddingVertical: 10, marginTop: 0}}>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Front of ID</Text>
                    {frontImage ? <ImageIDSet placement="front" /> : <ChooseImage placement="front" />}
                </View>

                {
                    backImage &&
                    <View style={{flex: 1, paddingVertical: 5, marginTop: 0}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Back of ID</Text>
                        {backImage ? <ImageIDSet placement="back" /> : <ChooseImage placement="back" />}
                    </View>

                }
            </>
        }
    }

    const onSelectIdType = (card) => {
        setFrontImage(null)
        setBackImage(null)
        setIsbackRequired(card.isBackRequired == 1)
    }

    return (
        <>

            <View style={styles.content}>
                <ScrollView
                         showsVerticalScrollIndicator={false}
                         style={styles.mainInput}
                >
                        <Text style={styles.labelText}>Upload your Valid ID</Text>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#929191"}}>Help us verify your identity with a photo of your valid government-issued ID. Make sure your valid ID is not expired.</Text>  

                        <View style={{marginTop: 20,}}>
                            <Text style={styles.labelText}>ID Type</Text>
                            <TouchableOpacity onPress={()=> {
                                IDTypeRef.current.expand()
                            }} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                {
                                    verifyID.idType == ""
                                    ? <Text style={{flex: 1,color: COLOR.DARK,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Select ID Type</Text>
                                    : <Text style={{flex: 1,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{verifyID.idType}</Text>
                                }
                                <EIcon name="chevron-right" size={24} color="#FCB91A"/>

                            </TouchableOpacity>
              
                            
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={styles.labelText}>ID Number</Text>
                            <TextInput 
                                    value={verifyID.idNumber}
                                    onChangeText={text=>changeVerifyID("idNumber",text)}
                                    placeholder="Enter valid id number here"
                                    // onSubmitEditing={Proceed}
                                    style={[styles.input,{padding: 5,paddingLeft: 10,fontSize: 12,fontFamily: FONT.REGULAR}]} 
                                    returnKeyType="done"
                            />
                        </View>

                        <View style={{flex: 1,paddingVertical: 20, alignItems: "center"}}>
                            <Text style={{...styles.labelText, alignSelf:"flex-start"}}>Photo of your Valid ID</Text>
                            {renderImageSetOptions()}
                        </View>

                    <View style={styles.proceedBtn}>
                        <YellowButton label="Next" onPress={Proceed} />
                    </View>
               
                </ScrollView>

               
            </View>
            <BottomSheetIDType ref={IDTypeRef} onChange={(onSelectIdType)} />

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
    labelText: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.BOLD
    },
    proceedBtn: {
        width: "100%",
        // marginBottom: 10,
        marginTop: 20,
    },
    input: {
        paddingHorizontal: 10,
        height: SIZE.FORM_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
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
