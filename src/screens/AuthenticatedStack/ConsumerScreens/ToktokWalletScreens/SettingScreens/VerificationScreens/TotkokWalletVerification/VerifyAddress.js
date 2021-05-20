import React, { useState , useEffect, useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView,Alert} from 'react-native'
import {FONTS, SIZES, INPUT_HEIGHT, BUTTON_HEIGHT, COLORS} from '../../../../../../../res/constants'
import {VerifyContext} from './VerifyContextProvider'
import validator from 'validator'

//SELF IMPORTS
import ModalCountry from './ModalCountry'
import ModalProvince from './ModalProvince'
import ModalCity from './ModalCity'

import { YellowButton } from '../../../../../../../revamp'
import { add } from 'lodash'

const VerifyAddress = ()=> {

    const { address, setCurrentIndex, changeAddress, 
        setModalCountryVisible, 
        setModalProvinceVisible, 
        setModalCityVisible, provinceCities} = useContext(VerifyContext)
    
    const [cities, setCities] = useState([])
    const [selectedCity, setSelectedCity] = useState("")

    const Proceed = ()=> {

        for(const [key,value] of Object.entries(address)){

            if(key == "provinceId" && value == null || key == "cityId" && value == null) continue;

            if (validator.isEmpty(value, {ignore_whitespace: true})) {

                let field
                switch(key.toLowerCase()){
                    case "line1":
                        field = "Street Address"
                        break
                    case "line2":
                        field = "Village/Barangay"
                        break
                    case "city":
                        field = "City"
                        break
                    case "province":
                        field = "Region/State"
                        break
                    case "zipcode":
                        field = "Zip Code"
                    default:
                        break
                }
                return Alert.alert("",`${field} is required.`)
             }
        }

        setCurrentIndex(oldval => oldval + 1)
    }

    const onProvinceSelect = (data) => {        
        setCities(data)
        setSelectedCity(data[0]?.name || "")
    }

    useEffect(() => {
        setSelectedCity(address.city)
        console.log("City Changed", address)
    }, [address])

    return (
        <>
            <ModalCountry type="address" />
            <ModalProvince type="address" onSelect={onProvinceSelect} />
            {cities.length == 0 ? null : <ModalCity type="address" data={cities} />}
            <View style={{flex: 1,}}>
                <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
                        <Text style={styles.labelText}>Address</Text>
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
                            <Text style={styles.labelText}>Street Address</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="House/Unit #, Floor"
                                value={address.line1}
                                onChangeText={text=>changeAddress("line1", text)}
                                // onSubmitEditing={Proceed}
                            />
                        </View>

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Subdivision</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Bldg, Barangay, Subdivision/Village"
                                value={address.line2}
                                onChangeText={text=>changeAddress("line2", text)}
                                // onSubmitEditing={Proceed}
                            />
                        </View>

                        {/* <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Region/Province</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Enter region/province here"
                                value={address.region}
                                onChangeText={text=>changeAddress("region",text)}
                                // onSubmitEditing={Proceed}
                            />
                        </View>

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>City</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Enter city here"
                                value={address.city}
                                onChangeText={text=>changeAddress("city",text)}
                                // onSubmitEditing={Proceed}
                            />
                        </View> */}

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Region/Province</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{address.province}</Text>
                                <TouchableOpacity
                                    onPress={()=>setModalProvinceVisible(true)}
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
                            <Text style={styles.labelText}>City</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{selectedCity}</Text>
                                <TouchableOpacity
                                    onPress={()=>setModalCityVisible(true)}
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
                            <Text style={styles.labelText}>Zip Code</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Enter zip code here"
                                value={address.zipCode}
                                onChangeText={text=>changeAddress("zipCode",text)}
                                onSubmitEditing={Proceed}
                            />
                        </View>
                        

                        
                        <View style={styles.proceedBtn}>
                            <YellowButton label="Next" onPress={Proceed} />
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
        marginBottom: 26,
        marginTop: 20,
    },
    labelText: {
        fontSize: SIZES.M,
        fontFamily: FONTS.BOLD
    },
    labelSmall: {
        fontFamily: FONTS.REGULAR,
        fontSize: SIZES.S,
        color:"#929191"
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