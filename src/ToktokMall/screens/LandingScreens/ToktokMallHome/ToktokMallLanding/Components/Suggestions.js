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
import { Price } from '../../../../../helpers';
import { SwipeReloader, Loading } from '../../../../../Components';

import ContentLoader from 'react-native-easy-content-loader'

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

  return (
    <>
      <View style={{flex: 2, backgroundColor: '#fff', margin: 5}}>
      
        <TouchableOpacity activeOpacity={1} onPress={() => {
          navigation.navigate("ToktokMallProductDetails", item)
        }} style={{padding: 5}}>
          {item?.discountRate != "" && 
          <View style={{position:'absolute', zIndex: 1, right: 0, backgroundColor: '#F6841F', borderBottomLeftRadius: 30}}>
            <Text style={{fontSize: 8, paddingHorizontal: 4, paddingLeft: 8, paddingTop: 1, paddingBottom: 3, color: "#fff", fontFamily: FONT.BOLD}}>{item?.discountRate}</Text>
          </View>}
          <RNEImage 
            source={getImageSource(item.images)} 
            style={{resizeMode: 'cover', width: '100%', height: 120, borderRadius: 5}} 
          />
          <Text style={{fontSize: 13, fontWeight: '500', paddingVertical: 5}} numberOfLines={2} ellipsizeMode="tail">{item.itemname}</Text>
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
            <View style={{flex: 1}}>
              <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={item.price} /></Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Text style={{fontSize: 10}}>{item.soldCount || 0} sold</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
}

export const Suggestions = ({}) => {

  const navigation = useNavigation()

  const [products, setProducts] = useState([])
  const [offset, setOffset] = useState(0)
  const [isFetching, setIsFetching] = useState(true)

  const [getProducts, {error, loading, fetchMore}] = useLazyQuery(GET_TOP_PRODUCTS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        offset: offset,
        limit: 10
      }
    },
    onCompleted: (response) => {
      let temp = products
      if(response){
        temp = temp.concat(response.getTopProducts)
        setProducts(temp)
        // setProducts(response.getProducts)
      }else{
        setProducts(temp)
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

  // const { loading, data, fetchMore } = useQuery(GET_PRODUCTS, {
  //   client: TOKTOK_MALL_GRAPHQL_CLIENT,
  //   variables: {
  //     offset: 0,
  //     limit: 10
  //   }
  // })

  // if(loading) return <Loading state={loading} />
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingBottom;
  }

  const onScroll = (event) => {
    // alert
    // if(isCloseToBottom(event)){
    //   alert('close to bottom')
    // }
    // console.log(event.nativeEvent)
    if(isCloseToBottom(event.nativeEvent)){
      alert('close to bottom')
    }
    // Animated.event(
    //   [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
    //   {useNativeDriver: false}
    // )
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.heading}>
          <View style={{flex: 8}}>
            <Text style={styles.h1}>Suggestions for you</Text>
          </View>
          <TouchableOpacity onPress={() => {
            navigation.navigate("ToktokMallSearch", {searchValue: "Suggestions for you", origin: "suggestion"})
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
          nestedScrollEnabled = {true}
          renderItem={({item, index}) => {
            const isEven = products?.length % 2 === 0
            if(!isEven){
              //ODD
              if(index == products?.length - 1){
                return (
                  <>
                    <RenderItem navigation={navigation} item={item} />
                    <View style={{flex: 2, backgroundColor: '#fff', margin: 5}}></View>
                  </>
                )
              }                  
            }
            return <RenderItem navigation={navigation} item={item} />
          }}
          keyExtractor={(item, index) => item + index}
          refreshing={loading}
          onEndReached = {() => {
            setIsFetching(true)
            setOffset(products.length)
            // console.log({offset})
            getProducts()
          }}
          // onScroll = {(nativeEvent) => {
          //   console.log(nativeEvent)
          // }}
          onEndReachedThreshold={1}
          ListFooterComponent={() => {
            return (
              <>
                <SwipeReloader state={isFetching} 
                // onSwipeUp={() => {
                //   setOffset(products.length)
                //   console.log({offset})
                //   getProducts()
                // }} 
                />
                {/* <View style={styles.separator} /> */}
              </>
            )
          }}
        />
            
      </View>
    <View style={{height: 15}}></View>
    {/* <View style={styles.separator} /> */}
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
  separator: {height: 8, backgroundColor: '#F7F7FA'}
})