import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, TextInput, Alert, Image} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM, LIGHT} from '../../../../res/constants';
import {AlertOverlay, BottomTabHeader} from '../../../../components';

const DriverSettings = ({navigation, route, session, createSession}) => {
  return <View style={styles.container} />;
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverSettings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  submitBox: {
    margin: 20,
    borderRadius: 10,
    marginBottom: 0,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
