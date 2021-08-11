import React, {useRef, useEffect, useState} from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity, AsyncStorage} from 'react-native';
import {connect} from 'react-redux'
import { FONT } from '../../../../res/variables';
import { Header, AdsCarousel, MessageModal } from '../../../Components';
import CustomIcon from '../../../Components/Icons';

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

const Component =  ({
  navigation,
  createMyCartSession,
}) => {

  const varBottomSheetRef = useRef()
  const BuyBottomSheetRef = useRef()
  const CartBottomSheetRef = useRef()
  const [scrolling, setScrolling] = useState(false)
  const [variationOptionType, setVariationOptionType] = useState(0)
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [isOutOfStock, setisOutOfStock] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  let AnimatedHeaderValue = new Animated.Value(0);

  const HandleOnScroll = (r) => {
    let ypos = r.nativeEvent.contentOffset.y
    if(ypos > 50) setScrolling(true)
    else if (ypos <= 50) setScrolling(false)
  }

  const onAddToCart = () => {
    createMyCartSession('push',item)
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

  return (
    <>
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      
      {/* {scrolling ? <HeaderPlain /> : <HeaderTransparent />} */}
      {/* PLAIN HEADER*/}
      {/* <HeaderPlain animatedValue = {AnimatedHeaderValue}/> */}

      {/* TRANSPARENT HEADER*/}
      {/* <HeaderTransparent animatedValue = {AnimatedHeaderValue}/> */}
      <Animated.Text style = {[{position: 'absolute', zIndex: 1}, {opacity: something}]}>testing</Animated.Text>
      <Animated.Text style = {[{position: 'absolute', zIndex: 1}, {opacity: something2}]}>gnitset</Animated.Text>
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
        <ProductCarousel isOutOfStock={isOutOfStock} isLoading = {isLoading} setIsLoading = {setIsLoading} />
        <RenderProduct 
          onOpenVariations={() => {
            setVariationOptionType(0)
            varBottomSheetRef.current.expand()
          }}
          animatedValue = {AnimatedHeaderValue}
        />
        <RenderStore />
        <RenderDescription />
        <RenderReviews />
        <RenderSuggestions />
        <View style={{height: 60}} />
      </Animated.ScrollView>

      <RenderFooter 
        onPressVisitStore={() => null}
        onPressBuyNow={() => {
          setVariationOptionType(2)
          varBottomSheetRef.current.expand()
          // onBuyNow()
        }}
        onPressAddToCart={() => {
          setVariationOptionType(1)
          varBottomSheetRef.current.expand()
          
        }}
      />

      <VariationBottomSheet 
        ref={varBottomSheetRef} 
        type={variationOptionType}
        onPressAddToCart={() => {
          varBottomSheetRef.current.close()
          setTimeout(() => {
            setMessageModalShown(true)
          }, 300)
          // alert('something')
          onAddToCart()
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
// );

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
});

export const ToktokMallProductDetails = connect(null, mapDispatchToProps)(Component);

