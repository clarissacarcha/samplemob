import React, { useState , useRef, useContext } from 'react'
import {Text,View,StyleSheet,Alert,Image,TextInput,TouchableOpacity,FlatList,TouchableHighlight} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_LIGHT, FONT_REGULAR} from '../../../../../res/constants'
import {onError} from '../../../../../util/ErrorUtility'
import countries from '../../../../../assets/JSON/countries.json'
import FIcon from 'react-native-vector-icons/Feather';
import {VerifyContext} from './Context/VerifyContextProvider'

const VerifyNationality = ()=> {

    const {nationality , setNationality , setCurrentIndex , changeBirthInfo, changeAddress} = useContext(VerifyContext)
    const [countryIndex,setCountryIndex] = useState(nationality == "" ? -1 : countries.findIndex((country)=>{return country.name === nationality}))
    const [search,setSearch] = useState(false)

    const selectCountry = (index)=> {
        setCountryIndex(index)
        setNationality(countries[index].name)
        changeBirthInfo("birthPlace",countries[index].name)
        changeAddress("country",countries[index].name)
    }

    const renderCountry = ({item,index})=> {
        return (
            <TouchableOpacity onPress={()=>selectCountry(index)} style={[styles.country,{backgroundColor: index == countryIndex ? "#FCB91A" : "transparent"}]}>
                    <Text style={{fontFamily: FONT_REGULAR, fontSize: 12, color:  index == countryIndex ? "white" : "black"}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <>
        <View style={styles.content}>

            <View style={styles.mainInput}>
                    <View style={{flexDirection:"row"}}>
                        {
                            search 
                            ? <View style={{flex: 1,borderBottomWidth: 1,flexDirection:"row"}}>
                                    <TextInput 
                                        placeholder="Search Country"
                                        style={{flex: 1,fontFamily: FONT_REGULAR}}
                                    />
                                    <TouchableOpacity onPress={()=>setSearch(!search)} style={{flexBasis:"auto",alignItems:"flex-end",justifyContent:"flex-start"}}>
                                        <FIcon name={'x'} size={30}/>
                                    </TouchableOpacity>
                              </View>
                            :<>
                                <View style={{flex: 1}}>
                                    <Text style={{fontSize: 14, fontFamily: FONT_MEDIUM}}>What's your Nationality?</Text>
                                    <Text style={{fontFamily: FONT_LIGHT,marginTop: 5,fontSize: 12}}>Please select your Country</Text>
                                </View>
                                <TouchableOpacity onPress={()=>setSearch(!search)} style={{flexBasis:"auto",alignItems:"flex-end",justifyContent:"flex-start"}}>
                                    <FIcon name={'search'} size={30}/>
                                </TouchableOpacity>
                            </>
                        }
                        
                    </View>
                 
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
                }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: "transparent" ,borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                    <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_MEDIUM}}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    if(nationality == "") return Alert.alert("Please provide Nationality")
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
        fontFamily: FONT_REGULAR,
        marginTop: 20,
    },
    country: {
        paddingVertical: 20,
        borderBottomWidth: .2,
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