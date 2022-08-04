import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { COLOR, FONT } from '../../../../../../res/variables';
import {LandingHeader, AdsCarousel, Loading, RefComDiscountRate} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {coppermask, chair, bottle, flashsalebg, flashsale, featuredflash, placeholder} from '../../../../../assets';
import {getRefComAccountType, Price} from '../../../../../helpers';
import ContentLoader from 'react-native-easy-content-loader'

import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { GET_FEATURED_PRODUCTS } from '../../../../../../graphql/toktokmall/model';
import { useSelector } from 'react-redux';

const { width: screenWidth } = Dimensions.get('window')

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

  const truncateString = (string, length) => {
    if(string.length >= length){
      return `${string.slice(0, length)}...`
    }else{
      return string
    }
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('ToktokMallProductDetails', data), console.log(data);
        }}
        style={styles.button}>
        {data?.discountRate != '' && (
          <View
            style={styles.discountContainer}>
            <Text
              style={styles.discountText}>
              {data?.discountRate}
            </Text>
          </View>
        )}
        <View style={styles.margin1}></View>
        <Image
          source={getImageSource(data?.images)}
          style={styles.itemImage}
        />
        <Text
          style={styles.itemNameText}
          numberOfLines={1}
          ellipsizeMode="tail">
          {data?.itemname}
        </Text>
        <View style={styles.margin2}></View>
        <Text
          style={styles.priceText}>
          <Price amount={data?.price} />
        </Text>
        <View style={styles.comparePriceContainer}>
          <View style={styles.comparePriceSubContainer}>
            {data?.compareAtPrice != '0.00' &&  data?.compareAtPrice != "" ? (
              <Text
                style={styles.comparePriceText}>
                <Price amount={data?.compareAtPrice} />
              </Text>
            ) : null}
            {/* {data?.compareAtPrice == "0.00" && data?.otherinfo ?
						<Text style={{fontSize: 8, alignSelf: 'flex-start', paddingHorizontal: 5, color: "#9E9E9E"}}>
							{truncateString(data?.otherinfo, 25)}
            </Text> : null} */}
          </View>
          {/* <View style={{flex: 0, left: -12}}>
            <Text style={{fontSize: 9.5, alignSelf: 'center', color: "#FDBA1C"}}>{data?.discountRate}</Text>
          </View> */}
        </View>
        {data.refComDiscountRate && data.refComDiscountRate != '' ? (
          <>
            <RefComDiscountRate value={data.refComDiscountRate} w="80%" />
            <View style={styles.margin3}></View>
          </>
        ) : null}
      </TouchableOpacity>
    </>
  );
}

const Empty = ({data}) => {

  return (
    <>
      <View style={styles.emptyContainer}>
        <View style={styles.margin4}></View>
        <View style={styles.margin5} />
        {/* <Image source={getImageSource(data?.images)} style={{width: '100%', height: 120, resizeMode: 'stretch', alignSelf: 'center', borderRadius: 5}} /> */}
        <View style={styles.margin6}></View>
        <Text style={styles.emptyText1}></Text>
        <View style={styles.emptyText2}>
          <View style={styles.emptyText3Container}>
            <Text style={styles.emptyText3}></Text>          
          </View>
          <View style={styles.emptyText4Container}>
            <Text style={styles.emptyText4}></Text>
          </View>
        </View>
      </View>
    </>
  )
}

