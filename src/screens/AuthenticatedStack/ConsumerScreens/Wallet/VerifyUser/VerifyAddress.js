import React, { useState , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView,Alert} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_LIGHT, FONT_REGULAR, SIZES, INPUT_HEIGHT, BUTTON_HEIGHT} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {VerifyContext} from './Context/VerifyContextProvider'
import ModalCountry from './ModalCountry'
import validator from 'validator'

const VerifyAddress = ()=> {

    const {address, setCurrentIndex , changeAddress,setModalCountryVisible} = useContext(VerifyContext)
    

    const Proceed = ()=> {
        for(const [key,value] of Object.entries(address)){

            if (validator.isEmpty(value, {ignore_whitespace: true})) {
                let field
                switch(key.toLowerCase()){
                    case "streetaddress":
                        field = "street address"
                        break
                    case "village":
                        field = "village / barangay"
                        break
                    case "city":
                        field = "city"
                        break
                    case "region":
                        field = "region"
                        break
                    case "zipcode":
                        field = "postal code"
                    default:
                        break
                }
                return Alert.alert("",`Please provide ${field}`)
             }
        }

        setCurrentIndex(oldval => oldval + 1)
    }

    return (
        <>
            <ModalCountry type="address" />
            <View style={{flex: 1,}}>
                <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
                        <Text style={styles.labelText}>Where do you live?</Text>
                        <Text style={[styles.labelSmall]}>Please enter your current address.</Text>  
               
                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Country</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONT_REGULAR}}>{address.country}</Text>
                                <TouchableOpacity
                                    onPress={()=>setModalCountryVisible(true)}
                                    style={{
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: "#F6841F",
                                        borderRadius: 2,
                                        height: INPUT_HEIGHT - 20
                                    }}
                                >
                                    <View style={{
                                         flex: 1,
                                         justifyContent:"center",
                                         alignItems:"center",
                                    }}>
                                    <Text style={{color: ORANGE,fontFamily: FONT_MEDIUM,fontSize: 12}}>Change</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Street Address <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Street / House Number / Building Number"
                                value={address.streetAddress}
                                onChangeText={text=>changeAddress("streetAddress", text)}
                                // onSubmitEditing={Proceed}
                            />
                        </View>

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Barangay <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Barangay"
                                value={address.village}
                                onChangeText={text=>changeAddress("village", text)}
                                // onSubmitEditing={Proceed}
                            />
                        </View>

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>City <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="City"
                                value={address.city}
                                onChangeText={text=>changeAddress("city",text)}
                                // onSubmitEditing={Proceed}
                            />
                        </View>

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Region / State <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Region"
                                value={address.region}
                                onChangeText={text=>changeAddress("region",text)}
                                // onSubmitEditing={Proceed}
                            />
                        </View>

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Postal Code <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Postal Code"
                                value={address.zipCode}
                                onChangeText={text=>changeAddress("zipCode",text)}
                                onSubmitEditing={Proceed}
                            />
                        </View>
                        

                        
                        <View style={styles.proceedBtn}>
                            <TouchableOpacity onPress={()=>{
                                    setCurrentIndex(oldval => oldval - 1)
                                }} style={{height: BUTTON_HEIGHT,flex: 1,marginRight: 10,backgroundColor: "transparent" ,borderColor: "gray", borderWidth: 1, borderRadius: 5, justifyContent: "center",alignItems: "center"}}>
                                    <Text style={{color: "gray",fontSize: SIZES.M,fontFamily: FONT_MEDIUM}}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                onPress={Proceed}
                                style={{height: BUTTON_HEIGHT,flex: 1,marginLeft: 10,backgroundColor: DARK , borderRadius: 5, justifyContent: "center",alignItems: "center"}}>
                                    <Text style={{color: COLOR,fontSize: SIZES.M,fontFamily: FONT_MEDIUM}}>Next</Text>
                                </TouchableOpacity>

                        </View>
            

                    </ScrollView>
                </View>
           
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 10,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 50,
        marginTop: 20,
    },
    labelText: {
        fontSize: SIZES.M,
        fontFamily: FONT_MEDIUM
    },
    labelSmall: {
        fontFamily: FONT_LIGHT,
        fontSize: SIZES.S
    },
    ViewInput: {
        marginTop: 20,
    },
    input: {
        paddingHorizontal: 10,
        height: INPUT_HEIGHT,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "silver",
        marginTop: 5,
        fontSize: SIZES.M,
        fontFamily: FONT_REGULAR
    },
})

export default VerifyAddress