import React , {useState,useContext,useEffect} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
import {VerifyContext} from './VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import { SIZES, INPUT_HEIGHT, FONTS, COLORS } from '../../../../../../../res/constants';
import { COLOR } from '../../../../../../../res/variables';
import {Separator} from '../../../Components';
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../../../graphql'
import { GET_COUNTRIES } from '../../../../../../../graphql/toktokwallet/virtual'

const ModalNationality = ({visible,setVisible})=> {

    const {setNationality, setNationalityId, changeAddress} = useContext(VerifyContext)
    const [nationalities, setNationalities] = useState([])
    const [filteredNationalities, setFilteredNationalities] = useState([])
    const [countryIndex,setCountryIndex] = useState(20)

    const [getCountries , {data, error , loading}] = useLazyQuery(GET_COUNTRIES, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted:(response)=> {
            // console.log("Countries Response", response)
            const countries = response.getCountries
            setNationalities(countries)
            // setFilteredNationalities(countries.slice(0,20))
            setFilteredNationalities(countries)
        },
        onError: (error)=> {
            console.log(error)
        }
    })

    useEffect(()=> {
        getCountries()
    },[])

    // if(loading){
    //     return null // render loading or activityindicator
    // }

    // if(error){
    //     // return <Text>Something Went Wrong</Text>
    //     return null
    // }

    // console.log(TOKTOK_WALLET_GRAPHQL_CLIENT)

    const selectNationality = (index)=> {
        const country = filteredNationalities[index]
        setNationality(country.nationality)
        setNationalityId(country.id)
        // changeAddress("countryId", country.id)
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
                    <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>{item.nationality}</Text>
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
    nationality: {
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

export default ModalNationality