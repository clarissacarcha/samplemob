import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

import {searchIcon} from '../assets/images';
import {FONT, FONT_SIZE, COLOR} from '../../res/variables';

// State must be global to share with other components
const LoadingIndicator = ({ isLoading, isFlex, style }) => {

  const Loading = () => (
    <View style={[ isFlex ? styles.container : {}, style]}>
      <ActivityIndicator size='large' color='#FFA700' />
    </View>
  )

  return isLoading ? Loading() : null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LoadingIndicator;
