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

export const ToktokMallProductDetails = ({navigation}) => {

  const varBottomSheetRef = useRef()
  const BuyBottomSheetRef = useRef()
  const CartBottomSheetRef = useRef()
  const [scrolling, setScrolling] = useState(false)
  const [variationOptionType, setVariationOptionType] = useState(0)
  const [messageModalShown, setMessageModalShown] = useState(false)

  const HandleOnScroll = (r) => {
    let ypos = r.nativeEvent.contentOffset.y
    if(ypos > 50) setScrolling(true)
    else if (ypos <= 50) setScrolling(false)
  }

  return (
    <>
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      
      {scrolling ? <HeaderPlain /> : <HeaderTransparent />}

      <SectionList         
        renderSectionHeader={({section: {title}}) => (<View />)}
        sections={[
          {title: 'Carousel', data: [1], renderItem: () => 
            <ProductCarousel />
          },
          {title: 'Product', data: [1], renderItem: () => 
            <RenderProduct 
              onOpenVariations={() => {
                setVariationOptionType(0)
                varBottomSheetRef.current.expand()
              }}
            />
          },
          {title: 'Store', data: [1], renderItem: () => <RenderStore />},
          {title: 'Description', data: [1], renderItem: () => <RenderDescription />},
          {title: 'Reviews', data: [1], renderItem: () => <RenderReviews />},
          {title: 'Suggestions', data: [1], renderItem: () => <RenderSuggestions />},
          {title: 'FooterOverlay', data: [1], renderItem: () => <View style={{height: 60}} />},
        ]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
        onScroll={HandleOnScroll}
      />

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
