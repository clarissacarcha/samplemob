import React , {useState,useEffect, useContext} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
import {VerifyContext} from '../VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import {SearchInput, NoData} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;

const ModalCity = ({type, data})=> {

    const [cities, setCities] = useState(data)

    const {modalCityVisible,setModalCityVisible, setCityId , setCity, changeVerifyAddressErrors} = useContext(VerifyContext)
    const [filteredCities,setFilteredCities] = useState(cities)

    const selectCountry = (index) => {
        const city = filteredCities[index].citymunDesc
        const cityId = filteredCities[index].id
        setCity(city)
        setCityId(cityId)
        setModalCityVisible(false)
        setFilteredCities(cities)
        changeVerifyAddressErrors('cityError', '');
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
             <View style={[styles.content, {marginTop: Platform.OS === 'ios' ? getStatusbarHeight : moderateScale(15)}]}>
                <View style={{flexDirection: 'row', marginHorizontal: 16}}>
                    <TouchableOpacity onPress={() => setModalCityVisible(false)} style={styles.center}>
                        <FIcon name="chevron-left" size={16} color={COLOR.ORANGE} />
                    </TouchableOpacity>
                    <SearchInput
                        containerStyle={styles.search}
                        placeholder="Search your city"
                        placeholderTextColor={'#525252'}
                        onChangeText={filterSearch}
                        // search={search}
                        onClear={() => setSearch('')}
                    />
                </View>
                <FlatList
                    style={{marginVertical: 15}}
                    data={filteredCities}
                    keyExtractor={city=>city.id}
                    renderItem={renderCountry}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => {
                        return <NoData type="search" title="No Results Found" label="Try to search something similar." />;
                    }}
                    contentContainerStyle={{flexGrow: 1, marginBottom: getStatusbarHeight}}
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
        marginLeft: 16,
        flex: 1,
    },
    input: {
        fontFamily: FONT.REGULAR,
        flex: 1,
        height: '100%',
        width: '100%',
        fontSize: FONT_SIZE.M,
        backgroundColor: '#F7F7FA',
        paddingLeft: 10,
        borderRadius: 5,
        color: COLOR.DARK,
    },
    country: {
        height: SIZE.FORM_HEIGHT,
        justifyContent: 'center',
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: COLOR.LIGHT,
    },
    countryText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
    },
    default: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        color: '#9E9E9E',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default ModalCity