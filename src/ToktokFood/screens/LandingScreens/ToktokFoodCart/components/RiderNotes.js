import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';

import {verticalScale} from 'toktokfood/helper/scale';

import {COLOR} from 'res/variables';

import styles from '../styles';
import {useNavigation} from '@react-navigation/native';

const RiderNotes = ({onNotesChange, notes = '', onPlaceOrder, showPlaceOrder = false}) => {
  const navigation = useNavigation();

  const onPlaceOrderNavigate = () => {
    navigation.replace('ToktokFoodDriver');
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
            value={notes}
            placeholderTextColor={COLOR.MEDIUM}
            onChangeText={(v) => onNotesChange(v)}
          />
        </View>
        {showPlaceOrder && (
          <TouchableOpacity style={styles.placeOrderButton} onPress={() => onPlaceOrder()}>
            <Text style={styles.buttonText}>Place Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default RiderNotes;
