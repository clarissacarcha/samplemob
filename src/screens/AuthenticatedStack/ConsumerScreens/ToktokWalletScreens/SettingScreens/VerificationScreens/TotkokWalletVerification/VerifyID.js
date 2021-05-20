import React, { useState , useRef , useContext, useEffect } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Dimensions,Alert,Image,ScrollView,TextInput,FlatList} from 'react-native'
import { FONTS, INPUT_HEIGHT, BUTTON_HEIGHT, SIZES, COLORS} from '../../../../../../../res/constants'
import EIcon from 'react-native-vector-icons/EvilIcons'
import {VerifyContext} from './VerifyContextProvider'
import {useNavigation} from '@react-navigation/native'
import validator from 'validator'
import DropDownPicker from 'react-native-dropdown-picker';

//SELF IMPORTS 
import ModalCountry from './ModalCountry'
import ModalValidID from './ModalValidID'
import BottomSheetIDType from './BottomSheetIDType'
import { YellowButton } from '../../../../../../../revamp'

const {height,width} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = height * 0.35;

const ValidIDList = [
    {label: "Passport" ,value: "Passport", isBackRequired: 1},
    {label: "Driver's License" ,value: "Driver's License", isBackRequired: 1},
    {label: "SSS UMID Card" ,value: "SSS UMID Card", isBackRequired: 1},
    {label: "Philhealth ID" ,value: "Philhealth ID", isBackRequired: 1},
    {label: "TIN Card" ,value: "TIN Card", isBackRequired: 1},
    {label: "Postal ID" ,value: "Postal ID", isBackRequired: 1},
    {label: "Voter's ID" ,value: "Voter's ID", isBackRequired: 1},
    {label: "Professional Regulation Commission ID" ,value: "Professional Regulation Commission ID", isBackRequired: 1},
    {label: "Senior Citizen ID" ,value: "Senior Citizen ID", isBackRequired: 1},
    {label: "OFW ID" ,value: "OFW ID", isBackRequired: 1},
]


