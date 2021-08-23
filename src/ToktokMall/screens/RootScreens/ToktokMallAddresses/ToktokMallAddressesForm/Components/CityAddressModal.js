import React , {useState,useContext, useEffect} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput, Platform} from 'react-native'
import AIcon from 'react-native-vector-icons/dist/AntDesign'
import {SIZES, INPUT_HEIGHT, FONTS, COLORS } from '../../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables';

import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_CITIES } from '../../../../../../graphql/toktokmall/model/Address';
import useAsyncStorage from '../../../../../helpers/useAsyncStorage';

const testData = [{id: 1, city: 'Quezon'},
{id: 2, city: 'Manila'},
{id: 3, city: 'Davao'},
{id: 4, city: 'Batanes'},
{id: 5, city: 'San Juan'},
{id: 6, city: 'Baguio'},
{id: 7, city: 'Cabuyao'},
{id: 8, city: 'Rizal'},
{id: 8, city: 'Caloocan'},
{id: 9, city: 'Cebu City'},
]

export const CityAddressModal = ({
	modalProvinceVisible , 
	setModalProvinceVisible, 
	city, 
	setCity 
}) => {
    
	const [filteredCities, setFilteredCities] = useAsyncStorage("TOKTOKMALL_CITIES",[])
    const [provinces, setProvinces] = useState([])
    const [searchKey, setSearchKey] = useState('')

    // const [getCities, {error, loading}] = useLazyQuery(GET_CITIES, {
    //     client: TOKTOK_MALL_GRAPHQL_CLIENT,
    //     fetchPolicy: 'network-only',
    //     onCompleted: (response) => {
    //         setFilteredCities(response.getCities)
    //     },
    //     onError: (err) => {
    //         console.log(err)
    //     }
    // })

    // useEffect(() => {
    //   getCities()
    // }, [])

    // const selectCountry = (index) => {
    //     const province = filteredProvinces[index].provDesc
    //     const provinceId = filteredProvinces[index].id
    //     setProvince(province)
    //     setProvinceId(provinceId)
    //     setCity("")
    //     setCityId("")
    //     getCitiesOfProvince(filteredProvinces[index].provCode)  
    //     setModalProvinceVisible(false)
    //     setFilteredProvinces(provinces)
    // }
    const onPress = (item) => {
      setCity({
				id: item.id,
				city: item.citymunDesc,
				munCode: item.citymunCode,
				provCode: item.provCode,
				regCode: item.regDesc
			})
      setModalProvinceVisible(false)
    }

    const renderCities = () => {
        return testData.map((item,index) => {
            return (
							<	TouchableOpacity onPress = {()=> {onPress(item.city)}}>
                    <View style={[styles.country]}>
                        <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>{item.city}</Text>
										</View>
                    <View style={styles.divider}/>                
								</TouchableOpacity>
            )
        })        
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
      <>
        <Modal
          visible={modalProvinceVisible}
          // onRequestClose={()=>{
          //     setModalProvinceVisible(false)
          //     setFilteredProvinces(provinces)
          // }}
          style={styles.container}
          animationType="slide">
          <View>
            <View
              style={{
                marginTop: Platform.OS === 'ios' ? 50 : 0,
                paddingBottom: 10,
                flexDirection: 'row',
                marginLeft: 15,
                justifyContent: 'space-between',
                alignContent: 'center',
              }}>
              <TextInput
                value={searchKey}
                onChangeText={(value) => setSearchKey(value)}
                style={{fontSize: 16}}
                placeholder="Search a City"
              />

              <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => {
                  setSearchKey('');
                  setModalProvinceVisible(false);
                }}>
                <AIcon name={'close'} size={15} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredCities.filter((city) => {
                const regex = new RegExp(searchKey, 'gi');
                if (regex.test(city.citymunDesc)) {
                  return city;
                }
                return null;
              })}
              ListEmptyComponent={
                <View style={[styles.country]}>
                    <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>No results found</Text>
                </View>
              }
              renderItem={({item}) => {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        onPress(item);
                      }}
                      style={[styles.country]}>
                      <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>{item.citymunDesc}</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                  </View>
                );
              }}
            />
          </View>
        </Modal>
      </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    },
    label: {fontFamily: FONTS.REGULAR, fontSize: SIZES.L, paddingLeft: 10, marginTop: 20, marginBottom: 20}
})