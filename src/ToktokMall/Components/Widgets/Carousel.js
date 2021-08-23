import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, StyleSheet, Platform, Dimensions} from 'react-native';
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import CustomIcon from '../Icons';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../graphql';
import { GET_ADS } from '../../../graphql/toktokmall/model';
import ContentLoader from 'react-native-easy-content-loader'
const SampleImage = require("../../assets/images/ads.png")

const { width: screenWidth } = Dimensions.get('window')

export const AdsCarousel = (props) => {

  const [activeSlide, setActiveSlide] = useState(0)
  const [entries, setEntries] = useState([1, 2, 3])

  const [getAds, {error, loading}] = useLazyQuery(GET_ADS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      if(response && response.getAdvertisements.length > 0){
        setEntries(response.getAdvertisements)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const renderItem = ({item, index}, parallaxProps) => {

    const getImage = (raw) => {
      if(typeof raw == "object"){
        return {uri: raw.filename}
      }else{
        return SampleImage
      }
    }

    return (
      <ContentLoader active loading = {loading} avatar = {false}  title = {true} pRows = {0}
        tHeight = {130}  tWidth= {'100%'} avatarStyles = {{ left: 0, borderRadius: 5}} 
      >
        <View style={{width: 330, height: 130}}>
        {/* <Image source={SampleImage} style={{width: '100%', height: 130, resizeMode: 'stretch'}} /> */}
          <ParallaxImage
            // source={{uri: "https://cdn.searchenginejournal.com/wp-content/uploads/2019/04/shutterstock_456779230.png"}}
            source={getImage(item?.image)}
            containerStyle={styles.pxImageContainerStyle}
            style={{
              ...StyleSheet.absoluteFillObject,
              resizeMode: 'stretch'
            }}
            parallaxFactor={0}
            {...parallaxProps}
          />
        </View>
      </ContentLoader>
      
    )
  }

  useEffect(() => {
    getAds()
  }, [])

  return (
    <View style={{paddingHorizontal: 15, paddingTop: 5, backgroundColor: "transparent"}}>
      <Carousel
        data={entries}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveSlide(index) }
        sliderWidth={330}
        itemWidth={330}
        autoplay={true}
        autoplayDelay={700}
        hasParallaxImages={true}
        removeClippedSubviews={true}
      />
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        renderDots={(activeIndex) => {
          return (
            <View style={styles.paginationDotContainerStyle}>
              {entries.map((d, i) => <View style={{paddingHorizontal: 8}}>
                <CustomIcon.MCIcon name={i == activeIndex ? "circle" : "circle-outline"} color="#fff" size={10} />
              </View>)}              
            </View>
          )
        }}
        containerStyle={styles.paginationContainerStyle}        
      />
    </View>
  )

}

const styles = StyleSheet.create({
  paginationContainerStyle: {
    backgroundColor: 'transparent', position: 'absolute', bottom: 0, alignSelf: 'center', alignContent: 'flex-end'
  },
  paginationDotContainerStyle: {
    flex: 1, flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center',justifyContent: 'center', bottom: "-200%"
  },
  pxImageContainerStyle: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  }
})