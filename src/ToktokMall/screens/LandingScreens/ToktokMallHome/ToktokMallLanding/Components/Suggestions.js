import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import {Image as RNEImage} from 'react-native-elements'; 

import { COLOR, FONT } from '../../../../../../res/variables';
import CustomIcon from '../../../../../Components/Icons';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_TOP_PRODUCTS } from '../../../../../../graphql/toktokmall/model';

import {clothfacemask, medicalfacemask, placeholder} from '../../../../../assets'; 
import { ArrayCopy, getRefComAccountType, Price } from '../../../../../helpers';
import { SwipeReloader, Loading, PromotionBanner, RefComDiscountRate } from '../../../../../Components';
import Spinner from 'react-native-spinkit';

import ContentLoader from 'react-native-easy-content-loader'
import { useSelector } from 'react-redux';

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

const RenderItem = ({item, loading}) => {

  const navigation = useNavigation()

  const getImageSource = (data) => {
    if(data && data?.length > 0){
      return {uri: data[0].filename}
    }else {
      return placeholder
    }
  }
  const origPrice = (discountRate, currentPrice) => {
    let total = 0
    total = currentPrice * (discountRate / 100)
    return total
  }

  useEffect(() => {
    console.log(item.promotions)
  }, [])

  return (
    <>
      <View style={{flex: 2, backgroundColor: '#fff', margin: 5}}>
      
        <TouchableOpacity activeOpacity={1} onPress={() => {
          navigation.navigate("ToktokMallProductDetails", item)
          // console.log(item)
        }} style={{padding: 5}}>
          {item?.discountRate != "" && 
            <View style={{position:'absolute', zIndex: 1, right: 0, backgroundColor: '#F6841F', borderBottomLeftRadius: 30}}>
              <Text style={{fontSize: 8, paddingHorizontal: 4, paddingLeft: 8, paddingTop: 1, paddingBottom: 3, color: "#fff", fontFamily: FONT.BOLD}}>{item?.discountRate}</Text>
            </View>
          }
          {
            item?.promoIsset == 1 && item.promotions != null &&
            <PromotionBanner 
              label={item.promotions.name}
              content={item.promotions.duration}
            />
          }
          <RNEImage 
            source={getImageSource(item.images)} 
            style={{resizeMode: 'cover', width: '100%', height: 120, borderRadius: 5}} 
          />
          <Text style={{fontSize: 13, fontWeight: '500', paddingVertical: 5}} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
          {/* <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={item.price} /></Text>    
          <View style={{flexDirection: 'row'}}>
            {/* <View style={{flex: 7, flexDirection: 'row'}}>
              <RenderStars value={item.rating} />
            </View>
            <View style={{flex: 9}}>
              <Text style={{color: "#9E9E9E", fontSize: 10}}>({item.noOfStocks || 0})</Text>
            </View>
            <View style={{flex: 1}} />
            <View style={{flex: 3}}>
              <Text style={{fontSize: 10}}>{item.soldCount || 0} sold</Text>
            </View>
          </View> */}
          <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2.3}}>
              <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={item.price} /></Text>
            </View>
            <View style={{flex: 2, justifyContent: 'center'}}>
              {
                item.discountRate && item.discountRate != "" || 
                item.refComDiscountRate && item.refComDiscountRate != "" ?  
                <Text style={{fontSize: 9, color: "#9E9E9E", textDecorationLine: 'line-through'}}>
                  {item.compareAtPrice == "" ? null : <Price amount={item.compareAtPrice} />}
                  </Text> : <></>}
            </View>
            <View style={{flex: 1.3, justifyContent: 'center', alignItems: 'flex-end'}}>
              {/* <Text style={{fontSize: 9}}>{item.weeklySold || 0} sold</Text> */}
            </View>
            
          </View>
          {
            item.refComDiscountRate && item.refComDiscountRate != "" ? <RefComDiscountRate value={item.refComDiscountRate} /> : null
          }          
        </TouchableOpacity>
      </View>
    </>
  )
}

