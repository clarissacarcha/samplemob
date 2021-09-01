import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, Platform, Text, Image, FlatList} from 'react-native';

// assets
import {star, star_no_fill, star_gray, star_half} from 'toktokfood/assets/images';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';
import {COLORS, FONTS, FONT_SIZE, NUMBERS, BUTTON_HEIGHT} from 'res/constants';

const RenderStar = ({ item, rating, readOnly, onPressStar, isGrayStar, starImgStyle }) => {
    let rate = parseInt(rating[0]) + 1 == item && rating.includes(".")
 
    if(readOnly){
        return (
            <Image
                source={ item <= rating ? star : rate ? star_half : star_gray }
                style={[styles.starImg, starImgStyle]}
                resizeMode="contain"
            />
        )
    }
    return (
        <TouchableOpacity onPress={() => onPressStar(item)}>
            <Image
                source={ item <= rating ? star : isGrayStar ? star_gray : star_no_fill}
                style={[styles.starImg, starImgStyle]}
                resizeMode="contain"
            />
        </TouchableOpacity>
    )
}


const CustomStarRating = (props) => {

    const {
        rating = "0",
        readOnly,
        showReviews,
        showRating,
        reviewStyle,
        isGrayStar,
        onFinishRating,
        starImgStyle
    } = props;
    const reviews = ["Very Dissatisfied", "Dissatisfied", "Fair", "Satisfied", "Very Satisfied"] 
    const maxRating = [1, 2, 3, 4, 5];
   
    const onPressStar = (item) => {
        onFinishRating(item)
    }

    return (
        <>
            { showReviews && <Text style={[ styles.reviewText, reviewStyle ]}>{reviews[rating - 1]}</Text> }
            <FlatList
                horizontal
                data={maxRating}
                renderItem={({item}) => (
                    <RenderStar
                        isGrayStar={isGrayStar}
                        readOnly={readOnly}
                        item={item}
                        rating={rating}
                        onPressStar={onPressStar}
                        starImgStyle={starImgStyle}
                    />
                )}
                scrollEnabled={false}
                extraData={props}
            />
            { showRating && <Text style={styles.ratingText}>{`${parseFloat(rating).toFixed(1)} stars`}</Text> }
        </>
    )
};

export default CustomStarRating;

const styles = StyleSheet.create({
    image: {
        resizeMode: 'cover',
    },
    container: {
        zIndex: 1,
    },
    ratingText: {
        fontSize: 14,
        fontFamily: FONTS.MEDIUM,
        textAlign: 'center',
        color: '#FFA700',
        paddingTop: 15
    },
    reviewText: {
        fontSize: 14,
        fontFamily: FONTS.MEDIUM,
        textAlign: 'center',
        color: '#000',
        paddingBottom: 10
    },
    starImg: {
        width: moderateScale(40),
        height: moderateScale(40)
    }
});
