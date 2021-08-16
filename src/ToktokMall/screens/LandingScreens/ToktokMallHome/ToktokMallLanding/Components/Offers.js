import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { COLOR, FONT } from '../../../../../../res/variables';
import {LandingHeader, AdsCarousel, Loading} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {coppermask, chair, bottle, placeholder} from '../../../../../assets';
import {Price} from '../../../../../helpers';

import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_FEATURED_PRODUCTS } from '../../../../../../graphql/toktokmall/model';

const testdata = [{
  // image: require("../../../../../assets/images/coppermask.png"),
  // image: {uri: ""},
  image: coppermask,
  price: 380,
  discountedPrice: 190
}, {
  // image: require("../../../../../assets/images/chair.png"),
  // image: {uri: ""},
  image: chair,
  price: 280,
  discountedPrice: 140
}, {
  // image: require("../../../../../assets/images/bottle.png"),
  // image: {uri: ""},
  image: bottle,
  price: 2280,
  discountedPrice: 1400
}, {
  // image: require("../../../../../assets/images/chair.png"),
  // image: {uri: ""},
  image: chair,
  price: 892,
  discountedPrice: 568
}, {
  // image: require("../../../../../assets/images/chair.png"),
  // image: {uri: ""},
  image: chair,
  price: 892,
  discountedPrice: 568
}, {
  // image: require("../../../../../assets/images/chair.png"),
  // image: {uri: ""},
  image: bottle,
  price: 892,
  discountedPrice: 568
}]

export const Offers = ({data}) => {

  const navigation = useNavigation()
  const [featured, setFeatured] = useState([])

  const [getFeaturedProducts, {error, loading}] = useLazyQuery(GET_FEATURED_PRODUCTS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        offset: 30,
        limit: 5
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
        <View style={styles.container}>
            <View style={styles.heading}>
              <View style={{flex: 8}}>
                <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Today's Offers</Text>
              </View>
              <TouchableOpacity onPress={() => {
                navigation.navigate("ToktokMallCategoriesList", {searchValue: "Today's Offers"})
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
              horizontal={true} 
              showsHorizontalScrollIndicator={false}
              data={featured}
              renderItem={({item}) => {

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
                      navigation.navigate("ToktokMallProductDetails", item)
                    }} style={{flex: 1, paddingBottom: 12, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center'}}>
                      <Image source={getImageSource(item?.images)} style={styles.image} />
                      <Text style={styles.label}><Price amount={item?.price} /></Text>
                      <Text style={styles.labelLine}><Price amount={item?.compareAtPrice} /></Text>                
                    </TouchableOpacity>
                  </>
                )
              }}
              ListEmptyComponent={<View style={{height: 70}} />}
              keyExtractor={(item, index) => item + index}
            />
            
          </View>
          {/* <View style={{flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}} /> */}
      </>
    )
  }

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 15, paddingVertical: 0},
  heading: {paddingVertical: 20, flexDirection: 'row'},
  h1: {fontSize: 14, fontFamily: FONT.BOLD},
  link: {fontSize: 12, color: "#F6841F"},
  image: {width: 80, height: 80, resizeMode: 'cover', borderRadius: 5},
  label: {fontSize: 14, fontWeight: '600', color: "#F6841F"},
  labelLine: {fontSize: 11, textDecorationLine: 'line-through', color: "#9E9E9E"},
  separator: {flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}
})