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
import {watch, electronics, mensfashion, furniture, petcare, placeholder} from '../../../../../assets'

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

    return (
      <>
        <Image 
          source={item.image ? {uri: item.image} : placeholder} 
          style={styles.setIcon} 
        />
      </>
    )

    // if(item?.image){
    //   //Image icon
      
    // }
    // else {
    //   return (
    //     <>
    //       <View>
    //         <CustomIcon.FA5Icon name={item?.parentIcon} size={20} color="#F6841F" />
    //       </View>
    //     </>
    //   )
    // }

  }

    return (
      <>
        <View style={styles.container}>
            <View style={styles.heading}>
              <View style={styles.h1Container}>
                <Text style={styles.h1}>Categories</Text>
              </View>
              <TouchableOpacity style={styles.navigateButton} disabled ={loading} onPress={() => {
                navigation.navigate("ToktokMallCategories")
              }}>
                <View style={styles.seeAllContainer}>
                  <Text style={styles.link}>See all </Text>
                </View>
                <View style={styles.nextContainer}>
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

            <View style={styles.loadingContainer}>

            {/* Skeleton Loader */}
            {loading && [1,2,3,4,5].map((cat, i) => {
                  return (
                    <>
                      <View style={styles.loading1}>
                        <View style={styles.loading2}>
                          <View style={styles.loading3} />
                        </View>
                        <View style={styles.loading4}>
                          <View style={styles.loading5} />
                        </View>
                      </View>   
                    </>
                  )
              })}

              {!loading && categoriesArr.length > 0 && categoriesArr.map((cat, i) => {
                  return (
                    <>
                      <TouchableOpacity onPress={() => navigation.navigate('ToktokMallCategories', {data: cat})} style={styles.button}>
                        <View style={styles.icon}>
                          {setIcon(cat)}
                        </View>
                        <View style={styles.categoryText}>
                          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.label}>{cat.parentCategoryName}</Text>
                        </View>
                      </TouchableOpacity>   
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
            <View style={styles.margin} />

          </View>
          <View style={styles.separator} />
      </>
    )
  }

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingHorizontal: 15, 
    paddingVertical: 0
  },
  heading: {
    paddingVertical: 20, 
    flexDirection: 'row'
  },
  h1Container: {
    flex: 8
  },
  h1: {
    fontSize: 14, 
    fontFamily: FONT.BOLD
  },
  navigateButton: {
    flex: 2, 
    flexDirection: 'row'
  },
  seeAllContainer: {
    flex: 2, 
    alignItems: 'flex-end', 
    justifyContent: 'center'
  },
  link: {
    fontSize: 12, 
    color: "#F6841F"
  },
  image: {
    width: 50, 
    height: 50, 
    resizeMode: 'cover', 
    alignSelf: 'center', 
    borderRadius: 8
  },
  label: {
    fontSize: 10, 
    alignSelf: 'center', 
    textAlign: 'center'
  },
  separator: {
    flex: 0.5, 
    height: 8, 
    backgroundColor: '#F7F7FA'
  },
  nextContainer: {
    flex: 0, 
    alignItems: 'flex-end', 
    justifyContent: 'center'
  },
  loadingContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-around'
  },
  loading1: {
    flex: 1
  },
  loading2: {
    alignItems: 'center', 
    justifyContent: 'center'
  },
  loading3: {
    width: 50, 
    height: 50, 
    backgroundColor: 'rgba(204, 204, 204, 0.2)', 
    borderRadius: 5
  },
  loading4: {
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 2
  },
  loading5: {
    height: 0
  },
  button: {
    flex: 1
  },
  icon: {
    alignItems: 'center', 
    justifyContent: 'center'
  },
  categoryText: {
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 4
  },
  setIcon: {
    width: 50, 
    height: 50, 
    resizeMode: 'cover', 
    borderRadius: 5
  },
  margin: {
    height: 15
  }
})