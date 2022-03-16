import React, {useState} from "react";
import { View , Text , StyleSheet , Image , FlatList , Dimensions } from 'react-native'
import { moderateScale } from 'toktokload/helper'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { blank } from 'toktokload/assets/ads'
import CONSTANTS from 'common/res/constants'
import { LoadingIndicator } from "src/ToktokLoad/components";

const { FONT_SIZE, COLOR , SIZE , FONT_FAMILY: FONT , MARGIN} = CONSTANTS
const { width , height } = Dimensions.get("window")

const DisplayImage = ({item, index, autoplay})=> {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={{flex:1}}>
      { imageLoading && (
        <View style={styles.loadingContainer}>
          <LoadingIndicator isLoading={true} size="small" />
        </View>
      )}
      <Image
        source={{
          uri: item.filename
        }}
        style={[styles.adImage, {...(autoplay ? {width}: { borderRadius: moderateScale(10) })}]}
        resizeMode="stretch"
        onLoadStart={() => { setImageLoading(true) }}
        onLoadEnd={() => { setImageLoading(false) }}
      />
    </View> 
  )
}

export const Advertisement = ({
  ads,
  autoplay
})=> {

  return (
    <View style={styles.container}>
      {
        autoplay ? (
          <Carousel
            layout="default"
            data={ads}
            renderItem={({item,index})=><DisplayImage autoplay={autoplay} item={item} index={index}/>}
            sliderWidth={width}
            sliderHeight={height * 0.15}
            itemWidth={width}
            autoplay={true}
            loop={true}
            autoplayDelay={0} 
            autoplayInterval={5000}
          />
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            data={ads}
            keyExtractor={item=>item.id}
            renderItem={({item,index})=><DisplayImage autoplay={autoplay} item={item} index={index}/>}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.15,
  },
  adImage: {
    height: height * 0.15,
    width: width - moderateScale(16 * 2),
  },
  loadingContainer: {
    backgroundColor: "rgba(255, 235, 189, 0.45)",
    position: "absolute",
    bottom:0,
    top:0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
