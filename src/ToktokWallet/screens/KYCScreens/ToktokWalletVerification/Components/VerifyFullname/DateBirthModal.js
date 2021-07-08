import React, { useContext, useState } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Alert,TextInput} from 'react-native'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { YellowButton } from 'src/revamp'

const DateBirthModal = ({modalVisible, setModalVisible , birthInfo ,changeBirthInfo})=> {

    const minDate = new Date('1900-01-01');
    const todayDate = new Date()
    const year = todayDate.getFullYear()
    const month = todayDate.getMonth()
    const day = todayDate.getDate()
    // const maxDate = todayDate
    const maxDate = moment(todayDate).subtract(18,"years") // restrict only 18yrs.old up
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


const styles = StyleSheet.create({
    dateModalContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    }
})

export default DateBirthModal