import React , {useState,useContext,useEffect} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
import {VerifyContext} from '../VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import {Separator} from 'toktokwallet/components';
import { useLazyQuery } from '@apollo/react-hooks'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_COUNTRIES } from 'toktokwallet/graphql/virtual'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS

const ModalNationality = ({visible,setVisible})=> {

    const {setNationality, setNationalityId, changeAddress} = useContext(VerifyContext)
    const [nationalities, setNationalities] = useState([])
    const [filteredNationalities, setFilteredNationalities] = useState([])
    const [countryIndex,setCountryIndex] = useState(20)

    const [getCountries , {data, error , loading}] = useLazyQuery(GET_COUNTRIES, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted:(response)=> {
            const countries = response.getCountries
            setNationalities(countries)
            setFilteredNationalities(countries)
        },
        onError: (error)=> {
            console.log(JSON.stringify(error))
        }
    })

    useEffect(()=> {
        getCountries()
    },[])


    const selectNationality = (index)=> {
        const country = filteredNationalities[index]
        setNationality(country.nationality)
        setNationalityId(country.id)
        setVisible(false)
        setFilteredNationalities(nationalities)
    }

    const filterSearch = (value) => {
        const filtered = nationalities.filter(country=> country.nationality.toLowerCase().includes(value.toLowerCase()))
        setFilteredNationalities(filtered)
    }

    const setAdditionalCountries = ()=> {
        console.log("Load more")
        setFilteredNationalities(state=>[...state , ...nationalities.slice(countryIndex + 1, countryIndex + 20)])
        setCountryIndex(state => state + 20)
    }


    const renderNationality = ({item,index})=> {
        return (
            <>
            <TouchableOpacity onPress={()=>selectNationality(index)} style={[styles.nationality]}>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.nationality}</Text>
            </TouchableOpacity>
            <View style={styles.divider}/>
            </>
        )
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={()=>{
                setVisible(false)
                setFilteredNationalities(nationalities)
            }}
            style={styles.container}
            animationType="slide"
        >
            <View style={styles.content}>
                <TouchableOpacity onPress={()=>setVisible(false)} style={{justifyContent: "center",alignItems:"center"}}>
                    <FIcon name="chevron-down" size={20}/>
                </TouchableOpacity>
                <View style={styles.search}>
                    <TextInput 
                        placeholder="Search your nationality"
                        placeholderTextColor={COLOR.DARK}
                        style={styles.input}
                        onChangeText={filterSearch}
                    />
                    <FIcon style={{alignSelf: "center",position:"absolute", right: 25}} name={'search'} size={24}/>
                </View>
                <Separator/>

                <FlatList
                        style={{marginVertical: 15,}}
                        data={filteredNationalities}
                        keyExtractor={nationality=>nationality.id}
                        renderItem={renderNationality}
                        showsVerticalScrollIndicator={false}
                        // onEndReached={setAdditionalCountries}
                        // onEndReachedThreshold={0}
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
    nationality: {
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

export default ModalNationality