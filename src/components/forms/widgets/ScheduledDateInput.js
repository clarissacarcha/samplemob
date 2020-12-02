import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';

import {COLOR, MEDIUM, COLOR_UNDERLAY} from '../../../res/constants';

const Form = ({initialValue, onChange}) => {
  const createSevenDays = () => {
    const output = [];

    for (let i = 0; i <= 7; i++) {
      const day = moment().add(i, 'days');
      const value = day.tz('Asia/Manila').format('YYYY-MM-DD');

      let label = '';
      if (i === 0) {
        label = 'Today';
      } else if (i === 1) {
        label = 'Tomorrow';
      } else {
        label = day.format('dddd, MMMM D');
      }

      output.push({
        label,
        value,
      });
    }
    return output;
  };

  return (
    <View style={styles.pickerBox}>
      <View style={styles.pickerLabelBox}>
        <Text style={styles.pickerLabel}>Scheduled Date</Text>
      </View>
      <DropDownPicker
        defaultValue={initialValue}
        items={createSevenDays()}
        containerStyle={styles.pickerContainerStyle}
        style={styles.pickerStyle}
        dropDownStyle={styles.pickerDropDown}
        arrowColor={COLOR}
        labelStyle={{alignItems: 'flex-end'}}
        itemStyle={{marginLeft: 0}}
        activeItemStyle={{alignItems: 'flex-start'}}
        dropDownMaxHeight={300}
        onChangeItem={({value}) => {
          onChange(value);
        }}
      />
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  pickerBox: {
    flexDirection: 'row',
    marginTop: 5,
  },
  pickerContainerStyle: {
    height: 50,
    flex: 1,
  },
  pickerLabelBox: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLOR_UNDERLAY,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: MEDIUM,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  pickerLabel: {
    fontSize: 12,
    fontFamily: 'Rubik-Regular',
    color: MEDIUM,
  },
  pickerStyle: {
    backgroundColor: 'white',
    borderColor: MEDIUM,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  pickerDropDown: {
    backgroundColor: 'white',
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: MEDIUM,
  },
});
