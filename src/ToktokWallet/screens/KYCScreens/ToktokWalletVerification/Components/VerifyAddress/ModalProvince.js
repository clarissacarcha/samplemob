import React , {useState,useContext, useEffect} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
import {VerifyContext} from '../VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import {SearchInput, NoData} from 'toktokwallet/components';
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_PROVINCES } from 'toktokwallet/graphql/virtual'
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;


const ModalProvince = ({type, onSelect})=> {
    const {
        modalProvinceVisible,
        setModalProvinceVisible,
        setProvince,
        setProvinceId,
        setCity,
        setCityId,
        changeVerifyAddressErrors
    } = useContext(VerifyContext)

    const [filteredProvinces, setFilteredProvinces] = useState([])
    const [provinces, setProvinces] = useState([])

    const [getProvinces, {error, loading}] = useLazyQuery(GET_PROVINCES, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy: 'network-only',
        onCompleted: (response) => {
            setFilteredProvinces(response.getProvinces)
            setProvinces(response.getProvinces)
            // console.log("Provinces", response)
        },
        onError: (err) => {
            console.log(err)
        }
    })

    useEffect(() => {
        getProvinces()
    }, [])

    const selectCountry = (index) => {
        const province = filteredProvinces[index].provDesc
        const provinceId = filteredProvinces[index].id
        setProvince(province)
        setProvinceId(provinceId)
        setCity("")
        setCityId("")
        getCitiesOfProvince(filteredProvinces[index].provCode)  
        setModalProvinceVisible(false)
        setFilteredProvinces(provinces)
        changeVerifyAddressErrors('provinceError', '');
    }

    const renderCountry = ({item,index})=> {
        return (
            <>
            <TouchableOpacity onPress={()=> selectCountry(index)} style={[styles.country]}>
                <Text style={styles.countryText}>{item.provDesc}</Text>
            </TouchableOpacity>
            <View style={styles.divider}/>
            </>
        )
    }

    const filterSearch = (value) => {
        const filtered = provinces.filter(province=> province.provDesc.toLowerCase().includes(value.toLowerCase()))
        setFilteredProvinces(filtered)
    }

    const getCitiesOfProvince = (code) => {
        // const provCities = cities.filter(city => city.provCode == code)
        //RETURN THE DATA
        onSelect(code)
    }

    return (
        <Modal
            visible={modalProvinceVisible}
            onRequestClose={()=>{
                setModalProvinceVisible(false)
                setFilteredProvinces(provinces)
            }}
            style={styles.container}
            animationType="slide"
        >
            <View style={[styles.content, {marginTop: Platform.OS === 'ios' ? getStatusbarHeight : moderateScale(15)}]}>
                <View style={{flexDirection: 'row', marginHorizontal: 16}}>
                    <TouchableOpacity onPress={() => setModalProvinceVisible(false)} style={styles.center}>
                        <FIcon name="chevron-left" size={16} color={COLOR.ORANGE} />
                    </TouchableOpacity>
                    <SearchInput
                        containerStyle={styles.search}
                        placeholder="Search your province"
                        placeholderTextColor={'#525252'}
                        onChangeText={filterSearch}
                        // search={search}
                        onClear={() => setSearch('')}
                    />
                </View>
                 <FlatList
                    style={{marginVertical: 15}}
                    data={filteredProvinces}
                    keyExtractor={province=>province.id}
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

export default ModalProvince