const VerifyID = ()=> {

    const {setCurrentIndex , setModalCountryVisible  , verifyID, changeVerifyID, frontImage, setFrontImage, backImage, setBackImage} = useContext(VerifyContext)
    const [validIDVisible,setValidIDVisible] = useState(false)
    const [isBackRequired, setIsbackRequired] = useState(false)

    const navigation = useNavigation()
    const IDTypeRef = useRef()

    const setImage = (data, placement)=> {
        console.log(data, placement)
        if(placement == "front") setFrontImage(data)
        else if(placement == "back") setBackImage(data)
    }

    const createFilteredValidIDs = ()=> {
        const filteredIDs = ValidIDList.sort().filter((id)=>{
            return true
        })

        return filteredIDs
    }

    const Proceed = ()=>{
        // if(nationality == "") return Alert.alert("Please provide Nationality")
        if(verifyID.idType == "") return Alert.alert("","ID Type is required.")
        if (validator.isEmpty(verifyID.idNumber, {ignore_whitespace: true})) {
            return Alert.alert("","ID Number is required.")
        }
        if(frontImage == null) return Alert.alert("","Photo of front face of your Valid ID is required.")
        if(isBackRequired && backImage == null)  return Alert.alert("","Photo of back face of your Valid ID is required.")
        // if(verifyID.idImage == null) return Alert.alert("","Photo of Valid ID is required.")
        setCurrentIndex(oldval => oldval + 1)
    }

    const ChooseImage = ({placement})=> (
        <TouchableOpacity 
            onPress={()=>{
               //setShowCamera(true)
               if(verifyID.idType == "") return Alert.alert("","Please select ID Type first")
                navigation.push("ToktokWalletValidIDCamera",{setImage, placement: placement})
              // navigation.push('ProfileCamera', {label: ["Take","Picture"], setImage});
            }}
            style={{
                marginTop: 5,
                borderRadius: 5,
                borderStyle: "dashed",
                // height: CROP_AREA_HEIGHT,
                // width: CROP_AREA_WIDTH,
                height: 175,
                width: 283,
                borderWidth: 2,
                borderColor: "#CCCCCC",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:"#F7F7FA"
            }}>
                
                <EIcon name="camera" color="#CCCCCC" size={40} />
                <Text style={{color:"#CCCCCC",marginBottom:5,fontFamily: FONTS.BOLD}}>Take a photo</Text>
        </TouchableOpacity>
    )


    const ImageIDSet = ({placement})=> (
        <View style={{
            alignSelf:"center",
            marginTop: 7,
            padding: 2,
            borderStyle: "dashed",
            borderColor: COLORS.YELLOW,
            borderWidth: 2,
            borderRadius: 5,
            marginBottom: 5,
        }} 
        // onPress={()=>{
        //     navigation.push("ToktokWalletValidIDCamera",{setImage})
        // }}
        >
                <Image resizeMode="cover" style={{height: 175 ,width: 283}} source={{uri: placement == "front" ? frontImage.uri : backImage.uri}} />
                <TouchableOpacity onPress={()=>{
                    if(verifyID.idType == "") return Alert.alert("","Please select ID Type first")
                    navigation.push("ToktokWalletValidIDCamera",{setImage, placement: placement})
                }} style={{position:"absolute",bottom: 15,width: 283,height: 20, justifyContent:"center",alignItems:"center"}}>
                    <EIcon name="camera" color={COLORS.YELLOW} size={20} />
                    <Text style={{color: COLORS.YELLOW,fontFamily: FONTS.REGULAR,fontSize: SIZES.S,marginTop: -2}}>Change Photo</Text>
                </TouchableOpacity>
        </View>
    )

    const renderImageSetOptions = () => {
        if(isBackRequired){
            return (
                <>
                <View style={{flex: 1, paddingVertical: 10, marginTop: 0}}>
                    <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>Front of ID</Text>
                    {frontImage ? <ImageIDSet placement="front" /> : <ChooseImage placement="front" />}
                </View>
                <View style={{flex: 1, paddingVertical: 5}}>
                    <Text>Back of ID</Text>
                    {backImage ? <ImageIDSet placement="back" /> : <ChooseImage placement="back" />}
                </View>
                </>
            )
        }else if(!isBackRequired){
            return <>
                <View style={{flex: 1, paddingVertical: 10, marginTop: 0}}>
                    <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>Front of ID</Text>
                    {frontImage ? <ImageIDSet placement="front" /> : <ChooseImage placement="front" />}
                </View>

                {
                    backImage &&
                    <View style={{flex: 1, paddingVertical: 5, marginTop: 0}}>
                        <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>Back of ID</Text>
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
            {/* <ModalCountry type="validID"/> */}
            {/* <ModalValidID visible={validIDVisible} setVisible={setValidIDVisible} /> */}
            <View style={styles.content}>
                <ScrollView
                         showsVerticalScrollIndicator={false}
                         style={styles.mainInput}
                >
                        <Text style={styles.labelText}>Upload your Valid ID</Text>
                        <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,color:"#929191"}}>Help us verify your identity with a photo of your valid government-issued ID. Make sure your valid ID is not expired.</Text>  
                  
                        {/* <View style={{marginTop: 20,}}>
                            <Text style={styles.labelText}>Country</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{verifyID.idCountry}</Text>
                                <TouchableOpacity
                                    onPress={()=>setModalCountryVisible(true)}
                                    style={{
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: COLORS.YELLOW,
                                        borderRadius: 2,
                                        height: 20
                                    }}
                                >
                                    <View style={{
                                         flex: 1,
                                         justifyContent:"center",
                                         alignItems:"center",
                                    }}>
                                         <Text style={{color: COLORS.YELLOW,fontSize: SIZES.S,fontFamily: FONTS.REGULAR}}>Change</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View> */}

                        <View style={{marginTop: 20,}}>
                            <Text style={styles.labelText}>ID Type</Text>
                            <TouchableOpacity onPress={()=> {
                                IDTypeRef.current.expand()
                            }} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{verifyID.idType == "" ? "Select ID type" : verifyID.idType}</Text>
                                <EIcon name="chevron-right" size={24} color="#FCB91A"/>

                            </TouchableOpacity>
                            {/* <DropDownPicker
                                // defaultValue={moment(data.scheduledFrom, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss').toString()}
                                placeholder="Select One"
                                items={ValidIDList.sort((a,b)=> a.value > b.value ? 1 : -1)}
                                containerStyle={styles.pickerContainer}
                                style={styles.pickerStyle}
                                dropDownStyle={styles.pickerDropDown}
                                arrowColor={COLOR}
                                labelStyle={styles.pickerLabel}
                                itemStyle={styles.pickerItem}
                                // activeItemStyle={styles.pickerActiveItem}
                                dropDownMaxHeight={250}
                                // isVisible={visibility.from}
                                onOpen={() => {
                                    // onOpenPicker({from: true});
                                }}
                                onChangeItem={({value}) => {
                                   changeVerifyID("idType",value)
                                }}
                                /> */}
                            
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={styles.labelText}>ID Number</Text>
                            <TextInput 
                                    value={verifyID.idNumber}
                                    onChangeText={text=>changeVerifyID("idNumber",text)}
                                    placeholder="Enter valid id number here"
                                    // onSubmitEditing={Proceed}
                                    style={[styles.input,{padding: 5,paddingLeft: 10, color: "gray",fontSize: 12,fontFamily: FONTS.REGULAR}]} 
                            />
                        </View>

                        <View style={{flex: 1,paddingVertical: 20, alignItems: "center"}}>
                            <Text style={{...styles.labelText, alignSelf:"flex-start"}}>Photo of your Valid ID</Text>
                            {/* {verifyID.idImage ? <ImageIDSet/>:  <ChooseImage/>} */}
                            {/* <View style={{flex: 1, paddingVertical: 20, marginTop: 20}}>
                                <Text>Front of ID</Text>
                                <ChooseImage />
                            </View>
                            <View style={{flex: 1, paddingVertical: 8}}>
                                <Text>Back of ID</Text>
                                <ChooseImage />
                            </View> */}
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
        fontSize: SIZES.M,
        fontFamily: FONTS.BOLD
    },
    proceedBtn: {
        width: "100%",
        // marginBottom: 10,
        marginTop: 20,
    },
    input: {
        paddingHorizontal: 10,
        height: INPUT_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontSize: SIZES.M,
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
        borderColor: COLORS.MEDIUM,
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

export default VerifyID