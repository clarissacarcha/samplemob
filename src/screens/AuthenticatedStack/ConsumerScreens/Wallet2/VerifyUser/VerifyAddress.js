import React, { useState } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'

const VerifyAddress = ({address, setCurrentIndex , changeAddress})=> {

    return (
        <>
            <View style={styles.content}>
       
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.mainInput}>
                <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={{fontSize: 18, fontWeight: '400'}}>Where do you live?</Text>
                        <Text style={{color: 'gray',marginTop: 8}}>Please enter your current address</Text>  
               
                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 14, fontWeight: '400'}}>Country</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 14}]}>
                                <Text style={{flex: 1,color: "gray"}}>{address.country}</Text>
                                <TouchableOpacity>
                                    <Text style={{color: ORANGE,fontWeight: "bold"}}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 14, fontWeight: '400'}}>Street Address</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="E.g 111 Street / Unit 120"
                            />
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 14, fontWeight: '400'}}>Village / Barangay</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="E.g Palo-Alto / Palao"
                            />
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 14, fontWeight: '400'}}>City / Municipality</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="E.g Calamba City / Taguig City"
                            />
                        </View>

                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 14, fontWeight: '400'}}>Region / Province</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="E.g Metro Manila / Laguna / Bulacan"
                            />
                        </View>

                        <View style={{marginTop: 20,marginBottom: 20}}>
                            <Text style={{fontSize: 14, fontWeight: '400'}}>Zip Code</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="E.g 1630"
                            />
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

                    </ScrollView>
                        
                </KeyboardAvoidingView>
   

            
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

export default VerifyAddress