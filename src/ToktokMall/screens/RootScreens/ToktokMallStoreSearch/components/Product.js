import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList} from 'react-native';
import { COLOR, FONT } from '../../../../../res/variables';
import { ScrollView } from 'react-native-gesture-handler';
import CustomIcon from '../../../../Components/Icons';
import {placeholder} from '../../../../assets';
import { useNavigation } from '@react-navigation/core';

import { SwipeReloader, PromotionBanner } from '../../../../Components';
import { Price } from '../../../../helpers';

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

const RenderItem = ({item, navigation}) => {

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
                  
        <View style={{padding: 5}}>
          {item?.discountRate != "" && 
          <View style={{position:'absolute', zIndex: 1, right: 0, backgroundColor: '#F6841F', borderBottomLeftRadius: 30}}>
            <Text style={{fontSize: 8, paddingHorizontal: 4, paddingLeft: 8, paddingTop: 1, paddingBottom: 3, color: "#fff", fontFamily: FONT.BOLD}}>{item?.discountRate}</Text>
          </View>}
          {
            item.promotions && item.promotions != null &&
            <PromotionBanner 
              label={item.promotions.name}
              content={item.promotions.duration}
            />
          }
          <Image 
            source={getImageSource(item?.images || [])} 
            style={{resizeMode: 'cover', width: '100%', height: 120, borderRadius: 5}} 
          />
          <TouchableOpacity onPress={() => navigation.navigate("ToktokMallProductDetails", item)}>
            <Text style={{fontSize: 13, fontWeight: '500', paddingVertical: 5}}  numberOfLines={2} ellipsizeMode="tail">{item?.itemname || ""}</Text>
          </TouchableOpacity>
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
              <Text style={{fontSize: 9}}>{item.soldCount || 0} sold</Text>
            </View>
          </View>
          {
            item.refComDiscountRate && item.refComDiscountRate != null ? <RefComDiscountRate value={item.refComDiscountRate} /> : null
          }
        </View>
      </View>
    </>
  )
}

export const Product = ({data, lazyload}) => {

  const navigation = useNavigation()
  const [loading, setloading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [products, setProducts] = useState(data)

  // // const LoadMore = () => {    
  // //   setloading(true)
  // //   setTimeout(() => {
  // //     setOffset(offset + 10)
  // //     setloading(false)
  // //   }, 700)
  // // }

  // useEffect(() => {
  //   setProducts(products.slice(0, offset + 10))
  // }, [])

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingBottom = 0;
    // console.log(layoutMeasurement.height + contentOffset.y, contentSize.height - paddingBottom)
    return layoutMeasurement.height + contentOffset.y == contentSize.height - paddingBottom;
  }

  return (
    <>
      <View style={styles.container}>
            
        <FlatList
          data={data}
          numColumns={2}
          style={{paddingHorizontal: 5}}
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
          showsVerticalScrollIndicator={false}
          onScroll = {({nativeEvent}) => {
            if(isCloseToBottom(nativeEvent)){
              console.log("will reload...")
              lazyload()
            }
          }}
          ListFooterComponent={() => {
            return (
              <>
                <SwipeReloader state={false} onSwipeUp={null} />
                <View style={styles.separator} />
              </>
            )
          }}
        />
            
      </View>
      <View style={{height: 15}}></View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingVertical: 10},
  heading: {paddingHorizontal: 15, paddingVertical: 20, flexDirection: 'row'},
  h1: {fontSize: 14, fontFamily: FONT.BOLD},
  link: {fontSize: 12, color: "#F6841F"},
  image: {width: 50, height: 50, resizeMode: 'cover', alignSelf: 'center', borderRadius: 8},
  label: {fontSize: 11, alignSelf: 'center'},
  separator: { height: 8, backgroundColor: '#F7F7FA'}
})