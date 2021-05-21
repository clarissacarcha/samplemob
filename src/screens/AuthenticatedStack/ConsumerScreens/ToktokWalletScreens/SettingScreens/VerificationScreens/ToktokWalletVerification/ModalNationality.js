import React , {useState,useContext,useEffect} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
import {VerifyContext} from './VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import { SIZES, INPUT_HEIGHT, FONTS, COLORS } from '../../../../../../../res/constants';
import {Separator} from '../../../Components';
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../../../graphql'
import { GET_COUNTRIES } from '../../../../../../../graphql/toktokwallet/virtual'

// const nationalities = [
//     "Afghan",
//     "Albanian",
//     "Algerian",
//     "American",
//     "Andorran",
//     "Angolan",
//     "Antiguans",
//     "Argentinean",
//     "Armenian",
//     "Australian",
//     "Austrian",
//     "Azerbaijani",
//     "Bahamian",
//     "Bahraini",
//     "Bangladeshi",
//     "Barbadian",
//     "Barbudans",
//     "Batswana",
//     "Belarusian",
//     "Belgian",
//     "Belizean",
//     "Beninese",
//     "Bhutanese",
//     "Bolivian",
//     "Bosnian",
//     "Brazilian",
//     "British",
//     "Bruneian",
//     "Bulgarian",
//     "Burkinabe",
//     "Burmese",
//     "Burundian",
//     "Cambodian",
//     "Cameroonian",
//     "Canadian",
//     "Cape Verdean",
//     "Central African",
//     "Chadian",
//     "Chilean",
//     "Chinese",
//     "Colombian",
//     "Comoran",
//     "Congolese",
//     "Costa Rican",
//     "Croatian",
//     "Cuban",
//     "Cypriot",
//     "Czech",
//     "Danish",
//     "Djibouti",
//     "Dominican",
//     "Dutch",
//     "East Timorese",
//     "Ecuadorean",
//     "Egyptian",
//     "Emirian",
//     "Equatorial Guinean",
//     "Eritrean",
//     "Estonian",
//     "Ethiopian",
//     "Fijian",
//     "Filipino",
//     "Finnish",
//     "French",
//     "Gabonese",
//     "Gambian",
//     "Georgian",
//     "German",
//     "Ghanaian",
//     "Greek",
//     "Grenadian",
//     "Guatemalan",
//     "Guinea-Bissauan",
//     "Guinean",
//     "Guyanese",
//     "Haitian",
//     "Herzegovinian",
//     "Honduran",
//     "Hungarian",
//     "I-Kiribati",
//     "Icelander",
//     "Indian",
//     "Indonesian",
//     "Iranian",
//     "Iraqi",
//     "Irish",
//     "Israeli",
//     "Italian",
//     "Ivorian",
//     "Jamaican",
//     "Japanese",
//     "Jordanian",
//     "Kazakhstani",
//     "Kenyan",
//     "Kittian and Nevisian",
//     "Kuwaiti",
//     "Kyrgyz",
//     "Laotian",
//     "Latvian",
//     "Lebanese",
//     "Liberian",
//     "Libyan",
//     "Liechtensteiner",
//     "Lithuanian",
//     "Luxembourger",
//     "Macedonian",
//     "Malagasy",
//     "Malawian",
//     "Malaysian",
//     "Maldivan",
//     "Malian",
//     "Maltese",
//     "Marshallese",
//     "Mauritanian",
//     "Mauritian",
//     "Mexican",
//     "Micronesian",
//     "Moldovan",
//     "Monacan",
//     "Mongolian",
//     "Moroccan",
//     "Mosotho",
//     "Motswana",
//     "Mozambican",
//     "Namibian",
//     "Nauruan",
//     "Nepalese",
//     "New Zealander",
//     "Nicaraguan",
//     "Nigerian",
//     "Nigerien",
//     "North Korean",
//     "Northern Irish",
//     "Norwegian",
//     "Omani",
//     "Pakistani",
//     "Palauan",
//     "Panamanian",
//     "Papua New Guinean",
//     "Paraguayan",
//     "Peruvian",
//     "Polish",
//     "Portuguese",
//     "Qatari",
//     "Romanian",
//     "Russian",
//     "Rwandan",
//     "Saint Lucian",
//     "Salvadoran",
//     "Samoan",
//     "San Marinese",
//     "Sao Tomean",
//     "Saudi",
//     "Scottish",
//     "Senegalese",
//     "Serbian",
//     "Seychellois",
//     "Sierra Leonean",
//     "Singaporean",
//     "Slovakian",
//     "Slovenian",
//     "Solomon Islander",
//     "Somali",
//     "South African",
//     "South Korean",
//     "Spanish",
//     "Sri Lankan",
//     "Sudanese",
//     "Surinamer",
//     "Swazi",
//     "Swedish",
//     "Swiss",
//     "Syrian",
//     "Taiwanese",
//     "Tajik",
//     "Tanzanian",
//     "Thai",
//     "Togolese",
//     "Tongan",
//     "Trinidadian or Tobagonian",
//     "Tunisian",
//     "Turkish",
//     "Tuvaluan",
//     "Ugandan",
//     "Ukrainian",
//     "Uruguayan",
//     "Uzbekistani",
//     "Venezuelan",
//     "Vietnamese",
//     "Welsh",
//     "Yemenite",
//     "Zambian",
//     "Zimbabwean"
//  ]

const ModalNationality = ({visible,setVisible})=> {

    const {setNationality, changeAddress} = useContext(VerifyContext)
    const [nationalities, setNationalities] = useState([])
    const [filteredNationalities, setFilteredNationalities] = useState([])

    const [getCountries , {data, error , loading}] = useLazyQuery(GET_COUNTRIES, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted:(response)=> {
            // console.log("Countries Response", response)
            setNationalities(response.getCountries)
            setFilteredNationalities(response.getCountries)
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
        changeAddress("countryId", country.id)
        setVisible(false)
        setFilteredNationalities(nationalities)
    }

    const filterSearch = (value) => {
        const filtered = nationalities.filter(country=> country.nationality.toLowerCase().includes(value.toLowerCase()))
        setFilteredNationalities(filtered)
    }


    const renderNationality = ({item,index})=> {
        return (
            <TouchableOpacity onPress={()=>selectNationality(index)} style={[styles.nationality]}>
                    <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>{item.nationality}</Text>
            </TouchableOpacity>
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
                        keyExtractor={nationality=>nationality}
                        renderItem={renderNationality}
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
    nationality: {
        height: INPUT_HEIGHT,
        justifyContent:"center",
        borderBottomWidth: .2,
        borderColor: COLORS.LIGHT,
        paddingHorizontal:16,
    },
})

export default ModalNationality