export const Featured = () => {

  const session = useSelector(state=>state.session)
  const navigation = useNavigation()
  const [featured, setFeatured] = useState([])

  const [getFeaturedProducts, {error, loading}] = useLazyQuery(GET_FEATURED_PRODUCTS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        offset: 0,
        limit: 8,
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

	const sliceData = (data) => {
		let copy = JSON.parse(JSON.stringify(data))
		let result = []
		result.push({items: copy.slice(0, 3)})
		result.push({items: copy.slice(3, 6)})
		return result
	}

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingBottom = 0;
    // console.log(layoutMeasurement.height + contentOffset.y, contentSize.height - paddingBottom)
    return layoutMeasurement.height + contentOffset.y == contentSize.height - paddingBottom;
  }

  useEffect(() => {
    getFeaturedProducts()
  }, [])

    return (
        <>
        <ImageBackground 
          source={flashsalebg}
          imageStyle={{resizeMode: 'cover'}}          
          style={styles.imageBackground}>
          
            <View style={styles.imageBackgroundContainer}>
              <View style={styles.featuredFlashContainer}>
                <Image source={featuredflash} style={styles.featuredFlashImage} />
              </View>
              {/* <View style={{flex: 0, justifyContent: 'center', paddingHorizontal: 4}}>
                <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Featured Items</Text>                
              </View> */}
              {/* <TouchableOpacity disabled = {loading} onPress={() => {
                navigation.navigate("ToktokMallSearch", {searchValue: "Featured Items", origin: "flashsale"})
              }} style={{flex: 3, flexDirection: 'row'}}>
                <View style={{flex: 3, alignItems: 'flex-end', justifyContent: 'center'}}>
                  <Text style={{fontSize: 12, color: "#F6841F", fontWeight: '600'}}>Shop now </Text>
                </View>
                <View style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
                  <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
                </View>
              </TouchableOpacity> */}
            </View>
            
            <View>            
              <View style={styles.flatListContainer}>
                
								{/* <Carousel
									layout={'stack'} 
									layoutCardOffset={`18`}
									data={sliceData(featured)}
									renderItem={({item, index}) => {

										if(!featured || featured.length == 0){
											return (
												// <Item key={index} data={item} />
												<>
													<View style={{flexDirection: 'row'}} >
														<Empty />
														<Empty />
														<Empty />
													</View>
												</>
											)
										}

										return (
											<>
												<View style={{flexDirection: 'row'}} >
													{item.items.map((raw, index) => {
														return <Item key={index} data={raw} />
													})}
												</View>
											</>
										)
										
									}}
									onSnapToItem={(index) => console.log(index) }
									sliderWidth={screenWidth -30}
									itemWidth={screenWidth -30}
									autoplay={false}
									autoplayDelay={2500}
									enableSnap={true}
									loop={false}
									hasParallaxImages={true}
									removeClippedSubviews={true}
								/> */}

                <FlatList                  
                  data={loading ? [1,2,3] : featured}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
										return (
											<>
												{loading && <Empty />}
                        {!loading && <Item key={index} data={item} />}
											</>
										)
                  }}
                />

              </View>
            </View>
          
          <View style={styles.margin7}></View>
        </ImageBackground>
        <View style={styles.margin8} />
        </>
    )
}

const styles = StyleSheet.create({ 
  button: {
    flex: 2,
    paddingBottom: 4,
    marginHorizontal: 2,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  discountContainer: {
    position: 'absolute', 
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
    color: '#fff',
    fontFamily: FONT.BOLD,
  },
  margin1: {
    height: 4
  },
  itemImage: {
    width: 100, 
    height: 100, 
    resizeMode: 'stretch', 
    alignSelf: 'center', 
    borderRadius: 5
  },
  itemNameText: {
    fontSize: 13, 
    fontWeight: '500', 
    paddingVertical: 5, 
    width: 90
  },
  margin2: {
    height: 2
  },
  priceText: {
    fontSize: 14, 
    fontWeight: '600', 
    color: '#F6841F', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 5
  },
  comparePriceContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  comparePriceSubContainer: {
    flex: 2
  },
  comparePriceText: {
    fontSize: 10,
    textDecorationLine: 'line-through',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    color: '#9E9E9E',
  },
  margin3: {
    height: 5
  },
  emptyContainer: {
    flex: 2, 
    paddingBottom: 4, 
    marginHorizontal: 2, 
    alignItems: 'center', 
    backgroundColor: "rgba(255,255,255,0.4)", 
    borderRadius: 5
  },
  margin4: {
    height: 4
  },
  margin5: {
    height: 120, 
    width: 110, 
    padding: 5 
  },
  margin6: {
    height: 2
  },
  emptyText1: {
    fontSize: 14, 
    fontWeight: '600', 
    color: "#F6841F", 
    alignSelf: 'flex-start', 
    paddingHorizontal: 5
  },
  emptyText2: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  emptyText3Container: {
    flex: 2
  },
  emptyText3: {
    fontSize: 10, 
    textDecorationLine: 'line-through', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 5, 
    color: "#9E9E9E"
  },
  emptyText4Container: {
    flex: 1
  },
  emptyText4: {
    fontSize: 9.5, 
    alignSelf: 'center', 
    color: "#FDBA1C"
  },
  imageBackground: {
    flex: 1, 
    paddingHorizontal: 15, 
    paddingVertical: 0
  },
  imageBackgroundContainer: {
    paddingVertical: 20, 
    flexDirection: 'row'
  },
  featuredFlashContainer: {
    flex: 1
  },
  featuredFlashImage: {
    width: '38%', 
    height: 40, 
    resizeMode: 'stretch', 
    justifyContent: 'center', 
    alignSelf: 'flex-start'
  },
  flatListContainer: {
    flex: 1, 
    flexDirection: 'row'
  },
  margin7: {
    height: 15
  },
  margin8: {
    flex: 0.5, 
    height: 8, 
    backgroundColor: '#F7F7FA'
  }
})