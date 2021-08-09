import React, {useRef, useEffect, useState} from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_PRODUCT_DETAILS } from '../../../../graphql/toktokmall/model';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity, AsyncStorage} from 'react-native';
import {connect} from 'react-redux'
import { FONT } from '../../../../res/variables';
import { Header, AdsCarousel, MessageModal } from '../../../Components';
import CustomIcon from '../../../Components/Icons';
import {ASAddToCart, ASClearCart} from '../../../helpers';

import {

  HeaderPlain,
  HeaderTransparent,

  ProductCarousel,

  RenderDescription, 
  RenderFooter, 
  RenderProduct, 
  RenderReviews, 
  RenderStore, 
  RenderSuggestions,

  VariationBottomSheet
} from './components'

import Animated, {interpolate, Extrapolate, useCode, set} from 'react-native-reanimated'
// import console = require('console');

const item = {
  store_id: 4,
    store: 'The Apparel 3',
    cart: [
      {
        item_id: 1,
        label: 'Graphic Tees',
        originalPrice: 380,
        price: 50,
        variation: 'White, L',
        qty: 2,
        store_id: 4,
        store: 'The Apparel 3',
      },
    ],
    delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
}

const Component = ({navigation, route, createMyCartSession}) => {

  const [product, setProduct] = useState({})
  const [images, setImages] = useState([])
  const [store, setStore] = useState({})
  const varBottomSheetRef = useRef()
  const BuyBottomSheetRef = useRef()
  const CartBottomSheetRef = useRef()
  const [scrolling, setScrolling] = useState(false)
  const [variationOptionType, setVariationOptionType] = useState(0)
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [isOutOfStock, setisOutOfStock] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [enteredQuantity, setEnteredQuantity] = useState(0)
  const [selectedVariation, setSelectedVariation] = useState('')

  let AnimatedHeaderValue = new Animated.Value(0);

  const HandleOnScroll = (r) => {
    let ypos = r.nativeEvent.contentOffset.y
    if(ypos > 50) setScrolling(true)
    else if (ypos <= 50) setScrolling(false)
  }

  const [getProductDetails, {error, loading}] = useLazyQuery(GET_PRODUCT_DETAILS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        id: route.params.Id
      }
    },
    onCompleted: (response) => {
      if(response.getProductDetails){
        setProduct(response.getProductDetails)
        setImages(response.getProductDetails.images)
        setStore(response.getProductDetails.shop)

        if(response.getProductDetails.noOfStocks == 0) setisOutOfStock(true)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  useEffect(() => {
    getProductDetails()
  }, [])

  const onBuyNow = () => {
    createMyCartSession('push',item)
  }

  return (
    <>
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      
      {/* {scrolling ? <HeaderPlain /> : <HeaderTransparent />} */}
      {/* PLAIN HEADER*/}
      <HeaderPlain animatedValue = {AnimatedHeaderValue}/>

      {/* TRANSPARENT HEADER*/}
      <HeaderTransparent animatedValue = {AnimatedHeaderValue}/>


      <Animated.ScrollView
        scrollEventThrottle = {270}
        onScroll = {
          Animated.event(
            [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
            {useNativeDriver: false}
          )
        }
        showsVerticalScrollIndicator={false}

      >
        <ProductCarousel 
          data={images} 
          isOutOfStock={isOutOfStock} 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
        />
        <RenderProduct
          data={product} 
          animatedValue = {AnimatedHeaderValue}
          onOpenVariations={() => {
            setVariationOptionType(0)
            varBottomSheetRef.current.expand()
          }}          
        />
        <RenderStore 
          data={store} 
        />
        <RenderDescription 
          data={product} 
        />
        <RenderReviews />
        <RenderSuggestions />
        <View style={{height: 60}} />
      </Animated.ScrollView>

      <RenderFooter 
        onPressVisitStore={() => {
          navigation.navigate("ToktokMallStore", store)
        }}
        onPressBuyNow={() => {
          setVariationOptionType(2)
          // varBottomSheetRef.current.expand()
          onBuyNow()
        }}
        onPressAddToCart={() => {
          setVariationOptionType(1)
          varBottomSheetRef.current.expand()
        }}
      />

      <VariationBottomSheet 
        ref={varBottomSheetRef} 
        type={variationOptionType}
        onPressAddToCart={(input) => {
          varBottomSheetRef.current.close()
          setTimeout(async () => {
            // await ASClearCart("bryan")

            const rawdata = {
              ...product,
              variant: input.variation,
              quantity: input.qty
            }

            await ASAddToCart("bryan", rawdata, () => {
              setMessageModalShown(true) 
            })
          }, 300)
          // alert('something')
        }}
        onPressBuyNow={() => null}
      />

      {messageModalShown && 
      <MessageModal 
        type="Success"
        isVisible={messageModalShown}
        setIsVisible={(val) => setMessageModalShown(val)}
        message="Item has been added to your cart."
      />}

    </View>
    
    </>
  );
}

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
});

export const ToktokMallProductDetails = connect(null, mapDispatchToProps)(Component)
