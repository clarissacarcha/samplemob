import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList} from 'react-native';
import {Price} from '../../../../helpers';
import { COLOR, FONT } from '../../../../../res/variables';
import {LandingHeader, AdsCarousel} from '../../../../Components';
import { ScrollView } from 'react-native-gesture-handler';
import CustomIcon from '../../../../Components/Icons';

import {clothfacemask, medicalfacemask, placeholder} from '../../../../assets'; 
import { useNavigation } from '@react-navigation/core';

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
    if(data && data?.length > 0){
      return {uri: data[0].filename}
    }else {
      return placeholder
    }
  }

  return (
    <>
      <View style={{flex: 2, backgroundColor: '#fff', margin: 5}}>
                  
        <TouchableOpacity activeOpacity={1} onPress={() => {
          navigation.push("ToktokMallProductDetails", {Id: item.Id, itemname: item.itemname})
        }} style={{padding: 5}}>
          {item?.discountRate != "" && 
          <View style={{position:'absolute', zIndex: 1, right: 0, backgroundColor: '#F6841F', borderBottomLeftRadius: 30}}>
            <Text style={{fontSize: 8, paddingHorizontal: 4, paddingLeft: 8, paddingTop: 1, paddingBottom: 3, color: "#fff", fontFamily: FONT.BOLD}}>{item?.discountRate}</Text>
          </View>}
          <Image 
            source={getImageSource(item.images)} 
            style={{resizeMode: 'cover', width: '100%', height: 120, borderRadius: 5}} 
          />
          <Text style={{fontSize: 13, fontWeight: '500', paddingVertical: 5}} numberOfLines={2} ellipsizeMode="tail">{item.itemname}</Text>
          {/* <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={item.price} /></Text>    
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 7, flexDirection: 'row'}}>
              <RenderStars value={item.rating || 0} />
            </View>
            <View style={{flex: 2}}>
              <Text style={{color: "#9E9E9E", fontSize: 10}}>({item.noOfStocks || 0})</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={{fontSize: 10}}>{item.soldCount || 0} sold</Text>
            </View>
          </View> */}
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 2.3}}>
              <Text style={{fontSize: 12, color: "#F6841F"}}><Price amount={item.price} /></Text>
            </View>
            <View style={{flex: 2, justifyContent: 'center'}}>
              {item.discountRate && item.discountRate != "" ?  <Text style={{fontSize: 9, color: "#9E9E9E", textDecorationLine: 'line-through'}}><Price amount={item.compareAtPrice} /></Text> : <></>}
            </View>
            <View style={{flex: 1.3, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Text style={{fontSize: 9}}>{item.soldCount || 0} sold</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
}

export const RenderSuggestions = ({data}) => {

  const [products, setProducts] = useState(data)

  useEffect(() => {
    setProducts(data)
  }, [data])

    return (
      <>
        <View style={styles.container}>
            <View style={styles.heading}>
              <View style={{flex: 8}}>
                <Text style={styles.h1}>Suggestions for you</Text>
              </View>
              <TouchableOpacity style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}>
                <Text style={styles.link}>See all </Text>
              </TouchableOpacity>
              <View style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
                <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
              </View>
            </View>
            
            <FlatList
              data={products}
              numColumns={2}
              style={{paddingHorizontal: 10}}
              renderItem={({item, index}) => {
                const isEven = products?.length % 2 === 0
                if(!isEven){
                  //ODD
                  if(index == products?.length - 1){
                    return (
                      <>
                        <RenderItem item={item} />
                        <View style={{flex: 2, backgroundColor: '#fff', margin: 5}}></View>
                      </>
                    )
                  }                  
                }
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