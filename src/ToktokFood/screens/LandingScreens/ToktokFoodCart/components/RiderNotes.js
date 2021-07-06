import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';

import {verticalScale} from 'toktokfood/helper/scale';

import {COLOR} from 'res/variables';

import styles from '../styles';
import {useNavigation} from '@react-navigation/native';

const RiderNotes = () => {
  const navigation = useNavigation();

  const onPlaceOrderNavigate = () => {
    navigation.navigate('ToktokFoodDriver');
  };

  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={[styles.deliverWrapper, {paddingVertical: verticalScale(10)}]}>
          <Text style={styles.sectionTitle}>Note to Rider</Text>
        </View>
        <View>
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={styles.input}
            placeholder="Type your instructions here..."
            placeholderTextColor={COLOR.MEDIUM}
          />
        </View>
        <TouchableOpacity style={styles.placeOrderButton} onPress={() => onPlaceOrderNavigate()}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default RiderNotes;
