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

const RenderProductImage = ({data}) => {

  const getImageSource = (imgs) => {
    if(imgs.length > 0){
      return {uri: imgs[0].filename}
    }else {
      return placeholder
    }
  }

  const {contSellingIsset, noOfStocks, images} = data

  if(contSellingIsset == 1 || contSellingIsset == 0 && noOfStocks > 0){
    return <Image 
      source={getImageSource(images || [])} 
      style={styles.imageWithStock} 
    />
  }else if(contSellingIsset == 0 && noOfStocks <= 0){
    return (<>
      <ImageBackground 
        source={getImageSource(images || [])} 
        imageStyle={{resizeMode: 'contain'}} 
        style={styles.imageNoStock}
      >        
      </ImageBackground>
    </>)
  }else{
    console.log(data)
    return <Image 
      source={placeholder} 
      style={styles.imageWithStock} 
    />
  }

}

const RenderItem = ({item}) => {

  const navigation = useNavigation()
  
  return (
    <>
      <View style={styles.renderItemContainer}>
                  
        <TouchableOpacity 
          onPress={() => {
              navigation.push("ToktokMallProductDetails", item)
          }} 
          style={styles.renderItemSubcontainer}
        >
          {item?.discountRate != "" && 
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>{item?.discountRate}</Text>
          </View>}
          {
            item?.promotions && item.promotions != null && 
            <PromotionBanner label={item.promotions.name} content={item.promotions.duration} />
          }

          <RenderProductImage data={ item || {}} />
          
          {/* {item?.noOfStocks <= 0  && item?.contSellingIsset == 0 &&
            <ImageBackground 
              source={getImageSource(item?.images || [])} 
              imageStyle={{resizeMode: 'contain'}} 
              style={styles.imageNoStock}
            >
              <View style={{backgroundColor: 'transparent', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: 90, height: 90, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 45, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: '#f2f2f2', fontSize: 12}}>OUT OF STOCK</Text>
                </View>
              </View>
            </ImageBackground> 
          } 
          {item?.noOfStocks > 0 &&  item?.contSellingIsset === 0 || item?.noOfStocks < 0 && item?.contSellingIsset === 1 ?
            <Image 
              source={getImageSource(item?.images || [], item)} 
              style={styles.imageWithStock} 
            /> : null
          }          */}
          <View>
            <Text style={styles.itemNameText}  numberOfLines={2} ellipsizeMode="tail">{item?.itemname || ""}</Text>
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
          <View style={styles.otherInfoContainer}>
            <View style={styles.itemPriceContainer}>
              <Text style={styles.itemPriceText}><Price amount={item?.price} /></Text>
            </View>
            {
              item.discountRate && item.discountRate != "" || 
              item.refComDiscountRate && item.refComDiscountRate != "" ?  
                <View style={styles.compareAtPriceCompareContainer}>
                  <Text style={styles.compareAtPriceCompareSubContainer}>
                    {item.compareAtPrice == "" ? null : <Price amount={item.compareAtPrice} />}
                  </Text>
                </View> : <></>}       
            <View style={styles.soldContainer}>
              {/* <Text style={styles.soldText}>{item?.soldCount || 0} sold</Text> */}
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
  const [onEndReached, setOnEndReached] = useState(true);

  const LoadMore = () => { 
    if(onEndReached) return;  
    setloading(true)
    setTimeout(() => {
      setOffset(offset + 10)
      setloading(false);
      setOnEndReached(true);
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
          renderItem={({item, index}) => {
            const isEven = products?.length % 2 === 0;
            if (!isEven) {
              //ODD
              if (index == products?.length - 1) {
                return (
                  <View style={{flex: 1 / 2}}>
                    <RenderItem item={item} />
                    <View style={styles.margin1}></View>
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
          onEndReachedThreshold={.1}
          onMomentumScrollBegin={() => setOnEndReached(false)  }
          ListFooterComponent={<SwipeReloader state={loading} />}
        />
      </View>
      <View style={styles.margin2} />
      {/* <View style={styles.separator} /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingVertical: 10
  },
  heading: {
    paddingHorizontal: 15, 
    paddingVertical: 20, 
    flexDirection: 'row'
  },
  h1: {
    fontSize: 14, 
    fontFamily: FONT.BOLD
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
    fontSize: 11, 
    alignSelf: 'center'
  },
  separator: {
    flex: 0.5, 
    height: 8, 
    backgroundColor: '#F7F7FA'
  },
  renderItemContainer: {
    flex: 2, 
    backgroundColor: '#fff', 
    margin: 5
  },
  renderItemSubcontainer: {
    padding: 5
  },
  discountContainer: {
    position:'absolute', 
    zIndex: 1, 
    right: 0, 
    backgroundColor: '#F6841F', 
    borderBottomLeftRadius: 30
  },
  discountText: {
    fontSize: 8, 
    paddingHorizontal: 4, 
    paddingLeft: 8, 
    paddingTop: 1, 
    paddingBottom: 3, 
    color: "#fff", 
    fontFamily: FONT.BOLD
  },
  imageNoStock: {
    width: '100%', 
    height: 120, 
    borderRadius: 5
  },
  imageWithStock: {
    resizeMode: 'cover', 
    width: '100%', 
    height: 120, 
    borderRadius: 5
  },
  itemNameText: {
    fontSize: 13, 
    fontWeight: '500', 
    paddingVertical: 5
  },
  otherInfoContainer: {
    flexDirection: 'row'
  },
  itemPriceContainer: {
    flex: 2.3
  },
  itemPriceText: {
    fontSize: 13, 
    color: "#F6841F"
  },
  compareAtPriceCompareContainer: {
    flex: 2, 
    justifyContent: 'center'
  },
  compareAtPriceCompareSubContainer: {
    fontSize: 9, 
    color: "#9E9E9E", 
    textDecorationLine: 'line-through'
  },
  soldContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'flex-end'
  },
  soldText: {
    fontSize: 8
  },
  margin1: {
    flex: 2, 
    backgroundColor: '#fff', 
    margin: 5
  },
  margin2: {
    height: 15
  }
}) 