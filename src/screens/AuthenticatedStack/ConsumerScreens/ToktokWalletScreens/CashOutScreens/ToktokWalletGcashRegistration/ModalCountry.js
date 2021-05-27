import React, {useState,useEffect} from 'react'
import {View,Text,StyleSheet,Modal,TouchableOpacity,TextInput,FlatList} from 'react-native'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../../graphql'
import { GET_COUNTRIES } from '../../../../../../graphql/toktokwallet'
import {useLazyQuery} from '@apollo/react-hooks'
import { VectorIcon , ICON_SET } from '../../../../../../revamp'
import { Separator } from '../../Components'


const ModalCountry = ({visible,setVisible,setCountry})=> {

    const [countries,setCountries] = useState([])
    const [filteredCountries,setFilteredCountries] = useState([])

    const [getCountries , {data, error , loading}] = useLazyQuery(GET_COUNTRIES, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted:(response)=> {
            const countries = response.getCountries
            setCountries(countries)
            setFilteredCountries(countries)
        },
        onError: (error)=> {
            console.log(error)
        }
    })

    const filterSearch = (value) => {
        const filtered = countries.filter(country=> country.name.toLowerCase().includes(value.toLowerCase()))
        setFilteredCountries(filtered)
    }

    const selectCountry = (index)=> {
        const country = filteredCountries[index].name
        setCountry(country)
        setVisible(false)
        setFilteredCountries(countries)
    }


    const renderCountry = ({item,index})=> {
        return (
            <>
            <TouchableOpacity onPress={()=>selectCountry(index)} style={[styles.nationality]}>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.name}</Text>
            </TouchableOpacity>
            <View style={styles.divider}/>
            </>
        )
    }

    useEffect(()=> {
        getCountries()
    },[])


    return (
        <>
            <Modal
                visible={visible}
                onRequestClose={()=>setVisible(false)} 
                style={styles.container}
            >
                <View style={styles.modalBody}>
                        <TouchableOpacity onPress={()=>setVisible(false)} style={{justifyContent: "center",alignItems:"center"}}>
                            <VectorIcon iconSet={ICON_SET.Feather} name="chevron-down" size={20}/>
                        </TouchableOpacity>
                        <View style={styles.search}>
                            <TextInput 
                                placeholder="Search your nationality"
                                style={styles.input}
                                onChangeText={filterSearch}
                            />
                            <VectorIcon style={{alignSelf: "center",position:"absolute", right: 25}} iconSet={ICON_SET.Feather} name="search" size={24}/>
                        </View>
                        <Separator/>
                        <FlatList
                                style={{marginVertical: 15,}}
                                data={filteredCountries}
                                keyExtractor={country=>country.id}
                                renderItem={renderCountry}
                                showsVerticalScrollIndicator={false}
                                // onEndReached={setAdditionalCountries}
                                // onEndReachedThreshold={0}
                                // scrollEnabled={true}
                        />
                </View>

            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalBody: {
        flex: 1,
        backgroundColor:"white",
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


export default ModalCountry