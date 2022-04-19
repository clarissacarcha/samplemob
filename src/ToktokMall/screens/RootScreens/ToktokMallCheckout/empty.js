import React, {useState, useEffect,} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, BackHandler, Alert } from 'react-native';
import {connect} from 'react-redux';
import { Loading } from '../../../Components';
import {emptyPlaceOrder} from "../../../assets"

const Component = ({route, navigation, createMyCartSession}) => {

	if(true){
		return <Loading state={true} />
	}

  return (
    
    <>
      <View style={{flex: 1, backgroundColor: 'trasparent'}}>
        <View style={{flex: 1, backgroundColor: 'white', marginTop: 8, alignItems: 'center', padding: 25}}>
          <Image source={emptyPlaceOrder} />
          <Text style={{color: '#F6841F', fontSize: 18, padding: 5}}>No Items</Text>
          <Text>Hmm, there are no items to check out.</Text>
        </View>
      </View>
    </>
    
  );
};

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload})
});

export const ToktokMallEmptyCheckout = connect(null, mapDispatchToProps)(Component);