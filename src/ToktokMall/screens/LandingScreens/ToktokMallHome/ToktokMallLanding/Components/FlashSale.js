import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { COLOR, FONT } from '../../../../../../res/variables';
import {LandingHeader, AdsCarousel, Loading} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {coppermask, chair, bottle, flashsalebg, flashsale, placeholder} from '../../../../../assets';
import {getRefComAccountType, Price} from '../../../../../helpers';
import ContentLoader from 'react-native-easy-content-loader'

import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_FEATURED_PRODUCTS } from '../../../../../../graphql/toktokmall/model';
import { useSelector } from 'react-redux';

const testdata = [{
  // image: require("../../../../../assets/images/coppermask.png"),
  image: coppermask,
  price: 1290,
  discount: "50% Off",
  discountPrice: 890
}, {
  // image: require("../../../../../assets/images/chair.png"),
  image: chair,
  price: 2800,
  discount: "50% Off",
  discountPrice: 1400
}, {
  // image: require("../../../../../assets/images/bottle.png"),
  image: bottle,
  price: 967,
  discount: "50% Off",
  discountPrice: 553
}]

const Item = ({data}) => {

  const navigation = useNavigation()

  const getImageSource = (imgs) => {
    if(typeof imgs == "object" && imgs.length > 0){
      return {uri: imgs[0].filename}
    }else {
      return placeholder
    }
  }

  return (
    <>
      <TouchableOpacity activeOpacity={0.5} onPress={() => {
          navigation.navigate("ToktokMallProductDetails", data)
        }} style={styles.itemContainer}>
        <View style={styles.itemMargin1}></View>
        <Image source={getImageSource(data?.images)} style={styles.itemGetSourceImage} />
        <View style={styles.itemMargin2}></View>
        <Text style={styles.itemPriceText}><Price amount={data?.price} /></Text>
        <View style={styles.itemDiscountAndCompareAtPriceContainer}>
          <View style={styles.itemCompareAtPriceContainer}>
            <Text style={styles.itemCompareAtPriceText}><Price amount={data?.compareAtPrice} /></Text>          
          </View>
          <View style={styles.itemDiscountContainer}>
            <Text style={styles.itemDiscountText}>{data?.discountRate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  )
}

const Empty = ({data}) => {

  return (
    <>
      <View style={styles.emptyContainer}>
        <View style={styles.emptyMargin1} />
        <View style={styles.emptyMargin2} />
        {/* <Image source={getImageSource(data?.images)} style={{width: '100%', height: 120, resizeMode: 'stretch', alignSelf: 'center', borderRadius: 5}} /> */}
        <View style={styles.emptyMargin3} />
        <Text style={styles.emptyText1}></Text>
        <View style={styles.emptyContainer1}>
          <View style={styles.emptyContainer2}>
            <Text style={styles.emptyText2}></Text>          
          </View>
          <View style={styles.emptyContainer3}>
            <Text style={styles.emptyText3}></Text>
          </View>
        </View>
      </View>
    </>
  )
}

export const FlashSale = () => {

  const session = useSelector(state=>state.session)
  const navigation = useNavigation()
  const [featured, setFeatured] = useState([])

  const [getFeaturedProducts, {error, loading}] = useLazyQuery(GET_FEATURED_PRODUCTS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        offset: 90,
        limit: 3,
        refCom: getRefComAccountType({session})
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
        <ImageBackground 
          source={flashsalebg}
          imageStyle={{resizeMode: 'cover'}}          
          style={styles.imageBackground}>
          {/* <ContentLoader active loading = {loading} avatar = {false}  title = {true} pRows = {4}
            tHeight = {70} avatarStyles = {{ left: 0, borderRadius: 5}}  tWidth = {'100%'}
            pWidth = {'100%'}
          ></ContentLoader> */}
            <View style={styles.container}>
              {/* <View style={{flex: 4}}>
                <Image source={flashsale} style={{width: 90, height: 90, resizeMode: 'center', justifyContent: 'center', alignSelf: 'flex-end'}} />
              </View> */}
              <View style={styles.featuredContainer}>
                <Text style={styles.featuredTitleText}>Featured Items</Text>
                {/* <Text style={{color: "#747575", fontSize: 12}}>Offer ends 5.17.2021</Text> */}
              </View>
              <TouchableOpacity disabled = {loading} onPress={() => {
                navigation.navigate("ToktokMallSearch", {searchValue: "Featured Items", origin: "flashsale"})
              }} style={styles.button}>
                <View style={styles.shopNowContainer}>
                  <Text style={styles.shopNowText}>Shop now </Text>
                </View>
                <View style={styles.rightContainer}>
                  <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
                </View>
              </TouchableOpacity>
            </View>
            
            <View>            
              <View style={styles.loadingContainer}>
                {loading && [1,2,3].map((item, i) => <Empty key={i} data={item} />)}
                {!loading && featured.map((item, i) => <Item key={i} data={item} /> )}
              </View>
            </View>
          
          <View style={styles.margin1}></View>
        </ImageBackground>
        <View style={styles.margin2} />
        </>
    )
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 2, 
    paddingBottom: 4, 
    marginHorizontal: 2, 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 5
  },
  itemMargin1: {
    height: 4
  },
  itemGetSourceImage: {
    width: '100%', 
    height: 120, 
    resizeMode: 'stretch', 
    alignSelf: 'center', 
    borderRadius: 5
  },
  itemMargin2: {
    height: 2
  },
  itemPriceText: {
    fontSize: 14, 
    fontWeight: '600', 
    color: "#F6841F", 
    alignSelf: 'flex-start', 
    paddingHorizontal: 5
  },
  itemDiscountAndCompareAtPriceContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  itemCompareAtPriceContainer: {
    flex: 2
  },
  itemCompareAtPriceText: {
    fontSize: 10, 
    textDecorationLine: 'line-through', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 5, 
    color: "#9E9E9E"
  },
  itemDiscountContainer: {
    flex: 1
  },
  itemDiscountText: {
    fontSize: 9.5, 
    alignSelf: 'center', 
    color: "#FDBA1C"
  },
  emptyContainer: {
    flex: 2, 
    paddingBottom: 4, 
    marginHorizontal: 2, 
    alignItems: 'center', 
    backgroundColor: "rgba(255,255,255,0.4)", 
    borderRadius: 5
  },
  emptyMargin1: {
    height: 4
  },
  emptyMargin2: {
    height: 120
  },
  emptyMargin3: {
    height: 2
  },
  emptyText1: {
    fontSize: 14, 
    fontWeight: '600', 
    color: "#F6841F", 
    alignSelf: 'flex-start', 
    paddingHorizontal: 5
  },
  emptyContainer1: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  emptyContainer2: {
    flex: 2
  },
  emptyText2: {
    fontSize: 10, 
    textDecorationLine: 'line-through', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 5, 
    color: "#9E9E9E"
  },
  emptyContainer3: {
    flex: 1
  },
  emptyText3: {
    fontSize: 9.5, 
    alignSelf: 'center', 
    color: "#FDBA1C"
  },
  imageBackground: {
    flex: 1, 
    paddingHorizontal: 15, 
    paddingVertical: 0
  },
  container: {
    paddingVertical: 20, 
    flexDirection: 'row'
  },
  featuredContainer: {
    flex: 11, 
    justifyContent: 'center', 
    paddingHorizontal: 4
  },
  featuredTitleText: {
    fontSize: 14, 
    fontFamily: FONT.BOLD
  },
  button: {
    flex: 3, 
    flexDirection: 'row'
  },
  shopNowContainer: {
    flex: 3, 
    alignItems: 'flex-end', 
    justifyContent: 'center'
  },
  shopNowText: {
    fontSize: 12, 
    color: "#F6841F", 
    fontWeight: '600'
  },
  rightContainer: {
    flex: 0, 
    alignItems: 'flex-end', 
    justifyContent: 'center'
  },
  loadingContainer: {
    flex: 1, 
    flexDirection: 'row'
  },
  margin1: {
    height: 15
  },
  margin2: {
    flex: 0.5, 
    height: 8, 
    backgroundColor: '#F7F7FA'
  }
})