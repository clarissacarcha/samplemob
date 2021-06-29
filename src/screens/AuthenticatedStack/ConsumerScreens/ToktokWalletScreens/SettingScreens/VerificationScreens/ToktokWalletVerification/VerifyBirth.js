import React, { useContext, useState } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Alert,TextInput} from 'react-native'
import {FONTS, SIZES, INPUT_HEIGHT, BUTTON_HEIGHT, COLORS} from '../../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {VerifyContext} from './VerifyContextProvider'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'

//SELF IMPORTS
import ModalCountry from './ModalCountry'
import { YellowButton } from '../../../../../../../revamp'


export const DateBirthModal = ({modalVisible, setModalVisible , birthInfo ,changeBirthInfo})=> {

    const minDate = new Date('1900-01-01');
    const todayDate = new Date()
    const year = todayDate.getFullYear()
    const month = todayDate.getMonth()
    const day = todayDate.getDate()
    const maxDate = todayDate
    const initialDate = new Date(year - 25, month ,day)

    const [bday,setBday] = useState(birthInfo.birthdate == "" ? initialDate : birthInfo.birthdate)

    return (
        <Modal
            visible={modalVisible}
            onRequestClose={()=>setModalVisible(false)}
            transparent={true}
        >
            <View style={styles.dateModalContent}>
                <View style={{padding: 10,backgroundColor: "white",width: "90%",justifyContent:"center",alignItems:"center",borderRadius: 5}}>
                     <DatePicker date={bday} onDateChange={(date)=>setBday(date)} mode="date" maximumDate={maxDate} minimumDate={minDate} />
                   <View style={{width: "100%", marginTop: 20}}>
                        <YellowButton label="Ok" onPress={()=>{
                                changeBirthInfo("birthdate",bday)
                                setModalVisible(false)
                        }}/>
                    </View>
                </View>   
                
            </View>

        </Modal>
    )
}

const VerifyBirth = ()=> {
    const {birthInfo,  setCurrentIndex , changeBirthInfo , setModalCountryVisible , nationality} = useContext(VerifyContext)
    const [modalVisible,setModalVisible] = useState(false)
    const [modaltype,setModaltype] = useState("")

    const Proceed = ()=>{
        if(birthInfo.birthdate == "") return Alert.alert("","Date of Birth is required.")
        if(birthInfo.birthPlace == "") return Alert.alert("","Place of Birth is required.")
        setCurrentIndex(oldval => oldval + 1)
    }

    return (
        <>
            <ModalCountry type={modaltype}/>
            <DateBirthModal modalVisible={modalVisible} setModalVisible={setModalVisible} birthInfo={birthInfo} changeBirthInfo={changeBirthInfo}/>
            <View style={styles.content}>
                <View style={styles.mainInput}>
                        <Text style={styles.labelText}>When and where were you born?</Text>
                        <Text style={[styles.labelSmall]}>Make sure the information matches your government-issued ID.</Text>  
                        <View style={{marginTop: 20,}}>
                            <Text style={styles.labelText}>Date of Birth <Text style={{color:"red"}}>*</Text></Text>
                            <TouchableOpacity onPress={()=>setModalVisible(true)} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,fontFamily: FONTS.REGULAR,color: "gray",fontSize: SIZES.M}}>{birthInfo.birthdate == "" ? "MM/DD/YY" : moment(birthInfo.birthdate).format("MM/DD/YYYY")}</Text>
                                <FIcon5 name="calendar" size={24}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={styles.labelText}>Place of Birth <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                    style={styles.input}
                                    value={birthInfo.birthPlace}
                                    onChangeText={(value)=>changeBirthInfo("birthPlace", value)}
                                    // onSubmitEditing={Proceed}
                                    placeholder={"Place of Birth"}
                                />
                            {/* <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12,fontFamily: FONTS.REGULAR}}>{birthInfo.birthPlace}</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                        setModaltype("birthinfo")
                                        setModalCountryVisible(true)
                                    }}
                                >
                                    <Text style={{color: ORANGE,fontFamily: FONTS.BOLD,fontSize: 12}}>Change</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>


                        <View style={{marginTop: 20,}}>
                            <Text style={styles.labelText}>Nationality</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{nationality}</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                        setModaltype("Nationality")
                                        setModalCountryVisible(true)
                                    }}
                                    style={{
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: COLORS.YELLOW,
                                        borderRadius: 5,
                                        height: 20
                                    }}
                                >
                                    <View style={{
                                         flex: 1,
                                         justifyContent:"center",
                                         alignItems:"center",
                                    }}>
                                        <Text style={{color: COLORS.YELLOW,fontFamily: FONTS.REGULAR,fontSize: SIZES.S}}>Change</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                </View>

                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{height: BUTTON_HEIGHT,flex: 1,marginRight: 10,backgroundColor: "#F7F7FA" , borderRadius: 5, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: "gray",fontSize: SIZES.M,fontFamily: FONTS.BOLD}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={Proceed} style={{height: BUTTON_HEIGHT,flex: 1,marginLeft: 10,backgroundColor: COLORS.YELLOW , borderRadius: 5, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: "black",fontSize: SIZES.M,fontFamily: FONTS.BOLD}}>Next</Text>
                    </TouchableOpacity>
                </View>
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
    labelSmall: {
        fontFamily: FONTS.REGULAR,
        fontSize: SIZES.S
    },
    labelText: {
        fontSize: SIZES.M, 
        fontFamily: FONTS.BOLD,
    },
    proceedBtn: {
        width: "100%",
        flexDirection: "row"
    },
    input: {
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        height: INPUT_HEIGHT
    },
    dateModalContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    }
})

export default VerifyBirth