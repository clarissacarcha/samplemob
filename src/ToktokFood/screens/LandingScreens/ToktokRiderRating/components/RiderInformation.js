import React, {useState} from 'react';
import { Rating } from 'react-native-ratings';
import {View, Text, StyleSheet } from 'react-native';
import {COLOR} from 'res/variables';
import {COLORS, FONTS, FONT_SIZE, BUTTON_HEIGHT} from 'res/constants';
export const RiderInformation = ({  }) => {
    return (
      <View style={[ styles.riderWrapper ]}>
        <View style={styles.ratingWrapper} >
          <Text style={styles.ratingText}>3.5</Text>
          <Rating startingValue={3.5} imageSize={13} readonly style={styles.ratings} ratingColor={"#FFA700"} />
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
      marginBottom: 10
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
      marginRight: 5,    }
  });
  