import React, {useRef, useEffect, useState} from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity} from 'react-native';

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

export const ToktokMallProductDetails = ({navigation}) => {

  const varBottomSheetRef = useRef()
  const BuyBottomSheetRef = useRef()
  const CartBottomSheetRef = useRef()
  const [scrolling, setScrolling] = useState(false)
  const [variationOptionType, setVariationOptionType] = useState(0)
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [isOutOfStock, setisOutOfStock] = useState(false)

  let AnimatedHeaderValue = new Animated.Value(0);


  const HandleOnScroll = (r) => {
    let ypos = r.nativeEvent.contentOffset.y
    if(ypos > 50) setScrolling(true)
    else if (ypos <= 50) setScrolling(false)
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
        <ProductCarousel isOutOfStock={isOutOfStock} />
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
};
