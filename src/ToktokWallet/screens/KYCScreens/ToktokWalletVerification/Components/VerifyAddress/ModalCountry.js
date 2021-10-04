import React , {useState,useContext} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
import {VerifyContext} from '../VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import {Separator} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;

const countries = [{
    "name": "United States of America",
    "code": "USA",
    "nationality": "American",
    id: 1
}, {
    "name": "Australia",
    "code": "AUS",
    "nationality": "Australian",
    id: 2
}, {
    "name": "Philippines",
    "code": "PHI",
    "nationality": "Filipino",
    id: 3
}, {
    "name": "India",
    "code": "IND",
    "nationality": "indian",
    id: 4
}, {
    "name": "Spain",
    "code": "SPA",
    "nationality": "Spanish",
    id: 5
}]

const ModalCountry = ({type})=> {
    const {modalCountryVisible,setModalCountryVisible,changeBirthInfo,changeAddress,changeVerifyID,setNationality} = useContext(VerifyContext)
    const [filteredCountries,setFilteredCountries] = useState(countries.sort((a,b)=> -1))

    const selectCountry = (index) => {
        const country = filteredCountries[index].name
        if(type == "birthinfo"){
            changeBirthInfo("birthPlace", country)
        }else if(type == "address"){
            changeAddress("country", country)
        }else if(type == "validID"){
            changeVerifyID("idCountry",country)
        }else{
            setNationality(country)
        }   
        setModalCountryVisible(false)
        setFilteredCountries(countries)
    }

    const renderCountry = ({item,index})=> {
        return (
            <TouchableOpacity onPress={()=>selectCountry(index)} style={[styles.country]}>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.name}</Text>
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
                        placeholder="Search country"
                        style={styles.input}
                        onChangeText={filterSearch}
                    />
                    <FIcon style={{alignSelf: "center",position:"absolute", right: 25}} name={'search'} size={24}/>
                </View>
                <Separator/>

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
        flex: 1,
        marginTop: 15,
    },
    search: {
        flexDirection: "row",
        marginTop: 10,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 10,
    },
    input: {
        fontFamily: FONT.REGULAR,
        flex: 1,
        height: "100%",
        width:"100%",
        fontSize: FONT_SIZE.M,
        backgroundColor: "#F7F7FA",
        paddingLeft: 10,
        borderRadius: 5,
        color: COLOR.DARK
    },
    country: {
        height: SIZE.FORM_HEIGHT,
        justifyContent:"center",
        borderBottomWidth: .2,
        borderColor: "silver",
        paddingHorizontal:16,
    },
})

export default ModalCountry