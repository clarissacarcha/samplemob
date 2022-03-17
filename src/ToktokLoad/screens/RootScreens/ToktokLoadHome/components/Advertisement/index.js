import React, {useState, useEffect} from "react";
import { View , Text , StyleSheet , Image , FlatList , Dimensions, PixelRatio } from 'react-native'
import { moderateScale } from 'toktokload/helper'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { blank } from 'toktokload/assets/ads'
import CONSTANTS from 'common/res/constants'
import { LoadingIndicator } from "src/ToktokLoad/components";

const { FONT_SIZE, COLOR , SIZE , FONT_FAMILY: FONT , MARGIN} = CONSTANTS
const { width , height } = Dimensions.get("window")

const DisplayImage = ({item, index, autoplay, bannerHeight, setBannerHeight })=> {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={{flex:1}}>
      { imageLoading && (
        <View style={styles.loadingContainer}>
          <LoadingIndicator isLoading={true} size="small" />
        </View>
      )}
      <Image
        source={{ uri: item.filename }}
        style={[styles.adImage, {...(autoplay ? {width}: { borderRadius: moderateScale(10) })}]}
        onLoadStart={() => { setImageLoading(true) }}
        onLoadEnd={() => { setImageLoading(false) }}
        resizeMode="stretch"
      />
    </View> 
  )
}

export const Advertisement = ({
  ads,
  autoplay
})=> {
  const [bannerHeight, setBannerHeight] = useState(0);

  const adsss = [
    {"__typename": "Advertisement", "description": "sample 3", "displayOrder": 5, "filename": "https://www.alltech.com/sites/default/files/2020-01/PoP-Facebook-1000x250(1).jpg", "id": "6", "postingEndDate": "2022-03-31 00:00:00", "postingStartDate": "2022-03-17 00:00:00", "title": "sample 3", "type": "2"},
    {"__typename": "Advertisement", "description": "sample 3", "displayOrder": 5, "filename": "https://www.esmo.org/var/esmo/storage/images/media/esmo/meetings/2022/esmo-summit-russia-2022/esmo-summit-russia-2022-1000x250/8662480-2-eng-GB/esmo-summit-russia-2022-1000x250.jpg", "id": "6", "postingEndDate": "2022-03-31 00:00:00", "postingStartDate": "2022-03-17 00:00:00", "title": "sample 3", "type": "2"},
    {"__typename": "Advertisement", "description": "sample 3", "displayOrder": 5, "filename": "https://mygfsi.com/wp-content/uploads/2020/01/shutterstock_344934188-1000x250-1.jpg", "id": "6", "postingEndDate": "2022-03-31 00:00:00", "postingStartDate": "2022-03-17 00:00:00", "title": "sample 3", "type": "2"},
  ]
  return (
    <View style={styles.container}>
      {
        autoplay ? (
          <Carousel
            layout="default"
            data={ads}
            renderItem={({item,index})=><DisplayImage bannerHeight={bannerHeight} setBannerHeight={setBannerHeight} autoplay={autoplay} item={item} index={index}/>}
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
            renderItem={({item,index})=><DisplayImage bannerHeight={bannerHeight} setBannerHeight={setBannerHeight} autoplay={autoplay} item={item} index={index}/>}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 90,
  },
  adImage: {
    height: 90,
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
