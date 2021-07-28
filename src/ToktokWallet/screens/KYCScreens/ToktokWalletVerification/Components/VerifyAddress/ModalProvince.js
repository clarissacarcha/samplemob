import React , {useState,useContext, useEffect} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
import {VerifyContext} from '../VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import {Separator} from 'toktokwallet/components';
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_PROVINCES } from 'toktokwallet/graphql/virtual'
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;


const ModalProvince = ({type, onSelect})=> {
    const {
        modalProvinceVisible,
        setModalProvinceVisible,
        setProvince,
        setProvinceId,
        setCity,
        setCityId,
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
    }

    const renderCountry = ({item,index})=> {
        return (
            <>
            <TouchableOpacity onPress={()=>selectCountry(index)} style={[styles.country]}>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.provDesc}</Text>
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
            <View style={styles.content}>
                <TouchableOpacity onPress={()=>setModalProvinceVisible(false)} style={{justifyContent: "center",alignItems:"center"}}>
                    <FIcon name="chevron-down" size={20}/>
                </TouchableOpacity>
                <View style={styles.search}>
                    <TextInput 
                        placeholder="Search province"
                        style={styles.input}
                        onChangeText={filterSearch}
                    />
                    <FIcon style={{alignSelf: "center",position:"absolute", right: 25}} name={'search'} size={24}/>
                </View>
                <Separator/>

                <FlatList
                        style={{marginVertical: 15,}}
                        data={filteredProvinces}
                        keyExtractor={province=>province.id}
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

export default ModalProvince