import React, {useState,useContext, useEffect} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
// import countries from '../../../../../../../assets/JSON/countries.json'
import FIcon from 'react-native-vector-icons/Feather';
import {SIZES, INPUT_HEIGHT, FONTS, COLORS, MAPS_API_KEY } from '../../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables';
import {useQuery, useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_CITIES } from '../../../../../../graphql/toktokmall/model/Address';
import useAsyncStorage from '../../../../../helpers/useAsyncStorage';
import { SwipeReloader } from '../../../../../Components';
import { Platform } from 'react-native';
import { GeolocationUtility } from '../../../../../util';
import { debounce } from 'lodash';
import axios from 'axios';

export const AddressFinderModal = ({type, onSelect, isVisible, setVisible, setLocation}) => {

	const [places, setPlaces] = useState([])
	const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
		
  }, [])

  const selectAddress = (coords) => {
    setPlaces([])
		setLocation(coords)
		setVisible(false)
  }

  const renderAddress = ({item, index})=> {
    return (
      <>
      	<TouchableOpacity onPress={()=>selectAddress(item)} style={[styles.country]}>
          <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M, textTransform: "capitalize"}}>{item.formatted_address}</Text>
        </TouchableOpacity>
        <View style={styles.divider}/>
      </>
    )
  }

	const googleApiSearch = async (value) => {
	
		var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(value)}&inputtype=textquery&fields=formatted_address%2Cname%2Cgeometry&key=${MAPS_API_KEY}`,
      headers: { }
    };
    
    axios(config)
    .then((response) => {
      console.log(response.data)
			if(response.data.status == "OK"){
				setPlaces(response.data.candidates)
			}
		})

	}

	// useEffect(() => {
  //   const timeOutId = setTimeout(() => {
	// 		if(searchValue != ""){

	// 			googleApiSearch(searchValue)
	// 			// console.log("will search...", searchValue)
	// 		}			
	// 	}, 1000);
  //   return () => clearTimeout(timeOutId);
  // }, [searchValue]);

  return (
    <Modal
      visible={isVisible}
      onRequestClose={()=>{
      	setVisible(false)
      	setPlaces([])
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
            placeholder="Address(House #, Street, Village)"
            placeholderTextColor="gray"
            style={styles.input}
            onChangeText={debounce((val) => googleApiSearch(val))}
          />
          <FIcon style={{alignSelf: "center",position:"absolute", right: 25}} name={'search'} size={24}/>
        </View>
      	
				<FlatList
          style={{marginVertical: 15,}}
          data={places}
          keyExtractor={city=>city.id}
          renderItem={renderAddress}
          showsVerticalScrollIndicator={false}					
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