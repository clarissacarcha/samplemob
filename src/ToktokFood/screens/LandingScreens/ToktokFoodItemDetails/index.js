import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Image, View, Text, ScrollView} from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';

import {Rating} from 'react-native-ratings';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderImageBackground from './components/HeaderImageBackground';

import {Variations} from './components';

import styles from './styles';

const ToktokFoodItemDetails = () => {
  const routes = useRoute();

  const ItemDetails = () => {
    const {id, name, price, description, ratings} = routes.params;
    return (
      <View key={id} style={styles.foodContainer}>
        <View style={styles.foodDetails}>
          <View style={styles.foodNameWrapper}>
            <Text style={styles.foodName}>{name}</Text>
            <MIcon name="favorite-border" size={22} color="#808080" style={styles.heart} />
          </View>
          <Text style={styles.foodPrice}>PHP {price}</Text>
        </View>
        <View style={styles.ratingsWrapper}>
          <Rating startingValue={ratings} imageSize={16} readonly style={styles.ratings} />
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderImageBackground>
        <HeaderTitle title="Order Details" />
        <Image source={routes.params.image} style={styles.banner} />
      </HeaderImageBackground>
      <ScrollView style={{flex: 1}}>
        <ItemDetails />
        <Variations item={routes.params} />
      </ScrollView>
    </View>
  );
};

export default ToktokFoodItemDetails;
