import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {COLOR, DARK, MEDIUM, LIGHT} from '../../../res/constants';

const screenWidth = Dimensions.get('window').width;

const finePrint = {
  ASAP: 'We will get you a rider ka-toktok.',
  SCHEDULED: 'We will arrive within your scheduled time.',
};

const Form = ({initialValue, onChange}) => {
  const [selected, setSelected] = useState(initialValue);

  const onPress = (value) => {
    onChange(value);
    setSelected(value);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => onPress('ASAP')}>
          <View style={selected === 'ASAP' ? styles.selectedBox : styles.unselectedBox}>
            <Text style={styles.selectionLabel} numberOfLines={2}>
              {'As Soon\nAs Possible'}
            </Text>
            <MCIcon name="run-fast" size={24} color={selected === 'ASAP' ? COLOR : LIGHT} />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.spacing} />

        <TouchableWithoutFeedback onPress={() => onPress('SCHEDULED')}>
          <View style={selected === 'SCHEDULED' ? styles.selectedBox : styles.unselectedBox}>
            <Text style={styles.selectionLabel}>Scheduled</Text>
            <FIcon name="clock" size={24} color={selected === 'SCHEDULED' ? COLOR : LIGHT} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Text style={styles.finePrint}>{finePrint[selected]}</Text>
    </>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  spacing: {
    width: 20,
  },
  selectedBox: {
    width: (screenWidth - 60) / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: COLOR,
  },
  unselectedBox: {
    width: (screenWidth - 60) / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: LIGHT,
  },
  selectionLabel: {
    fontSize: 12,
    fontFamily: 'Rubik-Regular',
    color: DARK,
  },
  finePrint: {
    color: MEDIUM,
    fontSize: 10,
    fontFamily: 'Rubik-Medium',
    marginTop: 5,
  },
});
