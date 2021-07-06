import React from 'react';
import {Image, View, Text} from 'react-native';

import styles from '../styles';
import {markerIcon} from 'toktokfood/assets/images';

import {verticalScale} from 'toktokfood/helper/scale';

const ReceiverLocation = () => {
  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={[styles.deliverWrapper, {paddingVertical: verticalScale(2)}]}>
          <Text style={styles.sectionTitle}>Delivery To</Text>
          <Text style={styles.actionText}>Change Address</Text>
        </View>
        <View style={styles.textAddressContainer}>
          <Image style={styles.addressMarkerIcon} source={markerIcon} />
          <Text style={styles.textAddress} numberOfLines={2}>
            Cloud Panda PH Inc. 10F 40th Sreet Taguig
          </Text>
        </View>
      </View>
    </>
  );
};

export default ReceiverLocation;
