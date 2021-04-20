import React, { useContext, useState } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Alert} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_LIGHT, FONT_REGULAR} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {VerifyContext} from './Context/VerifyContextProvider'
import ModalCountry from './ModalCountry'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'


const DateBirthModal = ({modalVisible, setModalVisible , birthInfo ,changeBirthInfo})=> {

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
                <View style={{padding: 20,backgroundColor: "white",width: "90%",justifyContent:"center",alignItems:"center",borderRadius: 10}}>
                     <DatePicker date={bday} onDateChange={(date)=>setBday(date)} mode="date" maximumDate={maxDate} minimumDate={minDate} />
                     <TouchableOpacity onPress={()=>{
                            changeBirthInfo("birthdate",bday)
                            setModalVisible(false)
                     }} style={{width: "100%", marginTop: 20,padding: 10,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                            <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Ok</Text>
                    </TouchableOpacity>
                </View>   
                
            </View>

        </Modal>
    )
}

const VerifyBirth = ()=> {
    const {birthInfo, setCurrentIndex , changeBirthInfo , setModalCountryVisible , nationality} = useContext(VerifyContext)
    const [modalVisible,setModalVisible] = useState(false)
    const [modaltype,setModaltype] = useState("")

    return (
        <>
            <ModalCountry type={modaltype}/>
            <DateBirthModal modalVisible={modalVisible} setModalVisible={setModalVisible} birthInfo={birthInfo} changeBirthInfo={changeBirthInfo}/>
            <View style={styles.content}>
                <View style={styles.mainInput}>
                        <Text style={{fontSize: 14, fontFamily: FONT_MEDIUM}}>When and where were you born?</Text>
                        <Text style={{fontFamily: FONT_LIGHT,marginTop: 5,fontSize: 10.5}}>Make sure the information matches your government-issued ID.</Text>  
                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>Date of Birth <Text style={{color:"red"}}>*</Text></Text>
                            <TouchableOpacity onPress={()=>setModalVisible(true)} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,fontFamily: FONT_REGULAR,color: "gray",fontSize: 12}}>{birthInfo.birthdate == "" ? "MM/DD/YY" : moment(birthInfo.birthdate).format("MM/DD/YYYY")}</Text>
                                <FIcon5 name="calendar" size={24}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>Place of Birth</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>{birthInfo.birthPlace}</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                        setModaltype("birthinfo")
                                        setModalCountryVisible(true)
                                    }}
                                >
                                    <Text style={{color: ORANGE,fontFamily: FONT_MEDIUM,fontSize: 12}}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>Nationality</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>{nationality}</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                        setModaltype("Nationality")
                                        setModalCountryVisible(true)
                                    }}
                                >
                                    <Text style={{color: ORANGE,fontFamily: FONT_MEDIUM,fontSize: 12}}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </View>

                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: "transparent" ,borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_MEDIUM}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        if(birthInfo.birthdate == "") return Alert.alert("","Please provide your date of birth")
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
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "silver",
        marginTop: 10,
    },
    dateModalContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    }
})

export default VerifyBirth