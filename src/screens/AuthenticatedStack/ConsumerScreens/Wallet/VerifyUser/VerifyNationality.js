import React, { useState , useRef } from 'react'
import {Text,View,StyleSheet,Alert,Image,TextInput,TouchableOpacity,FlatList,TouchableHighlight} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE} from '../../../../../res/constants'
import {onError} from '../../../../../util/ErrorUtility'
import countries from '../../../../../assets/JSON/countries.json'
import FIcon from 'react-native-vector-icons/Feather';

const VerifyNationality = ({nationality , setNationality , setCurrentIndex , changeBirthInfo, changeAddress})=> {
    const [countryIndex,setCountryIndex] = useState(nationality == "" ? -1 : countries.findIndex((country)=>{return country.name === nationality}))

    const selectCountry = (index)=> {
        setCountryIndex(index)
        setNationality(countries[index].name)
        changeBirthInfo("birthPlace",countries[index].name)
        changeAddress("country",countries[index].name)
    }

    const renderCountry = ({item,index})=> {
        return (
            <TouchableOpacity onPress={()=>selectCountry(index)} style={[styles.country,{backgroundColor: index == countryIndex ? "#FCB91A" : "transparent"}]}>
                    <Text style={{fontSize: 12, color:  index == countryIndex ? "white" : "black"}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <>
        <View style={styles.content}>

            <View style={styles.mainInput}>
                    <Text style={{fontSize: 14, fontWeight: '400'}}>What's your Nationality?</Text>
                    <Text style={{color: 'gray',marginTop: 8,fontSize: 12}}>Please select your Country</Text>
                    <FlatList
                        style={{marginVertical: 15,}}
                        data={countries}
                        keyExtractor={country=>country.code}
                        renderItem={renderCountry}
                        showsVerticalScrollIndicator={false}
                        // scrollEnabled={true}
                    >

                    </FlatList>
                
            </View>

            <View style={styles.proceedBtn}>
                <TouchableOpacity onPress={()=>{
                    setCurrentIndex(oldval => oldval - 1)
                }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                    <Text style={{color: COLOR,fontSize: 12}}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    if(nationality == "") return Alert.alert("Please provide Nationality")
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
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    progressBar: {
        height: 2,
        width: "100%",
        flexDirection: "row",
    }, 
    progressBarItem: {
        flex: 1,
    },
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
    country: {
        paddingVertical: 20,
        borderBottomWidth: .5,
        borderColor: "silver",
        paddingHorizontal:10,
    },
    button: {
        borderRadius: 10,
        marginLeft: 10,
        overflow: 'hidden',
    
        height: 30,
        width: 30,
      },
    iconBox: {
    backgroundColor: DARK,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    },
})

export default VerifyNationality