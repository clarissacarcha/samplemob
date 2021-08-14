import React, {useRef, useEffect, useState} from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_PRODUCT_DETAILS } from '../../../../graphql/toktokmall/model';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity, AsyncStorage} from 'react-native';
import {connect} from 'react-redux'
import Spinner from 'react-native-spinkit';
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

import Animated, {interpolate, Extrapolate, useCode, set, greaterThan} from 'react-native-reanimated'

const Component =  ({
  navigation,
  createMyCartSession, myCart, route
}) => {

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
  const [cartItems, setCartItems] = useState(0)

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

  const cartObject = (input) => {
    return {
      store_id: store.id,
      store: store.shopname,
      cart: [
        {
          item_id: product.Id,
          label: product.itemname,
          originalPrice: product.compareAtPrice,
          price: product.price,
          variation: input.variation || "",
          qty: input.qty || 1,
          store_id: store.id,
          store: store.shopname,
          images: images
        }
      ],
      delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
    }
  }

  const onBuyNow = (input) => {
    navigation.push("ToktokMallCheckout", {
      data: [cartObject(input)],
      vouchers: [],
    })
  }
  
  const onAddToCart = (input) => {

    let raw = cartObject(input)
    createMyCartSession('push', raw)
    setCartItems(CountCartItems)
    setMessageModalShown(true)
  }

  const something = AnimatedHeaderValue.interpolate({
    inputRange: [0, 150],
    outputRange: [0,  1],
    // extrapolateLeft: Extrapolate.CLAMP
    extrapolate: 'clamp'
  })

  const something2 = AnimatedHeaderValue.interpolate({
    inputRange: [0, 150],
    outputRange: [1,  0],
    // extrapolateLeft: Extrapolate.CLAMP
    extrapolate: 'clamp'
  })

  const CountCartItems = () => {
    // return myCart.length
    let total = 0
    for(let x = 0; myCart.length >  x; x++){
      for(let y=0; myCart[x].cart.length > y; y++){
        total = total + 1
      }
    }
    if(total > 99){
      return "99+"
    }else {
      return total
    }
  }

  useEffect(() => {
    getProductDetails()
    setCartItems(CountCartItems)
  }, [])  

  if(loading) {
    return (
      <>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Spinner 
            isVisible={loading}
            type='Circle'
            color={"#F6841F"}
            size={35}
          />
        </View>
      </>
    )
  }

  return (
    <>
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      
      {/* {scrolling ? <HeaderPlain /> : <HeaderTransparent />} */}
      {/* PLAIN HEADER*/}
      <HeaderPlain animatedValue={AnimatedHeaderValue} cartItems={cartItems} />

      {/* TRANSPARENT HEADER*/}
      <HeaderTransparent animatedValue={AnimatedHeaderValue} cartItems={cartItems} />

      {/* <Animated.Text style = {[{position: 'absolute', zIndex: 1}, {opacity: something}]}>testing</Animated.Text>
      <Animated.Text style = {[{position: 'absolute', zIndex: 1}, {opacity: something2}]}>gnitset</Animated.Text> */}
      <Animated.ScrollView
        // onScroll={HandleOnScroll}
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
          varBottomSheetRef.current.expand()
        }}
        onPressAddToCart={() => {
          setVariationOptionType(1)
          varBottomSheetRef.current.expand()
        }}
      />

      <VariationBottomSheet 
        ref={varBottomSheetRef} 
        type={variationOptionType}
        item={product}
        image={images.length > 0 ? images[0] : {}}
        onPressAddToCart={(input) => {
          varBottomSheetRef.current.close()
          onAddToCart(input)
        }}
        onPressBuyNow={(input) => {
          varBottomSheetRef.current.close()
          onBuyNow(input)
        }}
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

const mapStateToProps = (state) => ({
  myCart: state.toktokMall.myCart
})

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
});

export const ToktokMallProductDetails = connect(mapStateToProps, mapDispatchToProps)(Component);

