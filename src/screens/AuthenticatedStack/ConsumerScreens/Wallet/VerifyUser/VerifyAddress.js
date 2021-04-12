import React, { useState , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView,Alert} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_LIGHT, FONT_REGULAR} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {VerifyContext} from './Context/VerifyContextProvider'
import ModalCountry from './ModalCountry'
import validator from 'validator'

const VerifyAddress = ()=> {

    const {address, setCurrentIndex , changeAddress,setModalCountryVisible} = useContext(VerifyContext)
    return (
        <>
            <ModalCountry type="address" />
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={{fontSize: 14, fontFamily: FONT_MEDIUM}}>Where do you live?</Text>
                        <Text style={{fontFamily: FONT_LIGHT,marginTop: 5,fontSize: 12}}>Please enter your current address</Text>  
               
                        <View style={{marginTop: 20,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>Country</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 11}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: 12,fontFamily: FONT_REGULAR}}>{address.country}</Text>
                                <TouchableOpacity
                                    onPress={()=>setModalCountryVisible(true)}
                                >
                                    <Text style={{color: ORANGE,fontFamily: FONT_MEDIUM,fontSize: 12}}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{marginTop: 15,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>Street Address <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="E.g 10F Inoza Tower, 40th Street"
                                value={address.streetAddress}
                                onChangeText={text=>changeAddress("streetAddress", text)}
                            />
                        </View>

                        <View style={{marginTop: 15,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>Village / Barangay <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="E.g Bonifacio Global City"
                                value={address.village}
                                onChangeText={text=>changeAddress("village", text)}
                            />
                        </View>

                        <View style={{marginTop: 15,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>City / Municipality <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="E.g Taguig City"
                                value={address.city}
                                onChangeText={text=>changeAddress("city",text)}
                            />
                        </View>

                        <View style={{marginTop: 15,}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>Region / Province <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="E.g Metro Manila"
                                value={address.region}
                                onChangeText={text=>changeAddress("region",text)}
                            />
                        </View>

                        <View style={{marginTop: 15, marginBottom: 20}}>
                            <Text style={{fontSize: 12, fontFamily: FONT_MEDIUM}}>Zip Code <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="E.g 1634"
                                value={address.zipCode}
                                onChangeText={text=>changeAddress("zipCode",text)}
                            />
                        </View>

                    </ScrollView>

                    <View style={styles.proceedBtn}>
                                <TouchableOpacity onPress={()=>{
                                    setCurrentIndex(oldval => oldval - 1)
                                }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: "transparent" ,borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                                    <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_MEDIUM}}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>{

                                    for(const [key,value] of Object.entries(address)){

                                        if (validator.isEmpty(value, {ignore_whitespace: true})) {
                                            return Alert.alert("",`Please Provide ${key.toLowerCase()}`)
                                         }
                                    }

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
        flexDirection: "row",
        marginTop: 20,
    },
    input: {
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "silver",
        marginTop: 10,
        fontSize: 12,
        fontFamily: FONT_REGULAR
    },
})

export default VerifyAddress