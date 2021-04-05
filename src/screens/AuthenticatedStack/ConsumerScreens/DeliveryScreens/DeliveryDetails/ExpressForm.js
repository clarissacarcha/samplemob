import React, {useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput, Switch} from 'react-native';
import {LIGHT, COLOR, MEDIUM} from '../../../../../res/constants';

const ExpressForm = ({value, onChange}) => {
  const [switchState, setSwitchState] = useState(false);

  const onValueChange = (value) => {
    setSwitchState(value);
    onChange(value);
  };

  return (
    <View>
      <View style={styles.box}>
        <View style={{flex: 1}}>
          <Text>Express Delivery</Text>
          <Text style={{fontSize: 10, color: LIGHT}}>
            Add PHP 40.00. Your order will be placed at a higher priority.
          </Text>
        </View>
        <Switch
          trackColor={{false: LIGHT, true: LIGHT}}
          thumbColor={COLOR}
          onValueChange={onValueChange}
          value={switchState}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ExpressForm);

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    fontSize: 14,
    marginBottom: 10,
  },
  spacing: {height: 5},
});
