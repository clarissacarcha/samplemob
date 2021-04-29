import React, { useState , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView,Alert} from 'react-native'
import {FONTS, SIZES, INPUT_HEIGHT, BUTTON_HEIGHT, COLORS} from '../../../../../../../res/constants'
import {VerifyContext} from './VerifyContextProvider'
import validator from 'validator'

//SELF IMPORTS
import ModalCountry from './ModalCountry'

const VerifyAddress = ()=> {

    const {address, setCurrentIndex , changeAddress,setModalCountryVisible} = useContext(VerifyContext)
    

    const Proceed = ()=> {
        for(const [key,value] of Object.entries(address)){

            if (validator.isEmpty(value, {ignore_whitespace: true})) {
                let field
                switch(key.toLowerCase()){
                    case "streetaddress":
                        field = "Street Address"
                        break
                    case "village":
                        field = "Village/Barangay"
                        break
                    case "city":
                        field = "City"
                        break
                    case "region":
                        field = "Region/State"
                        break
                    case "zipcode":
                        field = "Postal Code"
                    default:
                        break
                }
                return Alert.alert("",`${field} is required.`)
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
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{address.country}</Text>
                                <TouchableOpacity
                                    onPress={()=>setModalCountryVisible(true)}
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
                            <Text style={styles.labelText}>Village/Barangay<Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Village/Barangay"
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
                            <Text style={styles.labelText}>Region/State <Text style={{color:"red"}}>*</Text></Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Region/State"
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
                                }} style={{height: BUTTON_HEIGHT,flex: 1,marginRight: 10,backgroundColor: "#F7F7FA", borderRadius: 5, justifyContent: "center",alignItems: "center"}}>
                                    <Text style={{color: "gray",fontSize: SIZES.M,fontFamily: FONTS.BOLD}}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                onPress={Proceed}
                                style={{height: BUTTON_HEIGHT,flex: 1,marginLeft: 10,backgroundColor: COLORS.YELLOW , borderRadius: 5, justifyContent: "center",alignItems: "center"}}>
                                    <Text style={{color: COLORS.DARK,fontSize: SIZES.M,fontFamily: FONTS.BOLD}}>Next</Text>
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
    proceedBtn: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 26,
        marginTop: 20,
    },
    labelText: {
        fontSize: SIZES.M,
        fontFamily: FONTS.BOLD
    },
    labelSmall: {
        fontFamily: FONTS.REGULAR,
        fontSize: SIZES.S
    },
    ViewInput: {
        marginTop: 20,
    },
    input: {
        paddingHorizontal: 10,
        height: INPUT_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontSize: SIZES.M,
        fontFamily: FONTS.REGULAR
    },
})

export default VerifyAddress