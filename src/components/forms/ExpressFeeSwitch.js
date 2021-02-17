import React, {useState} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, Switch, Text, View} from 'react-native';

import {COLOR, DARK, LIGHT, MEDIUM} from '../../res/constants';
import {SizedBox} from '../widgets/SizedBox';

const Widget = ({initialValue = false, onChange = () => {}, marginTop, marginBottom, constants}) => {
  const {expressDeliveryFee} = constants;
  const [switchState, setSwitchState] = useState(initialValue);

  const onValueChange = (value) => {
    setSwitchState(value);
    // if (value) {
    //   onChange(expressDeliveryFee);
    // } else {
    //   onChange(0);
    // }
    onChange(value);
  };

  return (
    <>
      {marginTop && <SizedBox />}
      <View style={styles.container}>
        <View>
          <Text style={styles.switchTitle}>Express Delivery</Text>
          <Text
            style={
              styles.switchDescription
            }>{`Add P${expressDeliveryFee}.00, your order will be placed in a high priority.`}</Text>
        </View>

        <Switch
          trackColor={{false: LIGHT, true: LIGHT}}
          thumbColor={true ? COLOR : MEDIUM}
          onValueChange={onValueChange}
          value={switchState}
        />
      </View>
      {marginBottom && <SizedBox />}
    </>
  );
};

const mapStateToProps = (state) => ({
  constants: state.constants,
});

export const ExpressFeeSwitch = connect(mapStateToProps, null)(Widget);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  switchTitle: {
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  switchDescription: {
    fontSize: 10,
    color: MEDIUM,
    fontFamily: 'Rubik-Medium',
  },
});
