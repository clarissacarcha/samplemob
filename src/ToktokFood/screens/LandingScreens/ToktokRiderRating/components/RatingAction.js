import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, FlatList, Image } from 'react-native';
import {COLOR} from 'res/variables';
import {COLORS, FONTS, FONT_SIZE, BUTTON_HEIGHT} from 'res/constants';
import { VerifyContext } from '../components';
import CustomStarRating from 'toktokfood/components/CustomStarRating';

export const RatingAction = () => {

    const { rating, setRating } = useContext(VerifyContext)

    return (
      <View style={styles.ratingActionWrapper}>
        <CustomStarRating
          rating={rating}
          onFinishRating={(rate) => setRating(rate)}
          showReviews
          isGrayStar
        />
      </View>
    );
  };



const styles = StyleSheet.create({
  ratingActionWrapper: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  ratings: {
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
});
