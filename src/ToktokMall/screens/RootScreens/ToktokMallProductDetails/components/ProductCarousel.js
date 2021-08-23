import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground,  StyleSheet, Platform, Dimensions, Image} from 'react-native';
import Carousel, { Pagination, ParallaxImage,  } from 'react-native-snap-carousel';
import CustomIcon from '../../../../Components/Icons';
import {placeholder} from '../../../../assets';
import { FONT, COLOR } from '../../../../../res/variables';
import FastImage from 'react-native-fast-image'

import {coppermask} from '../../../../assets';
import {Image as RNEImage} from 'react-native-elements'; 
import Spinner from 'react-native-spinkit';

const { width: screenWidth } = Dimensions.get('window')
const HEIGHT = 250

export const ProductCarousel = ({data, isOutOfStock, isLoading, setIsLoading, loading}) => {

  const [activeSlide, setActiveSlide] = useState(0)
  const [entries, setEntries] = useState([1, 2, 3, 4, 5])
  const [imageLink, setImageLink] =useState('')
  const [hasSwiped, sethasSwiped] = useState(false)
  

  const renderItem = ({item, index}, parallaxProps) => {

    const getImage = () => {
      if(typeof item == "object" && item?.filename) return {uri: item?.filename}
      else return placeholder
    }

    return (
      <View style={{width: Dimensions.get("screen").width, height: HEIGHT}}>
        {isOutOfStock && 
        <View style={{position: "absolute", zIndex: 1, top: 60, left: HEIGHT / 2.5, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 150, height: 150, borderRadius: 150/2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: 18, color: "#fff"}}>OUT OF STOCK</Text>
          </View>
        </View>}
          <ParallaxImage
           // source={{uri: "https://cdn.searchenginejournal.com/wp-content/uploads/2019/04/shutterstock_456779230.png"}}
            source={getImage()}
            // onLoadEnd = {() => {setIsLoading(false)}}
            containerStyle={[styles.pxImageContainerStyle]}
            style={{
              ...StyleSheet.absoluteFillObject,
              resizeMode: 'stretch'
            }}
            parallaxFactor={0.05}
            {...parallaxProps}
          />
      </View>
    )
  }

  return (
    <View style={{paddingHorizontal: 0, paddingTop: 0, height: HEIGHT}}>
      <View style={{height: 0}} />
        <Carousel
          data={data}
          renderItem={renderItem}
          onSnapToItem={(index) => {setActiveSlide(index), sethasSwiped(false)} }
          sliderWidth={Dimensions.get("screen").width}
          itemWidth={Dimensions.get("screen").width}
          // autoplay={true}
          // autoplayDelay={700}
          hasParallaxImages={true}
          onScrollEndDrag = {() => {setIsLoading(true)}}
        />
      
        { loading ? <></>:
          <Pagination
            dotsLength={data.length}
            activeDotIndex={activeSlide}
            renderDots={(activeIndex) => {
              return (            
                <View style={{width: '100%', alignContent: 'center', alignSelf: 'center'}}>
                  <View style={{width: '20%', marginLeft: '40%', flexDirection: 'row', alignItems: 'center'}}>
                    {data.map((d, i) => 
                    <View style={{flex: 1, paddingHorizontal: 3}}>
                      <CustomIcon.MCIcon name={i == activeIndex ? "circle" : "circle-outline"} color="#F6841F" size={6} />
                    </View>)}
                  </View>
                  <Text style={{fontSize: 9, alignSelf: 'center', textAlign: 'center'}}>{activeIndex + 1}/{data.length}</Text>
                </View>
              )
            }}
            containerStyle={{
              position: 'absolute',
              backgroundColor: 'transparent',
              bottom: -40,
              alignItems: 'center',
              justifyContent: 'center'
            }}        
          />
        }
    </View>
  )

}

const styles = StyleSheet.create({
  paginationContainerStyle: {
    backgroundColor: 'transparent', top: -20, padding: 0, alignSelf: 'center', alignContent: 'flex-end', backgroundColor: 'transparent'
  },
  paginationDotContainerStyle: {
    height: 0, width: '30%', marginLeft: '35%', flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'
  },
  pxImageContainerStyle: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 0,
  }
})