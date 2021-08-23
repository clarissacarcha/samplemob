import React, {useRef, useEffect, useState} from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_PRODUCT_DETAILS } from '../../../../graphql/toktokmall/model';
import {View, SafeAreaView, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity, AsyncStorage, Dimensions} from 'react-native';
import {connect} from 'react-redux'
import Spinner from 'react-native-spinkit';
import Toast from 'react-native-simple-toast';
import { FONT } from '../../../../res/variables';
import { Header, AdsCarousel, MessageModal } from '../../../Components';
import CustomIcon from '../../../Components/Icons';
import {ASAddToCart, ASClearCart} from '../../../helpers';
import ContentLoader, {InstagramLoader, FacebookLoader} from 'react-native-easy-content-loader'
import { MergeStoreProducts } from '../../../helpers';

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

  VariationBottomSheet,
  LoadingOverlay
} from './components'

import Animated, {interpolate, Extrapolate, useCode, set, greaterThan} from 'react-native-reanimated'

const Component =  ({
  navigation,
  createMyFavorites,
  createMyCartSession,
  myCart, route
}) => {

  const [product, setProduct] = useState({})
  const [images, setImages] = useState([])
  const [store, setStore] = useState({})
  const [relevantProducts, setRelevantProducts] = useState([])
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

  let AnimatedHeaderValue = new Animated.Value(0)
  const animatedHeaderValueRef = useRef(AnimatedHeaderValue)

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
        setRelevantProducts(response.getProductDetails.relevantProducts)
        if(response.getProductDetails.noOfStocks == 0) setisOutOfStock(true)
      }
      // console.log(response, route.params.Id)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const cartObject = (input) => {
    return {
      item_id: product.Id,
      label: product.itemname,
      originalPrice: product.compareAtPrice,
      price: product.price,
      variation: input.variation || "",
      qty: input.qty || 1,
      store_id: store.id,
      storeName: store.shopname,
      images: images
    }
  }

  const onBuyNow = (input) => {
    navigation.push("ToktokMallCheckout", {
      type: "single",
      data: MergeStoreProducts([cartObject(input)]),
      newCart: [],
      vouchers: [],
    })
  }
  
  const onAddToCart = (input) => {

    let raw = cartObject(input)
    createMyCartSession('push', raw)
    setCartItems(CountCartItems)
    setMessageModalShown(true)
  }

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
    {useNativeDriver: false}
  )

  const CountCartItems = () => {
    // return myCart.length
    let total = 0
    for(let x = 0; myCart.length > x; x++){
      total = total + myCart[x].qty
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
    // console.log('dataaaaaaaaaaaaaaa', route.params.itemname)
  }, [])  

  if(error) {
    return (
      <>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Something went wrong</Text>
        </View>
      </>
    )
  }

  // if(loading) {
  //   return (
  //     <>
  //       <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
  //         <Spinner 
  //           isVisible={loading}
  //           type='Circle'
  //           color={"#F6841F"}
  //           size={35}
  //         />
  //       </View>
  //     </>
  //   )
  // }

  return (
    <>
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      
      {/* {scrolling ? <HeaderPlain /> : <HeaderTransparent />} */}
      { loading ? <></> :  <HeaderPlain animatedValue={animatedHeaderValueRef} cartItems={cartItems} itemName = {route.params.itemname} /> }
      { loading ? <></> :  <HeaderTransparent animatedValue={animatedHeaderValueRef} cartItems={cartItems} /> }
      {/* <LoadingOverlay  isVisible = {loading} /> */}
      <Animated.ScrollView
        scrollEventThrottle = {270}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        {...{onScroll}}
        scrollEnabled = {!loading}
      >
        <ContentLoader active loading = {loading} avatar aShape = {'square'} title = {false} pRows = {0}
          aSize = {250} avatarStyles = {{width: Dimensions.get('window').width, left: -10}}
        >
          <ProductCarousel 
            data={images} 
            isOutOfStock={isOutOfStock} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            loading = {loading}
          />
        </ContentLoader>
        <RenderProduct
          data={product} 
          shop={store} 
          animatedValue = {AnimatedHeaderValue}
          onOpenVariations={() => {
            setVariationOptionType(0)
            varBottomSheetRef.current.expand()
          }}
          loading = {loading}
        />
        <RenderStore 
          data={store} 
          loading = {loading}
        />
        <RenderDescription 
          data={product} 
          loading = {loading}
        />
        {/* <RenderReviews /> */}
        <RenderSuggestions data={relevantProducts || []} />
        <View style={{height: 60}} />
      </Animated.ScrollView>

      { loading ? <></> :
        <RenderFooter 
          hideBuyNow={isOutOfStock}
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
          onPressAddToFavorites={() => {
            Toast.show("Added to favorites")
          }}
        />
      }

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

    </SafeAreaView>
    
    </>
  );
}

const mapStateToProps = (state) => ({
  myCart: state.toktokMall.myCart
})

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
  createMyFavorites: (action, payload) => dispatch({type: 'TOKTOK_MY_FOLLOWING', action,  payload}),
});

export const ToktokMallProductDetails = connect(mapStateToProps, mapDispatchToProps)(Component);

