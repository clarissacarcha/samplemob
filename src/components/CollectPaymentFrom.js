import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Alert, Dimensions} from 'react-native';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT, ORANGE, COLOR_UNDERLAY} from '../res/constants';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/Feather';

const screenWidth = Dimensions.get('window').width;

export const CollectPaymentFrom = ({initialValue, onSelect, isCOD}) => {
  const [collectFrom, setCollectFrom] = useState(initialValue);

  const onPress = value => {
    if (!isCOD) {
      setCollectFrom(value);
      onSelect(value);
    } else {
      if (value == 'S') {
        Alert.alert('', 'Cannot collect payment from Sender for Cash on Deliveries.');
      }
    }
  };

  useEffect(() => {
    if (collectFrom == 'S' && isCOD) {
      setCollectFrom('R');
      onSelect('R');
    }
  }, [isCOD]);

  return (
    <View style={{flexDirection: 'row', marginHorizontal: 20, justifyContent: 'space-between'}}>
      <TouchableWithoutFeedback onPress={() => onPress('S')}>
        <View style={collectFrom == 'S' ? styles.selectedButton : styles.button}>
          <Text>Sender</Text>
          <FA5Icon name="map-marker-alt" size={20} color={collectFrom == 'S' ? COLOR : LIGHT} />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => onPress('R')}>
        <View style={collectFrom == 'R' ? styles.selectedButton : styles.button}>
          <Text>Recipient</Text>
          <FA5Icon name="map-pin" size={20} color={collectFrom == 'R' ? COLOR : LIGHT} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
});
