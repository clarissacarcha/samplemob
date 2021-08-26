import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FONTS } from 'res/constants';
import { VerifyContext } from '../components';

export const RiderInformation = ({}) => {
  const {riderInformation} = useContext(VerifyContext);

  return (
    <View style={[styles.riderWrapper]}>
      {/* <View style={styles.ratingWrapper} >
          <Text style={styles.ratingText}>{parseFloat(riderInformation.rating).toFixed(1)}</Text>
          <Rating startingValue={riderInformation.rating} imageSize={13} readonly style={styles.ratings} ratingColor={"#FFA700"} />
        </View> */}
      <Text style={styles.riderName}>{riderInformation.name}</Text>
      <Text style={styles.ratingText}>{riderInformation.contactNo}</Text>
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