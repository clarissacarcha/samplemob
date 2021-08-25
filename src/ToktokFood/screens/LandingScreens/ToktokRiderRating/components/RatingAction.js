import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';

export const RatingAction = () => {
  return (
    <View style={styles.ratingActionWrapper}>
      <AirbnbRating
        count={5}
        size={35}
        reviewSize={12}
        defaultRating={1}
        reviewColor="black"
        selectedColor="#FFA700"
        unSelectedColor="#E5E5E5"
        reviews={['Very Dissatisfied', 'Dissatisfied', 'Fair', 'Satisfied', 'Very Satisfied']}
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
