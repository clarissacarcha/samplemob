import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, BackHandler, Alert } from 'react-native';
import {connect} from 'react-redux';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import { Loading } from '../../../Components';
import {emptyPlaceOrder} from "../../../assets"
import {useFocusEffect, CommonActions} from '@react-navigation/native'

const Component = ({route, navigation, createMyCartSession}) => {

	navigation.setOptions({
    headerLeft: () => <HeaderBack onBack = {setAlertTrue}/>,
    headerTitle: () => <HeaderTitle label={['Place Order', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  useEffect(() => {
    console.log("ROUTE PARAMS", JSON.stringify(route.params.data))
    setTimeout(() => {
      navigation.replace("ToktokMallCheckout", route.params)
    }, 300) 
  }, [route.params])

  return (
    <>
      <Loading state={true} />
    </>
  )

  // return (    
  //   <>
  //     <View style={{flex: 1, backgroundColor: 'trasparent', justifyContent: 'center'}}>
  //       <View style={{flex: 1, backgroundColor: 'white', marginTop: 8, alignItems: 'center', padding: 25}}>
  //         <Image source={emptyPlaceOrder} />
  //         <Text style={{color: '#F6841F', fontSize: 18, padding: 5}}>No Items</Text>
  //         <Text>Hmm, there are no items to check out.</Text>
  //       </View>
  //     </View>
  //   </>    
  // );
};

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload})
});

export const ToktokMallEmptyCheckout = connect(null, mapDispatchToProps)(Component);