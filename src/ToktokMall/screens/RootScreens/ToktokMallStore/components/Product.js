import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList} from 'react-native';
import { COLOR, FONT } from '../../../../../res/variables';
import { ScrollView } from 'react-native-gesture-handler';
import CustomIcon from '../../../../Components/Icons';
import {placeholder} from '../../../../assets';
import { useNavigation } from '@react-navigation/core';

import { SwipeReloader, PromotionBanner, RefComDiscountRate } from '../../../../Components';
import { Price } from '../../../../helpers';

import { Avatar } from 'react-native-elements';

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
                  
        <TouchableOpacity 
          onPress={() => {
              navigation.push("ToktokMallProductDetails", item)
          }} 
          style={{padding: 5}}
        >
          {item?.discountRate != "" && 
          <View style={{position:'absolute', zIndex: 1, right: 0, backgroundColor: '#F6841F', borderBottomLeftRadius: 30}}>
            <Text style={{fontSize: 8, paddingHorizontal: 4, paddingLeft: 8, paddingTop: 1, paddingBottom: 3, color: "#fff", fontFamily: FONT.BOLD}}>{item?.discountRate}</Text>
          </View>}
          {
            item.promotions && item.promotions != null && 
            <PromotionBanner label={item.promotions.name} content={item.promotions.duration} />
          }
          {item?.noOfStocks <= 0  && item?.contSellingIsset === 0 &&
            <ImageBackground 
              source={getImageSource(item?.images || [])} 
              imageStyle={{resizeMode: 'contain'}} 
              style={{width: '100%', height: 120, borderRadius: 5}}
            >
              {/* <View style={{backgroundColor: 'transparent', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: 90, height: 90, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 45, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: '#f2f2f2', fontSize: 12}}>OUT OF STOCK</Text>
                </View>
              </View> */}
            </ImageBackground> 
          }
          {item?.noOfStocks > 0 || item?.contSellingIsset === 1 &&
            <Image 
              source={getImageSource(item?.images || [])} 
              style={{resizeMode: 'cover', width: '100%', height: 120, borderRadius: 5}} 
            />
          }
          <View>
            <Text style={{fontSize: 13, fontWeight: '500', paddingVertical: 5}}  numberOfLines={2} ellipsizeMode="tail">{item?.itemname || ""}</Text>
          </View>
          {/* <Text style={{fontSize: 13, color: "#F6841F"}}>&#8369;{parseFloat(item?.price).toFixed(2)}</Text>    
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 7, flexDirection: 'row'}}>
              <RenderStars value={item?.rating} />
            </View>
            <View style={{flex: 2}}>
              <Text style={{color: "#9E9E9E", fontSize: 10}}>({item?.noOfStocks || 0})</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={{fontSize: 10}}>{item?.soldCount || 0} sold</Text>
            </View>
          </View> */}
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 2.3}}>
              <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={item?.price} /></Text>
            </View>
            {
                item.discountRate && item.discountRate != "" || 
                item.refComDiscountRate && item.refComDiscountRate != "" ?  
                <View style={{flex: 2, justifyContent: 'center'}}>
              <Text style={{fontSize: 9, color: "#9E9E9E", textDecorationLine: 'line-through'}}>
                {item.compareAtPrice == "" ? null : <Price amount={item.compareAtPrice} />}
              </Text>
            </View> : <></>}       
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Text style={{fontSize: 8}}>{item?.soldCount || 0} sold</Text>
            </View>
          </View>
          {
            item.refComDiscountRate && item.refComDiscountRate != null ? <RefComDiscountRate value={item.refComDiscountRate} /> : null
          }
        </TouchableOpacity>
      </View>
    </>
  )
}

export const Product = ({data}) => {

  const navigation = useNavigation()
  const [loading, setloading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [products, setProducts] = useState(data)

  const LoadMore = () => {   
    setloading(true)
    setTimeout(() => {
      setOffset(offset + 10)
      setloading(false)
    }, 700)
  }

  useEffect(() => {
    let sliced = products.slice(0, offset + 10)
    let sorted = sliced.sort((a, b) => a.soldCount < b.soldCount )
    setProducts(sorted)
  }, [])

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={data.slice(0, offset + 10)}
          numColumns={2}
          style={{paddingHorizontal: 5}}
          renderItem={({item, index}) => {
            const isEven = products?.length % 2 === 0;
            if (!isEven) {
              //ODD
              if (index == products?.length - 1) {
                return (
                  <View style={{flex: 1 / 2}}>
                    <RenderItem item={item} />
                    <View style={{flex: 2, backgroundColor: '#fff', margin: 5}}></View>
                  </View>
                );
              }
            }
            return (
              <View style={{flex: 1 / 2}}>
                <RenderItem item={item} />
              </View>
            );
          }}
          keyExtractor={(item, index) => item + index}
          showsVerticalScrollIndicator={false}
          onEndReached={LoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={<SwipeReloader state={loading} />}
        />
      </View>
      <View style={{height: 15}}></View>
      {/* <View style={styles.separator} /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingVertical: 10},
  heading: {paddingHorizontal: 15, paddingVertical: 20, flexDirection: 'row'},
  h1: {fontSize: 14, fontFamily: FONT.BOLD},
  link: {fontSize: 12, color: "#F6841F"},
  image: {width: 50, height: 50, resizeMode: 'cover', alignSelf: 'center', borderRadius: 8},
  label: {fontSize: 11, alignSelf: 'center'},
  separator: {flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}
})