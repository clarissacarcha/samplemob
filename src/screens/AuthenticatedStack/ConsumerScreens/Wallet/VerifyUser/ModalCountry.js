import React , {useState,useContext} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
import countries from '../../../../../assets/JSON/countries.json'
import {VerifyContext} from './Context/VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import { FONT_REGULAR } from '../../../../../res/constants';



const ModalCountry = ({type})=> {
    const {modalCountryVisible,setModalCountryVisible,changeBirthInfo,changeAddress,changeVerifyID} = useContext(VerifyContext)
    const [filteredCountries,setFilteredCountries] = useState(countries)

    const selectCountry = (index) => {
        let country = filteredCountries[index].name
        if(type == "birthinfo"){
            changeBirthInfo("birthPlace", country)
        }else if(type == "address"){
            changeAddress("country", country)
        }else{
            changeVerifyID("idCountry",country)
        }
        setModalCountryVisible(false)
        setFilteredCountries(countries)
    }

    const renderCountry = ({item,index})=> {
        return (
            <TouchableOpacity onPress={()=>selectCountry(index)} style={[styles.country]}>
                    <Text style={{fontFamily: FONT_REGULAR, fontSize: 12}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const filterSearch = (value) => {
        const filtered = countries.filter(country=> country.name.toLowerCase().includes(value.toLowerCase()))
        setFilteredCountries(filtered)
    }

    return (
        <Modal
            visible={modalCountryVisible}
            onRequestClose={()=>{
                setModalCountryVisible(false)
                setFilteredCountries(countries)
            }}
            style={styles.container}
            animationType="slide"
        >
            <View style={styles.content}>
                <TouchableOpacity onPress={()=>setModalCountryVisible(false)} style={{justifyContent: "center",alignItems:"center"}}>
                    <FIcon name="chevron-down" size={20}/>
                </TouchableOpacity>
                <View style={styles.search}>
                    <TextInput 
                        placeholder="Search Country"
                        style={styles.input}
                        onChangeText={filterSearch}
                    />
                    <FIcon style={{alignSelf: "center"}} name={'search'} size={24}/>
                </View>

                <FlatList
                        style={{marginVertical: 15,}}
                        data={filteredCountries}
                        keyExtractor={country=>country.code}
                        renderItem={renderCountry}
                        showsVerticalScrollIndicator={false}
                        // scrollEnabled={true}
                />
            </View>
            
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        flex: 1,
    },
    search: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomColor: "gray",
        borderBottomWidth: 1,
    },
    input: {
        fontFamily: FONT_REGULAR,
        flex: 1,
    
    },
    country: {
        paddingVertical: 20,
        borderBottomWidth: .2,
        borderColor: "silver",
        paddingHorizontal:10,
    },
})

export default ModalCountry