import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CustomIcon from '../Icons';

export const AdsCarousel = (props) => {

  const [activeSlide, setActiveSlide] = useState(0)
  const [entries, setEntries] = useState([1, 2, 3])

  const renderItem = ({item, index}) => {
    return (
      <View>
        <Image source={require("../../../assets/toktokmall-assets/images/ads.png")} style={{width: '100%', height: 130, resizeMode: 'stretch'}} />
      </View>
    )
  }

  return (
    <View style={{paddingHorizontal: 15, paddingTop: 5}}>
      <Carousel
        data={entries}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveSlide(index) }
        sliderWidth={330}
        itemWidth={330}
      />
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        renderDots={(activeIndex) => {
          return (
            <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center',justifyContent: 'center', bottom: "-200%"}}>
              {entries.map((d, i) => <View style={{paddingHorizontal: 8}}>
                <CustomIcon.MCIcon name={i == activeIndex ? "circle" : "circle-outline"} color="#fff" size={10} />
              </View>)}              
            </View>
          )
        }}
        containerStyle={{ backgroundColor: 'transparent', position: 'absolute', bottom: 0, alignSelf: 'center', alignContent: 'flex-end' }}
        // dotStyle={{
        //   width: 10,
        //   height: 10,
        //   borderRadius: 5,
        //   marginHorizontal: 0,
        //   backgroundColor: '#fff'
        // }}
        // dotContainerStyle={{
        //   padding: 0
        // }}
        // inactiveDotStyle={{
        //   borderColor: '#fff'
        //   // Define styles for inactive dots here
        // }}
        // inactiveDotOpacity={0.4}
        // inactiveDotScale={0.6}
      />
    </View>
  )

}