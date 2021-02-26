import React, { useState } from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE} from '../../../../../res/constants'
import EIcon from 'react-native-vector-icons/EvilIcons'

const VerifyID = ({setCurrentIndex})=> {

    return (
        <>
            <View style={styles.content}>
                <View style={styles.mainInput}>
                        <Text style={{fontSize: 18, fontWeight: '400'}}>Take a photo of your ID?</Text>
                        <Text style={{color: 'gray',marginTop: 8}}>Make sure the information matches your government-issued ID.</Text>  
                  
                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 14, fontWeight: '400'}}>Country?</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 14}]}>
                                <Text style={{flex: 1,color: "gray"}}></Text>
                                <TouchableOpacity>
                                    <Text style={{color: ORANGE,fontWeight: "bold"}}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 14, fontWeight: '400'}}>ID Type?</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray"}}>MM/DD/YY</Text>
                                <EIcon name="calendar" size={24}/>
                            </View>
                        </View>

                        <View style={{flex: 1,paddingVertical: 20}}>
                            <Text style={{fontSize: 14, fontWeight: '400'}}>Photo of your ID?</Text>
                            <TouchableOpacity style={{
                                marginTop: 10,
                                borderRadius: 5,
                                borderStyle: "dashed",
                                flex: 1,
                                width: "100%",
                                borderWidth: 2,
                                borderColor: "#FCB91A",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Text style={{color:"#FCB91A",marginBottom: 10,}}>Add a photo</Text>
                                <EIcon name="camera" color="#FCB91A" size={40} />
                            </TouchableOpacity>
                        </View> 

                </View>

                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        // if(nationality == "") return Alert.alert("Please provide Nationality")
                        setCurrentIndex(oldval => oldval + 1)
                    }} style={{height: "100%",flex: 1,marginLeft: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR}}>Next</Text>
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
        marginTop: 20,
    },
})

export default VerifyID