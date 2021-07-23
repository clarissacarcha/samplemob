import React from 'react';
import {View, Text} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';

const Loader = () => (
  <View style={{height: 50, justifyContent: 'center', marginHorizontal: 8}}>
    <ContentLoader
      active
      pRows={1}
      pWidth={['100%']}
      pHeight={[25]}
      title={false}
      primaryColor="rgba(256,186,28,0.2)"
      secondaryColor="rgba(256,186,28,0.4)"
    />
  </View>
);

export const SearchLoadingIndicator = () => {
  return (
    <>
      <Loader />
      <Loader />
      <Loader />
      <Loader />
      <Loader />
    </>
  );
};
