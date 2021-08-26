import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { VerifyContext } from '../components';

export const RatingAction = () => {

    const { rating, setRating } = useContext(VerifyContext)

    return (
      <View style={styles.ratingActionWrapper}>
        <AirbnbRating
            count={5}
            reviews={["Very Dissatisfied", "Dissatisfied", "Fair", "Satisfied", "Very Satisfied"]}
            defaultRating={1}
            size={35}
            reviewSize={12}
            reviewColor={"black"}
            unSelectedColor={"#E5E5E5"}
            selectedColor={"#FFA700"}
            onFinishRating={(rate) => setRating(rate)}
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
