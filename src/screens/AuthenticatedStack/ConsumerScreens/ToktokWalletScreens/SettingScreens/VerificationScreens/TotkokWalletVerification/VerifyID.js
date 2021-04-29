import React, { useState , useRef , useContext } from 'react'
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

const {height,width} = Dimensions.get("window")


const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = height * 0.35;

const ValidIDList = [
    {label: "Passport" ,value: "Passport"},
    {label: "Driver's License" ,value: "Driver's License"},
    {label: "SSS UMID Card" ,value: "SSS UMID Card"},
    {label: "Philhealth ID" ,value: "Philhealth ID"},
    {label: "TIN Card" ,value: "TIN Card"},
    {label: "Postal ID" ,value: "Postal ID"},
    {label: "Voter's ID" ,value: "Voter's ID"},
    {label: "Professional Regulation Commission ID" ,value: "Professional Regulation Commission ID"},
    {label: "Senior Citizen ID" ,value: "Senior Citizen ID"},
    {label: "OFW ID" ,value: "OFW ID"},
]


const VerifyID = ()=> {

    const {setCurrentIndex , setModalCountryVisible  , verifyID, changeVerifyID} = useContext(VerifyContext)
    const [validIDVisible,setValidIDVisible] = useState(false)
  
    const navigation = useNavigation()

    const setImage = (data)=> {
        changeVerifyID("idImage",data);
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
        if(verifyID.idImage == null) return Alert.alert("","Photo of Valid ID is required.")
        setCurrentIndex(oldval => oldval + 1)
    }


    const ChooseImage = ()=> (
        <TouchableOpacity 
            onPress={()=>{
               //setShowCamera(true)
                navigation.push("ToktokWalletValidIDCamera",{setImage})
              // navigation.push('ProfileCamera', {label: ["Take","Picture"], setImage});
            }}
            style={{
                marginTop: 5,
                borderRadius: 5,
                borderStyle: "dashed",
                height: CROP_AREA_HEIGHT,
                width: CROP_AREA_WIDTH,
                borderWidth: 2,
                borderColor: "#FCB91A",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Text style={{color:"#FCB91A",marginBottom:5,fontFamily: FONTS.BOLD}}>Add a photo</Text>
                <EIcon name="camera" color="#FCB91A" size={40} />
        </TouchableOpacity>
    )


    const ImageIDSet = ()=> (
        <TouchableOpacity style={{marginTop: 5,width: CROP_AREA_WIDTH , height: CROP_AREA_HEIGHT}} onPress={()=>{
            navigation.push("ToktokWalletValidIDCamera",{setImage})
        }}>
                <Image resizeMode="contain" style={{height: CROP_AREA_HEIGHT ,width: CROP_AREA_WIDTH}} source={{uri: verifyID.idImage.uri}} />
        </TouchableOpacity>
    )


    return (
        <>
            <ModalCountry type="validID"/>
            <ModalValidID visible={validIDVisible} setVisible={setValidIDVisible} />
            <View style={styles.content}>
                <ScrollView
                         showsVerticalScrollIndicator={false}
                         style={styles.mainInput}
                >
                        <Text style={styles.labelText}>Upload your Valid ID</Text>
                        <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S}}>Help us verify your identity with a photo of your valid government-issued ID. Make sure your valid ID is not expired.</Text>  
                  
                        <View style={{marginTop: 20,}}>
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
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={styles.labelText}>ID Type <Text style={{color:"red"}}>*</Text></Text>
                            <TouchableOpacity onPress={()=>setValidIDVisible(true)} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{verifyID.idType == "" ? "Select one" : verifyID.idType}</Text>
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
                            <Text style={styles.labelText}>ID Number <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                    value={verifyID.idNumber}
                                    onChangeText={text=>changeVerifyID("idNumber",text)}
                                    placeholder="Valid ID Number"
                                    // onSubmitEditing={Proceed}
                                    style={[styles.input,{padding: 5,paddingLeft: 10, color: "gray",fontSize: 12,fontFamily: FONTS.REGULAR}]} 
                            />
                        </View>

                        <View style={{flex: 1,paddingVertical: 20, alignItems: "center"}}>
                            <Text style={{...styles.labelText, alignSelf:"flex-start"}}>Photo of your Valid ID</Text>
                            {verifyID.idImage ? <ImageIDSet/>:  <ChooseImage/>}
                        </View>

                    <View style={styles.proceedBtn}>
                        <TouchableOpacity onPress={()=>{
                            setCurrentIndex(oldval => oldval - 1)
                        }} style={{height: BUTTON_HEIGHT,flex: 1,marginRight: 10,backgroundColor: "#F7F7FA" , borderRadius: 5, justifyContent: "center",alignItems: "center"}}>
                            <Text style={{color: "gray",fontSize: SIZES.L,fontFamily: FONTS.BOLD}}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={Proceed} style={{height: BUTTON_HEIGHT,flex: 1,marginLeft: 10,backgroundColor: COLORS.YELLOW , borderRadius: 5, justifyContent: "center",alignItems: "center"}}>
                            <Text style={{color: COLORS.DARK,fontSize: SIZES.L,fontFamily: FONTS.BOLD}}>Next</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>

               
            </View>
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
        flexDirection: "row",
        marginBottom: 10,
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