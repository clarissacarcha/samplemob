import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_CATEGORIES } from '../../../../../../graphql/toktokmall/model';

import { COLOR, FONT } from '../../../../../../res/variables';
import {LandingHeader, AdsCarousel} from '../../../../../Components';

import CustomIcon from '../../../../../Components/Icons';
import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'

const testdata = [{
  // image: require("../../../../../assets/images/Watch.png"),
  // image: {uri: ""},
  image: watch,
  label: "Accessories"
}, {
  // image: require("../../../../../assets/images/Electronics.png"),
  // image: {uri: ""},
  image: electronics,
  label: "Electronics"
}, {
  // image: require("../../../../../assets/images/Furniture.png"),
  // image: {uri: ""},
  image: furniture,
  label: "Furnitures"
}, {
  // image: require("../../../../../assets/images/Men's-Fashion.png"),
  // image: {uri: ""},
  image: mensfashion,
  label: "Men's Fashion"
}, {
  // image: require("../../../../../assets/images/Pet-Care.png"),
  // image: {uri: ""},
  image: petcare,
  label: "Pet Care"
}]

export const Categories = ({data}) => {

  const navigation = useNavigation()

  const [getCategories, {error, loading}] = useLazyQuery(GET_CATEGORIES, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
        console.log("Categories", response)
    },
    onError: (err) => {
        console.log(err)
    }
  })

  useEffect(() => {
    getCategories()
  }, [])

    return (
      <>
        <View style={styles.container}>
            <View style={styles.heading}>
              <View style={{flex: 8}}>
                <Text style={styles.h1}>Categories</Text>
              </View>
              <TouchableOpacity style={{flex: 2, flexDirection: 'row'}} onPress={() => {
                navigation.navigate("ToktokMallCategories")
              }}>
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
              data={testdata}
              renderItem={({item}) => {
                return (
                  <>
                    <TouchableOpacity style={{flex: 1, paddingBottom: 12, paddingHorizontal: 4}}>
                      {item.image && <Image source={item.image} style={styles.image} /> }
                      <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                  </>
                )
              }}
              keyExtractor={(item, index) => item + index}
            />            
          </View>
          <View style={styles.separator} />
      </>
    )
  }

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 15, paddingVertical: 0},
  heading: {paddingVertical: 20, flexDirection: 'row'},
  h1: {fontSize: 14, fontFamily: FONT.BOLD},
  link: {fontSize: 12, color: "#F6841F"},
  image: {width: 50, height: 50, resizeMode: 'cover', alignSelf: 'center', borderRadius: 8},
  label: {fontSize: 11, alignSelf: 'center'},
  separator: {flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}
})