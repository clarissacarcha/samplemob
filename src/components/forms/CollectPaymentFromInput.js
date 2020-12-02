import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Alert, Dimensions} from 'react-native';
import {COLOR, DARK, LIGHT} from '../../res/constants';
import {SizedBox} from '../../components/widgets';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';

const screenWidth = Dimensions.get('window').width;

const Widget = ({initialValue, isCashOnDelivery, onChange, marginTop, marginBottom}) => {
  const [collectFrom, setCollectFrom] = useState(initialValue);

  const onPress = (value) => {
    if (!isCashOnDelivery) {
      setCollectFrom(value);
      onChange(value);
    } else {
      if (value === 'SENDER') {
        Alert.alert('', 'Cannot collect payment from Sender for Cash on Deliveries.');
      }
    }
  };

  // Force collect from Recipient if isCashOnDelivery true
  useEffect(() => {
    if (collectFrom === 'SENDER' && isCashOnDelivery) {
      setCollectFrom('RECIPIENT');
      onChange('RECIPIENT');
    }
  }, [isCashOnDelivery]);

  return (
    <>
      {marginTop && <SizedBox />}
      <Text style={styles.label}>Collect Payment From</Text>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => onPress('SENDER')}>
          <View style={collectFrom === 'SENDER' ? styles.selectedButton : styles.button}>
            <Text style={styles.selectionLabel}>Sender</Text>
            <FA5Icon name="map-marker-alt" size={20} color={collectFrom === 'SENDER' ? COLOR : LIGHT} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => onPress('RECIPIENT')}>
          <View style={collectFrom === 'RECIPIENT' ? styles.selectedButton : styles.button}>
            <Text style={styles.selectionLabel}>Recipient</Text>
            <FA5Icon name="map-pin" size={20} color={collectFrom === 'RECIPIENT' ? COLOR : LIGHT} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {marginBottom && <SizedBox />}
    </>
  );
};

export const CollectPaymentFromInput = Widget;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedButton: {
    width: (screenWidth - 60) / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLOR,
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 50,
    backgroundColor: 'white',
  },
  button: {
    width: (screenWidth - 60) / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: LIGHT,
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 50,
    backgroundColor: 'white',
  },
  label: {
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  selectionLabel: {
    fontSize: 12,
    fontFamily: 'Rubik-Regular',
    color: DARK,
  },
});
