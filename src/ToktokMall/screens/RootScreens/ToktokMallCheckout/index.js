import React, {useState, useEffect,} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, BackHandler, Alert } from 'react-native';
import {CheckoutContextProvider} from './ContextProvider';
import { ToktokMallCheckoutScreen } from './screen';
import {connect} from 'react-redux';

const Component = ({route, navigation, createMyCartSession}) => {

  return (
    
    <>
      <CheckoutContextProvider>
        <ToktokMallCheckoutScreen route={route} navigation={navigation} />
      </CheckoutContextProvider>
    </>
    
  );
};

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload})
});

export const ToktokMallCheckout = connect(null, mapDispatchToProps)(Component);