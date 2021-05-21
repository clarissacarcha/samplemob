import React , {useState,useEffect, useContext} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
// import countries from '../../../../../../../assets/JSON/countries.json'
import {VerifyContext} from './VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import {SIZES, INPUT_HEIGHT, FONTS, COLORS } from '../../../../../../../res/constants';
import { COLOR } from '../../../../../../../res/variables';
import {Separator} from '../../../Components';

const ModalCity = ({type, data})=> {

    const [cities, setCities] = useState(data)

    const {modalCityVisible,setModalCityVisible,changeBirthInfo,changeAddress,changeVerifyID,setNationality} = useContext(VerifyContext)
    const [filteredCities,setFilteredCities] = useState(cities)

    const selectCountry = (index) => {
        const city = filteredCities[index].citymunDesc
        if(type == "birthinfo"){
            changeBirthInfo("birthPlace", city)
        }else if(type == "address"){
            changeAddress("city", city)
            changeAddress("cityId", filteredCities[index].id)
        }else if(type == "validID"){
            changeVerifyID("idCountry",city)
        }else{
            setNationality(city)
        }   
        setModalCityVisible(false)
        setFilteredCities(cities)
    }

    const renderCountry = ({item,index})=> {
        return (
            <>
            <TouchableOpacity onPress={()=>selectCountry(index)} style={[styles.country]}>
                    <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>{item.citymunDesc}</Text>
            </TouchableOpacity>
            <View style={styles.divider}/>
            </>
        )
    }

    const filterSearch = (value) => {
        const filtered = cities.filter(city=> city.citymunDesc.toLowerCase().includes(value.toLowerCase()))
        setFilteredCities(filtered)
    }

    useEffect(() => {
        setCities(data)
        setFilteredCities(data)
    }, [data])

    return (
        <Modal
            visible={modalCityVisible}
            onRequestClose={()=>{
                setModalCityVisible(false)
                setFilteredCities(cities)
            }}
            style={styles.container}
            animationType="slide"
        >
            <View style={styles.content}>
                <TouchableOpacity onPress={()=>setModalCityVisible(false)} style={{justifyContent: "center",alignItems:"center"}}>
                    <FIcon name="chevron-down" size={20}/>
                </TouchableOpacity>
                <View style={styles.search}>
                    <TextInput 
                        placeholder="Search city"
                        style={styles.input}
                        onChangeText={filterSearch}
                    />
                    <FIcon style={{alignSelf: "center",position:"absolute", right: 25}} name={'search'} size={24}/>
                </View>
                <Separator/>

                <FlatList
                        style={{marginVertical: 15,}}
                        data={filteredCities}
                        keyExtractor={city=>city.id}
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
        fontFamily: FONTS.REGULAR,
        flex: 1,
        height: "100%",
        width:"100%",
        fontSize: SIZES.M,
        backgroundColor: "#F7F7FA",
        paddingLeft: 10,
        borderRadius: 5,
        color: COLORS.DARK
    },
    country: {
        height: INPUT_HEIGHT,
        justifyContent:"center",
        paddingHorizontal:16,
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})

export default ModalCity