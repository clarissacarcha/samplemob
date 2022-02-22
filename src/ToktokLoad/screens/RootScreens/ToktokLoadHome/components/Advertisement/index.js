import React from "react";
import { View , Text , StyleSheet , Image , FlatList , Dimensions } from 'react-native'
import { moderateScale } from 'toktokload/helper'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CONSTANTS from 'common/res/constants'

const { FONT_SIZE, COLOR , SIZE , FONT_FAMILY: FONT , MARGIN} = CONSTANTS
const { width , height } = Dimensions.get("window")

const DisplayImage = ({item,index,autoplay})=> {

    return (
        <View style={{flex:1}}>
            <Image
                source={item.image}
                style={[styles.adImage, {...(autoplay ? {width}: {})}]}
                resizeMode="cover"
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
                autoplay 
                ?  <Carousel
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
                :  <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.container}
                        data={ads}
                        keyExtractor={item=>item.id}
                        renderItem={({item,index})=><DisplayImage autoplay={autoplay} item={item} index={index}/>}
                    />
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
    }
})
