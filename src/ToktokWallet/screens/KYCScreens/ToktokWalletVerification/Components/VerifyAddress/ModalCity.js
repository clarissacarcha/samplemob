import React , {useState,useEffect, useContext} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
import {VerifyContext} from '../VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import {Separator} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;

const ModalCity = ({type, data})=> {

    const [cities, setCities] = useState(data)

    const {modalCityVisible,setModalCityVisible, setCityId , setCity} = useContext(VerifyContext)
    const [filteredCities,setFilteredCities] = useState(cities)

    const selectCountry = (index) => {
        const city = filteredCities[index].citymunDesc
        const cityId = filteredCities[index].id
        setCity(city)
        setCityId(cityId)
        setModalCityVisible(false)
        setFilteredCities(cities)
    }

    const renderCountry = ({item,index})=> {
        return (
            <>
            <TouchableOpacity onPress={()=>selectCountry(index)} style={[styles.country]}>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.citymunDesc}</Text>
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
        paddingHorizontal:16,
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})

export default ModalCity