import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { useLazyQuery } from '@apollo/react-hooks';
import {Image as RNEImage} from 'react-native-elements'; 
import { COLOR, FONT } from '../../../../../../res/variables';
import {LandingHeader, AdsCarousel} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_PRODUCTS } from '../../../../../../graphql/toktokmall/model';

import {clothfacemask, medicalfacemask, placeholder} from '../../../../../assets'; 


const testdata = [{
  image: clothfacemask,
  rating: 4,
  price: 190,
  stock: 35,
  sold: 187,
  label: "Cloth Face Mask"
}, {
  image: medicalfacemask,
  rating: 3,
  price: 80,
  stock: 201,
  sold: 407,
  label: "Medical Face Mask"
}, {
  image: clothfacemask,
  rating: 5,
  price: 190,
  stock: 35,
  sold: 187,
  label: "Cloth Face Mask"
}, {
  image: medicalfacemask,
  rating: 2,
  price: 190,
  stock: 35,
  sold: 187,
  label: "Medical Face Mask"
}]

const RenderStars = ({value}) => {
  let orange = "#FFC833"
  let gray = "rgba(33, 37, 41, 0.1)"
  return (
    <>
      <CustomIcon.FoIcon name="star" size={12} color={value >= 1 ? orange : gray}  />
      <CustomIcon.FoIcon name="star" size={12} color={value >= 2 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={12} color={value >= 3 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={12} color={value >= 4 ? orange : gray} />
      <CustomIcon.FoIcon name="star" size={12} color={value >= 5 ? orange : gray} />
    </>
  )
}

const RenderItem = ({item}) => {

  const navigation = useNavigation()

  const getImageSource = (data) => {
    if(data.length > 0){
      return {uri: data[0].filename}
    }else {
      return placeholder
    }
  }

  return (
    <>
      <View style={{flex: 2, backgroundColor: '#fff', margin: 5}}>
                  
        <TouchableOpacity activeOpacity={1} onPress={() => {
          navigation.navigate("ToktokMallProductDetails", item)
        }} style={{padding: 5}}>
          <RNEImage 
            source={getImageSource(item.images)} 
            style={{resizeMode: 'cover', width: '100%', height: 120, borderRadius: 5}} 
          />
          <Text style={{fontSize: 13, fontWeight: '500', paddingVertical: 5}}>{item.itemname}</Text>
          <Text style={{fontSize: 13, color: "#F6841F"}}>&#8369;{parseFloat(item.price).toFixed(2)}</Text>    
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 7, flexDirection: 'row'}}>
              <RenderStars value={item.rating} />
            </View>
            <View style={{flex: 4}}>
              <Text style={{color: "#9E9E9E", fontSize: 10}}>({item.noOfStocks || 0})</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={{fontSize: 10}}>{item.soldCount || 0} sold</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
}

export const Suggestions = ({data}) => {

  const navigation = useNavigation()
  const [products, setProducts] = useState([])

  const [getProducts, {error, loading}] = useLazyQuery(GET_PRODUCTS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        limit: 12
      }
    },
    onCompleted: (response) => {
      setProducts(response.getProducts)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  useEffect(() => {
    getProducts()
  }, [])

    return (
      <>
        <View style={styles.container}>
            <View style={styles.heading}>
              <View style={{flex: 8}}>
                <Text style={styles.h1}>Suggestions for you</Text>
              </View>
              <TouchableOpacity onPress={() => {
                navigation.navigate("ToktokMallCategoriesList", {searchValue: "Suggestions for you"})
              }} style={{flex: 2, flexDirection: 'row'}}>
                <View style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}>
                  <Text style={styles.link}>See all </Text>
                </View>
                <View style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
                  <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
                </View>
              </TouchableOpacity>
            </View>

            <FlatList
              data={products}
              numColumns={2}
              style={{paddingHorizontal: 10}}
              renderItem={({item}) => {
                return <RenderItem item={item} />
              }}
              keyExtractor={(item, index) => item + index}
            />
            
          </View>
          <View style={{height: 15}}></View>
          <View style={styles.separator} />
      </>
    )
  }

const styles = StyleSheet.create({
  container: {flex: 1, paddingVertical: 0},
  heading: {paddingHorizontal: 15, paddingVertical: 20, flexDirection: 'row'},
  h1: {fontSize: 14, fontFamily: FONT.BOLD},
  link: {fontSize: 12, color: "#F6841F"},
  image: {width: 50, height: 50, resizeMode: 'cover', alignSelf: 'center', borderRadius: 8},
  label: {fontSize: 11, alignSelf: 'center'},
  separator: {flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}
})