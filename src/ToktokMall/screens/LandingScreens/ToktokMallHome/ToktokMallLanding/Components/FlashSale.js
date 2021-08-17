import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { COLOR, FONT } from '../../../../../../res/variables';
import {LandingHeader, AdsCarousel, Loading} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {coppermask, chair, bottle, flashsalebg, flashsale, placeholder} from '../../../../../assets';
import {Price} from '../../../../../helpers';

import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_FEATURED_PRODUCTS } from '../../../../../../graphql/toktokmall/model';

const testdata = [{
  // image: require("../../../../../assets/images/coppermask.png"),
  image: coppermask,
  price: 1290,
  discount: "50% Off",
  discountPrice: 890
}, {
  // image: require("../../../../../assets/images/chair.png"),
  image: chair,
  price: 2800,
  discount: "50% Off",
  discountPrice: 1400
}, {
  // image: require("../../../../../assets/images/bottle.png"),
  image: bottle,
  price: 967,
  discount: "50% Off",
  discountPrice: 553
}]

const Item = ({data}) => {

  const navigation = useNavigation()

  const getImageSource = (imgs) => {
    if(typeof imgs == "object" && imgs.length > 0){
      return {uri: imgs[0].filename}
    }else {
      return placeholder
    }
  }

  return (
    <>
      <TouchableOpacity onPress={() => {
          navigation.navigate("ToktokMallProductDetails", data)
        }} style={{flex: 2, paddingBottom: 4, marginHorizontal: 2, alignItems: 'center', backgroundColor: '#fff', borderRadius: 5}}>
        <View style={{height: 4}}></View>
        <Image source={getImageSource(data?.images)} style={{width: '100%', height: 120, resizeMode: 'stretch', alignSelf: 'center', borderRadius: 5}} />
        <View style={{height: 2}}></View>
        <Text style={{fontSize: 14, fontWeight: '600', color: "#F6841F", alignSelf: 'flex-start', paddingHorizontal: 5}}><Price amount={data?.price} /></Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Text style={{flex: 2, fontSize: 10, textDecorationLine: 'line-through', alignSelf: 'flex-start', paddingHorizontal: 5, color: "#9E9E9E"}}><Price amount={data?.compareAtPrice} /></Text>
          <Text style={{flex: 1, fontSize: 10, alignSelf: 'flex-start', paddingHorizontal: 5, color: "#FDBA1C"}}>{data?.discountRate}</Text>
        </View>
      </TouchableOpacity>
    </>
  )
}

export const FlashSale = () => {

  const navigation = useNavigation()
  const [featured, setFeatured] = useState([])

  const [getFeaturedProducts, {error, loading}] = useLazyQuery(GET_FEATURED_PRODUCTS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        offset: 90,
        limit: 3
      }
    },
    onCompleted: (response) => {
      if(response.getFeaturedProducts){
        setFeatured(response.getFeaturedProducts)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  useEffect(() => {
    getFeaturedProducts()
  }, [])

    return (
        <>
        <ImageBackground 
          source={flashsalebg}
          imageStyle={{resizeMode: 'cover'}}          
          style={{flex: 1, paddingHorizontal: 15, paddingVertical: 0}}>
          
          <View style={{paddingVertical: 0, flexDirection: 'row'}}>
            <View style={{flex: 4}}>
              <Image source={flashsale} style={{width: 90, height: 90, resizeMode: 'center', justifyContent: 'center', alignSelf: 'flex-end'}} />
            </View>
            <View style={{flex: 7, justifyContent: 'center', paddingHorizontal: 4}}>
              <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>&nbsp;UP TO 80% OFF</Text>
              <Text style={{color: "#747575", fontSize: 12}}>Offer ends 5.17.2021</Text>
            </View>
            <TouchableOpacity onPress={() => {
              navigation.navigate("ToktokMallSearch", {searchValue: "Flash Sale"})
            }} style={{flex: 3, flexDirection: 'row'}}>
              <View style={{flex: 3, alignItems: 'flex-end', justifyContent: 'center'}}>
                <Text style={{fontSize: 12, color: "#F6841F", fontWeight: '600'}}>Shop now </Text>
              </View>
              <View style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
                <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
              </View>
            </TouchableOpacity>
          </View>
          
          <View>            
            <View style={{flex: 1, flexDirection: 'row'}}>
              {loading && <View style={{height: 120}} />}
              {featured.map((item, i) => <Item key={i} data={item} /> )}
            </View>
          </View>
          <View style={{height: 15}}></View>
        </ImageBackground>
        <View style={{flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}} />
        </>
    )
}