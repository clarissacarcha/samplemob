import React from 'react';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity, TouchableHighlight, Dimensions, Image} from 'react-native';
import {COLOR, SIZE} from '../../../../../../res/variables';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_WIDTH = SCREEN_WIDTH - SIZE.MARGIN * 2;
const BANNER_HEIGHT = BANNER_WIDTH / 2;

const BannerAds = ({ads}) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.push('SelectedAdvertisement', {advertisement: ads[0]});
  };

  console.log({ads});

  if (!ads || ads.length === 0) return <View style={{height: SIZE.MARGIN / 2}} />;

  return (
    <TouchableHighlight onPress={onPress} style={styles.touchable}>
      <Image
        style={{height: BANNER_HEIGHT, width: BANNER_WIDTH, borderRadius: 5}}
        source={{
          uri: ads[0].rectangleImage,
        }}
        resizeMode="cover"
      />
    </TouchableHighlight>
  );
};

export default BannerAds;

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 5,
    margin: SIZE.MARGIN,
    marginBottom: SIZE.MARGIN / 2,
  },
});
