import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

export const LoadingIndicator = ({isLoading, isFlex, style, color = '#FFA700', size = 'large'}) => {
  const Loading = () => (
    <View style={[isFlex ? styles.container : {zIndex: 2}, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );

  return isLoading ? Loading() : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
