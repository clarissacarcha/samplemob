import React, { useState } from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'

const VerifyBirth = ({birthInfo, setCurrentIndex , changeBirthInfo})=> {
    const [bday,setBday] = useState("")

    return (
        <>
            <View style={styles.content}>
                <View style={styles.mainInput}>
                        <Text style={{fontSize: 14, fontWeight: '400'}}>When and where were you born?</Text>
                        <Text style={{color: 'gray',marginTop: 8,fontSize: 10.5}}>Make sure the information matches your government-issued ID.</Text>  
                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 12, fontWeight: '400'}}>Date of Birth?</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12}}>MM/DD/YY</Text>
                                <FIcon5 name="calendar" size={24}/>
                            </View>
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 12, fontWeight: '400'}}>Place of Birth?</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12}}>{birthInfo.birthPlace}</Text>
                                <TouchableOpacity>
                                    <Text style={{color: ORANGE,fontWeight: "bold",fontSize: 12}}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </View>

                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        // if(nationality == "") return Alert.alert("Please provide Nationality")
                        setCurrentIndex(oldval => oldval + 1)
                    }} style={{height: "100%",flex: 1,marginLeft: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12}}>Next</Text>
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
})

export default VerifyBirth