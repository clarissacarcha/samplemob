import React, { useState , useEffect, useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView,Alert} from 'react-native'
import {COLOR , FONT , FONT_SIZE, SIZE } from '../../../../../../../res/variables'
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

const VerifyAddress = ()=> {

    const { 
        address, 
        setCurrentIndex, 
        changeAddress, 
        setModalCountryVisible, 
        setModalProvinceVisible, 
        setModalCityVisible, 
        provinceCities,
        province,
        provinceId,
        city,
        setCity,
        cityId,
        setCityId,
    } = useContext(VerifyContext)
    
    const [cities, setCities] = useState([])
    const [selectedCity, setSelectedCity] = useState("")

    const [getCityByProvinceCode, {error, loading}] = useLazyQuery(GET_CITIES, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy: 'network-only',
        onCompleted: (response) => {
            // console.log("Clity", response)
            setCities(response.getCities)
        },
        onError: (err) => {
            console.log(err)
        }
    })

    const Proceed = ()=> {


        if(address.line1 == "") return Alert.alert("","Street Address is required.")
        if(address.line2 == "") return Alert.alert("","Subdivision is required.")
        if(provinceId == "") return Alert.alert("","Province is required.")
        if(cityId == "") return Alert.alert("","City is required.")
        if(address.postalCode == "") return Alert.alert("","Postal code is required.")

        setCurrentIndex(oldval => oldval + 1)
    }

    const onProvinceSelect = (code) => {
        changeAddress("city", "")
        getCityByProvinceCode({
            variables: {
                input: {
                    provCode: code
                }
            }
        })        
    }

    useEffect(() => {
        setSelectedCity(city)
    }, [city])

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
                                {
                                    address.country
                                    ? <Text style={{flex: 1,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{address.country}</Text>
                                    : <Text style={{flex: 1,color: COLOR.FONT_SIZE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>- Select Country -</Text>
                                }
                             
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
                                    <Text style={{color: COLORS.YELLOW,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S}}>Change</Text>
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


                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Province</Text>
                            <TouchableOpacity  onPress={()=>setModalProvinceVisible(true)} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                {
                                    province
                                    ?  <Text style={{flex: 1,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{province}</Text>
                                    :  <Text style={{flex: 1,color: COLOR.FONT_SIZE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>- Select Province -</Text>
                                }
                                <EIcon name="chevron-right" size={24} color="#FCB91A"/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>City</Text>
                            <TouchableOpacity onPress={()=>{
                                if(province == "") return Alert.alert("","Please select Province first")
                                setModalCityVisible(true)
                            }}  style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                {
                                    selectedCity
                                    ?  <Text style={{flex: 1,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{selectedCity}</Text>
                                    :  <Text style={{flex: 1,color: COLOR.FONT_SIZE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>- Select City -</Text>
                                }
                                <EIcon name={loading ? "spinner" : "chevron-right"} size={24} color="#FCB91A"/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ViewInput}>
                            <Text style={styles.labelText}>Postal Code</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Enter postal code here"
                                value={address.postalCode}
                                onChangeText={text=>changeAddress("postalCode",text)}
                                onSubmitEditing={Proceed}
                            />
                        </View>
                        
                        <View style={styles.proceedBtn}>
                            <YellowButton label="Next" onPress={Proceed} />
                        </View>

                        <Text></Text>
          

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
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.BOLD
    },
    labelSmall: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        color:"#929191"
    },
    ViewInput: {
        marginTop: 20,
    },
    input: {
        paddingHorizontal: 10,
        height: SIZE.FORM_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR
    },
})

export default VerifyAddress