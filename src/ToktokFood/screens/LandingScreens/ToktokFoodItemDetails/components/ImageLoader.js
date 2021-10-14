import React, {useState} from 'react';
import {scale} from 'toktokfood/helper/scale';
import {StyleSheet, View} from 'react-native';

import ContentLoader from 'react-native-easy-content-loader';

export default ImageLoader = (props) => {

  const BannerPlaceHolder = () => {
    return (
      <ContentLoader
        active
        pRows={1}
        pHeight="100%"
        pWidth="100%"
        title={false}
        primaryColor="rgba(256,186,28,0.2)"
        secondaryColor="rgba(256,186,28,0.7)"
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.loaderContainer, {display: props.loaded ? 'flex' : 'none'}]}>
        <BannerPlaceHolder />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    width: scale(345),
    height: scale(190),
  },
  imageBanner: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