export const Suggestions = ({lazyload}) => {

  const navigation = useNavigation()
  const session = useSelector(state=>state.session)
  const [products, setProducts] = useState([])
  const [offset, setOffset] = useState(0)
  const [isFetching, setIsFetching] = useState(true)

  const [getProducts, {error, loading, fetchMore}] = useLazyQuery(GET_TOP_PRODUCTS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        offset: offset,
        limit: 10,
        refCom: getRefComAccountType({session})
      }
    },
    onCompleted: (response) => {
      let temp = ArrayCopy(products)
      if(response){
        temp = temp.concat(response.getTopProducts)
        setProducts(temp)
        // setProducts(temp.sort((a, b) => a.weeklySold < b.weeklySold ))
      }else{
        setProducts(temp)
        // setProducts(temp.sort((a, b) => a.weeklySold < b.weeklySold ))
      }
      setIsFetching(false)
    },
    onError: (err) => {
      console.log(err)
      setIsFetching(false)
    }
  })

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => {
    if(!isFetching){
      console.log("will lazy load products...")
      setOffset(products.length)
      console.log({offset})
      getProducts()
    }
  }, [lazyload])

  // const { loading, data, fetchMore } = useQuery(GET_PRODUCTS, {
  //   client: TOKTOK_MALL_GRAPHQL_CLIENT,
  //   variables: {
  //     offset: 0,
  //     limit: 10
  //   }
  // })

  // if(loading) return <Loading state={loading} />


  return (
    <>
      <View style={styles.container}>
        <View style={styles.heading}>
          <View style={styles.discoveryContainer}>
            <Text style={styles.h1}>Discover</Text>
          </View>
          <TouchableOpacity onPress={() => {
            
            // navigation.push("ToktokMallProductDetails", {Id: "7a0c028ecd26437c8cb317294db5086f"})
            navigation.navigate("ToktokMallSearch", {searchValue: "Discover", origin: "suggestion"})

          }} style={styles.searchButton}>
            <View style={styles.seeAllContainer}>
              <Text style={styles.link}>See all </Text>
            </View>
            <View style={styles.rightContainer}>
              <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={products}
          numColumns={2}
          style={styles.flatList}
          nestedScrollEnabled = {true}
          renderItem={({item, index}) => {
            const isEven = products?.length % 2 === 0
            if(!isEven){
              //ODD
              if(index == products?.length - 1){
                return (
                  <>
                    <RenderItem navigation={navigation} item={item} />
                    <View style={styles.margin1}></View>
                  </>
                )
              }                  
            }
            return <RenderItem navigation={navigation} item={item} />
          }}
          keyExtractor={(item, index) => item + index}
          refreshing={loading}          
          onEndReachedThreshold={1}
          ListFooterComponent={() => {
            return (
              <>
                {isFetching && 
                <View style={styles.spinnerContainer}>
                  <Spinner 
                    isVisible={true}
                    type={"Circle"}
                    color={"#F6841F"}
                    size={20}
                  />
                </View>}
                
                {/* <SwipeReloader state={isFetching} 
                  onSwipeUp={() => {
                    setOffset(products.length)
                    console.log({offset})
                    getProducts()
                  }}
                /> */}
                {/* <View style={styles.separator} /> */}
              </>
            )
          }}
        />
            
      </View>
    <View style={styles.margin2}></View>
    {/* <View style={styles.separator} /> */}
  </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingVertical: 0
  },
  heading: {
    paddingHorizontal: 15, 
    paddingVertical: 20, 
    flexDirection: 'row'
  },
  discoveryContainer: {
    flex: 8
  },
  h1: {
    fontSize: 14, 
    fontFamily: FONT.BOLD
  },
  searchButton: {
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
  rightContainer: {
    flex: 0, 
    alignItems: 'flex-end', 
    justifyContent: 'center'
  },
  flatList: {
    paddingHorizontal: 10
  },
  margin1: {
    flex: 2, 
    backgroundColor: '#fff', 
    margin: 5
  },
  spinnerContainer: {
    padding: 15, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  margin2: {
    height: 15
  },
  image: {
    width: 50, 
    height: 50, 
    resizeMode: 'cover', 
    alignSelf: 'center', 
    borderRadius: 8
  },
  label: {
    fontSize: 11, 
    alignSelf: 'center'
  },
  separator: {
    height: 8, 
    backgroundColor: '#F7F7FA'
  }
})