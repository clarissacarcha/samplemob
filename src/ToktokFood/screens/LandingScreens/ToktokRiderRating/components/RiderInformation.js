import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { FONTS } from 'res/constants';


export const RiderInformation = ({}) => {
  return (
    <View style={[styles.riderWrapper]}>
      <View style={styles.ratingWrapper}>
        <Text style={styles.ratingText}>4.0</Text>
        <Rating startingValue={4} imageSize={13} readonly style={styles.ratings} ratingColor="#FFA700" />
      </View>
      <Text style={styles.riderName}>Edward Nolasco Rosario</Text>
      <Text style={styles.ratingText}>09097570947</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  riderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  riderName: {
    fontSize: 19,
    fontFamily: FONTS.MEDIUM,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratings: {
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: FONTS.MEDIUM,
    marginRight: 5,
  },
});
