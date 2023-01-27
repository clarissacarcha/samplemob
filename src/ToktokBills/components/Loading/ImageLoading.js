import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import {moderateScale} from 'toktokbills/helper';

export const ImageLoading = ({loading = true, aSize = moderateScale(60)}) => {
  const Loading = () => (
    <ContentLoader
      active
      avatar
      aShape="square"
      pRows={0}
      aSize={aSize}
      containerStyles={{paddingHorizontal: 0}}
      primaryColor="rgba(256,186,28,0.2)"
      secondaryColor="rgba(256,186,28,0.4)"
    />
  );

  return loading ? Loading() : null;
};

const styles = StyleSheet.create({});
