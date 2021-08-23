import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_TOP_CATEGORIES } from '../../../../../../graphql/toktokmall/model';
import ContentLoader from 'react-native-easy-content-loader'
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
  const [categoriesArr, setCategoriesArr] = useState([])

  const [getCategoriesList, {error, loading}] = useLazyQuery(GET_TOP_CATEGORIES, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      setCategoriesArr(response.getTopCategories)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  useEffect(() => {
    getCategoriesList()
  }, [])

  const setIcon = (item) => {

    if(item?.parentIcon?.name == ""){
      //Image icon
      return (
        <>
          <Image 
            source={placeholder} 
            style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 5}} 
          />
        </>
      )
    }else {
      return (
        <>
          <View>
            <CustomIcon.FA5Icon name={item?.parentIcon?.name} size={20} color="#F6841F" />
          </View>
        </>
      )
    }

  }

    return (
      <>
        <View style={styles.container}>
            <View style={styles.heading}>
              <View style={{flex: 8}}>
                <Text style={styles.h1}>Categories</Text>
              </View>
              <TouchableOpacity style={{flex: 2, flexDirection: 'row'}} disabled ={loading} onPress={() => {
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

            {/* <FlatList
              horizontal={true}
              data={categoriesArr}
              renderItem={({item}) => {

                console.log("item", item)

                return (
                  <>
                    <TouchableOpacity style={{flex: 1, paddingBottom: 12, paddingHorizontal: 4}}>
                      {item.image && <Image source={item.image} style={styles.image} /> }
                      <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, paddingBottom: 12, paddingHorizontal: 4}}>
                      {setIcon(item)}
                      <Text style={styles.label}>{item.parentCategory || "loading"}</Text>
                    </TouchableOpacity>
                  </>
                )
              }}
              keyExtractor={(item, index) => item + index}
              removeClippedSubviews={true}
              showsHorizontalScrollIndicator={false} 
            />             */}

            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>

            {/* Skeleton Loader */}
            {loading && [1,2,3,4,5].map((cat, i) => {
                  return (
                    <>
                      <View style={{flex: 1}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                          <View style={{width: 50, height: 50, backgroundColor: 'rgba(204, 204, 204, 0.2)', borderRadius: 5}} />
                        </View>
                        <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 2}}>
                          <View style={{height: 0}} />
                        </View>
                      </View>   
                    </>
                  )
              })}

              {!loading && categoriesArr.length > 0 && categoriesArr.map((cat, i) => {
                  return (
                    <>
                      <View style={{flex: 1}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                          {setIcon(cat)}
                        </View>
                        <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 4}}>
                          <Text style={styles.label}>{cat.parentCategory}</Text>
                        </View>
                      </View>   
                    </>
                  )
              })}

              {/* <ContentLoader 
                active 
                loading={loading}
                avatar={false}
                title={true} 
                pRows={0}
                tHeight={40} 
                avatarStyles={{ left: 0, borderRadius: 5}}  
                tWidth={'100%'}
              >
                {categoriesArr.length > 0 && categoriesArr.map((cat, i) => {
                  return (
                    <>
                      <View style={{flex: 1}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                          {setIcon(cat)}
                        </View>
                        <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 4}}>
                          <Text style={styles.label}>{cat.parentCategory}</Text>
                        </View>
                      </View>   
                    </>
                  )
                })} 
                
              </ContentLoader>           */}

            </View>
            <View style={{height: 15}} />

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
  label: {fontSize: 10, alignSelf: 'center', textAlign: 'center'},
  separator: {flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}
})