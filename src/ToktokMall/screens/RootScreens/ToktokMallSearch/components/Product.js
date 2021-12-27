import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import { COLOR, FONT } from '../../../../../res/variables';
import { ScrollView } from 'react-native-gesture-handler';
import CustomIcon from '../../../../Components/Icons';
import { useNavigation } from '@react-navigation/native';
import {placeholder} from '../../../../assets';
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

const RenderItem = ({navigation, item}) => {

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
                  
        <TouchableOpacity onPress={() => navigation.navigate("ToktokMallProductDetails", item)} style={{padding: 5}}>
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
          <View>
            <Text style={{fontSize: 13, fontWeight: '500', paddingVertical: 5}} numberOfLines={2}>{item?.itemname || ""}</Text>
          </View>
          {/* <Text style={{fontSize: 13, color: "#F6841F"}}><Price amount={item?.price}/></Text>    
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 7, flexDirection: 'row'}}>
              <RenderStars value={item?.rating} />
            </View>
            <View style={{flex: 9}}>
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
              {item.discountRate && item.discountRate != "" ?  <Text style={{fontSize: 9, color: "#9E9E9E", textDecorationLine: 'line-through'}}><Price amount={item.compareAtPrice} /></Text> : <></>}
            </View>
            <View style={{flex: 1.3, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Text style={{fontSize: 9}}>{item.soldCount || 0} sold</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
}

export const Product = ({data, state, fetch, lazyload, loading2}) => {

  const [loading, setloading] = useState(state)
  const navigation = useNavigation()
  const [products, setProducts] = useState([])

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingBottom;
  }

  useEffect(() => {
    setProducts(data.sort((a, b) => a.soldCount < b.soldCount ))
  }, [data])

    return (
      <>
        <View style={styles.container}>
            
            <FlatList
              data={products}
              numColumns={2}
              style={{flex: 0, paddingHorizontal: 5}}
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
              onScroll = {({nativeEvent}) => {
                if(isCloseToBottom(nativeEvent)){
                  lazyload()
                }
              }}
              keyExtractor={(item, index) => item + index}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => {
                return (
                  <>
                    {/* <SwipeReloader state={loading2}  /> */}
                    {loading && <ActivityIndicator animating={loading} color="#F6841F" size={28} />}
                    {/* <View style={styles.separator} /> */}
                  </>
                )
              }}
            />
            
          </View>
          <View style={{height: 15}} />
      </>
    )
  }

const styles = StyleSheet.create({
  container: {flex: 0, paddingVertical: 10},
  heading: {paddingHorizontal: 15, paddingVertical: 20, flexDirection: 'row'},
  h1: {fontSize: 14, fontFamily: FONT.BOLD},
  link: {fontSize: 12, color: "#F6841F"},
  image: {width: 50, height: 50, resizeMode: 'cover', alignSelf: 'center', borderRadius: 8},
  label: {fontSize: 11, alignSelf: 'center'},
  separator: { height: 8, backgroundColor: '#F7F7FA'}
})