import React, { useState , useEffect, useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView,Alert} from 'react-native'
import {FONTS, SIZES, INPUT_HEIGHT, BUTTON_HEIGHT, COLORS} from '../../../../../../../res/constants'
import {VerifyContext} from './VerifyContextProvider'
import validator from 'validator'
import EIcon from 'react-native-vector-icons/EvilIcons'
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../../../graphql'
import { GET_CITIES } from '../../../../../../../graphql/toktokwallet/virtual'

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

    const [getCityByProvinceCode, {error, loading}] = useLazyQuery(GET_CITIES, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy: 'network-only',
        onCompleted: (response) => {
            // console.log("Clity", response)
            setCities(response.getCities.sort((a,b)=> -1))
        },
        onError: (err) => {
            console.log(err)
        }
    })

    const Proceed = ()=> {

        for(const [key,value] of Object.entries(address)){

            console.log(key)

            if(key == "provinceId" && value == null || key == "cityId" && value == null || key == "countryId" && value == null) continue;

            if (validator.isEmpty(value, {ignore_whitespace: true})) {

                let field
                switch(key.toLowerCase()){
                    case "line1":
                        field = "Street Address"
                        break
                    case "line2":
                        field = "Subdivision"
                        break
                    case "province":
                        field = "Province"
                        break
                    case "city":
                        field = "City"
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

    const onProvinceSelect = (code) => {
        getCityByProvinceCode({
            variables: {
                input: {
                    provCode: code
                }
            }
        })
    }

    useEffect(() => {
        setSelectedCity(address.city)
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
                                {/* <TouchableOpacity
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
                                </TouchableOpacity> */}
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
                            <Text style={styles.labelText}>Province</Text>
                            <TouchableOpacity  onPress={()=>setModalProvinceVisible(true)} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{address.province ? address.province : "- Select Province -"}</Text>
                                <EIcon name="chevron-right" size={24} color="#FCB91A"/>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>City</Text>
                            <TouchableOpacity onPress={()=>{
                                if(address.province == "") return Alert.alert("","Please select Province first")
                                setModalCityVisible(true)
                            }}  style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{selectedCity ? selectedCity : "- Select City -"}</Text>
                                <EIcon name={loading ? "spinner" : "chevron-right"} size={24} color="#FCB91A"/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Postal Code</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Enter postal code here"
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
