import React , {useState,useContext, useEffect} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
// import countries from '../../../../../../../assets/JSON/countries.json'
import {VerifyContext} from './VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import {SIZES, INPUT_HEIGHT, FONTS, COLORS } from '../../../../../../../res/constants';
import {Separator} from '../../../Components';
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../../../graphql'
import { GET_PROVINCES } from '../../../../../../../graphql/toktokwallet/virtual'

// const provinces = [
//     {id: 1, code: "0128", name:"Ilocos Norte"},
//     {id: 2, code: "0129", name:"Ilocos Sur"},
//     {id: 3, code: "0133", name:"La Union"},
//     {id: 4, code: "0155", name:"Pangasinan"}
// ]

const ModalProvince = ({type, onSelect})=> {
    const {
        modalProvinceVisible,
        setModalProvinceVisible,
        setModalCityVisible,
        changeBirthInfo,
        changeAddress,
        changeVerifyID,
        setNationality,
        cities,
        changeProvinceCities
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
        if(type == "birthinfo"){
            changeBirthInfo("birthPlace", province)
        }else if(type == "address"){
            changeAddress("province", province)
            changeAddress("provinceID", filteredProvinces[index].id)
            getCitiesOfProvince(filteredProvinces[index].provCode)
        }else if(type == "validID"){
            changeVerifyID("idCountry",province)
        }else{
            setNationality(province)
        }   
        setModalProvinceVisible(false)
        setFilteredProvinces(provinces)
    }

    const renderCountry = ({item,index})=> {
        return (
            <TouchableOpacity onPress={()=>selectCountry(index)} style={[styles.country]}>
                    <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>{item.provDesc}</Text>
            </TouchableOpacity>
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
        borderBottomWidth: .2,
        borderColor: "silver",
        paddingHorizontal:16,
    },
})

export default ModalProvince