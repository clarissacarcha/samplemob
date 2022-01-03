import React, {useState,useContext, useEffect} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
// import countries from '../../../../../../../assets/JSON/countries.json'
import FIcon from 'react-native-vector-icons/Feather';
import {SIZES, INPUT_HEIGHT, FONTS, COLORS } from '../../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables';
import {useQuery, useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_CITIES } from '../../../../../../graphql/toktokmall/model/Address';
import useAsyncStorage from '../../../../../helpers/useAsyncStorage';
import { SwipeReloader } from '../../../../../Components';
import { Platform } from 'react-native';

export const CityAddressModalAndroid = ({type, onSelect, isVisible, setVisible, setCity})=> {

  const [filteredCities, setFilteredCities] = useState([])
  const [cities, setCities] = useState([])
	const [isloading, setisloading] = useState(false)
	const [offset, setOffset] = useState(0)

  const [getCitiesCall, {error, loading}] = useLazyQuery(GET_CITIES, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      setFilteredCities(response.getCities)
      setCities(response.getCities)
      // console.log("Provinces", response)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  useEffect(() => {
    getCitiesCall()
  }, [])

  const selectCity = (item) => {
    setFilteredCities(cities)
		setCity({
			id: item.id,
			city: item.citymunDesc,
			munCode: item.citymunCode,
			provCode: item.provCode,
			regCode: item.regDesc
		})
		setVisible(false)
  }

  const renderCity = ({item, index})=> {
    return (
      <>
      	<TouchableOpacity onPress={()=>selectCity(item)} style={[styles.country]}>
          <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M, textTransform: "capitalize"}}>{item.citymunDesc}</Text>
        </TouchableOpacity>
        <View style={styles.divider}/>
      </>
    )
  }

  const filterSearch = (value) => {
    const filtered = cities.filter(city=> city.citymunDesc.toLowerCase().includes(value.toLowerCase()))
    setFilteredCities(filtered)
  }

  const getCitiesOfProvince = (code) => {
    // const provCities = cities.filter(city => city.provCode == code)
    //RETURN THE DATA
    onSelect(code)
  }

  return (
    <Modal
      visible={isVisible}
      onRequestClose={()=>{
      	setVisible(false)
      	setFilteredCities(cities)
    	}}
	    style={styles.container}
      animationType="slide"
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={()=> setVisible(false)} style={{justifyContent: "center",alignItems:"center"}}>
          <FIcon name="chevron-down" size={20}/>
        </TouchableOpacity>
        <View style={styles.search}>
          <TextInput 
            placeholder="Search city"
            placeholderTextColor="grey"
            style={styles.input}
            onChangeText={filterSearch}
          />
          <FIcon style={{alignSelf: "center",position:"absolute", right: 25}} name={'search'} size={24}/>
        </View>
      	
				<FlatList
          style={{marginVertical: 15,}}
          data={filteredCities.slice(offset, offset + 100)}
          keyExtractor={city=>city.id}
          renderItem={renderCity}
          showsVerticalScrollIndicator={false}
					// ListFooterComponent={() => (
					// 	<SwipeReloader 
					// 		onSwipeUp={() => {
					// 			setisloading(true)
					// 			setTimeout(() => {
					// 				setOffset(offset + 30)
					// 				setisloading(false)
					// 			}, 700)
					// 		}} 
					// 		state={isloading}
					// 	/>
					// )}
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
    marginTop: Platform.OS === "ios" ? 45 : 15,
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
  }
})