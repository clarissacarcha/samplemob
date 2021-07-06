import React from 'react';
import {Rating} from 'react-native-ratings';
import {Image, View, Text, ScrollView} from 'react-native';

import styles from '../styles';
import {food1} from 'toktokfood/assets/images';

const AlsoOrder = () => {
  const RenderAlsoOrderedItem = () => {
    return (
      <>
        <View style={styles.alsoOrderContainer}>
          <Image style={styles.alsoOrderedItemImage} source={food1} />
          <View style={styles.alsoOrderedInfoWrapper}>
            <Text style={styles.alsoOrderedTitle}>Caffe Latte</Text>
            <Rating startingValue={5} tintColor={'whitesmoke'} imageSize={12} readonly style={styles.ratings} />
            <Text style={[styles.foodPrice, {fontSize: 12}]}>PHP 230.00</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={styles.deliverWrapper}>
          <Text style={styles.sectionTitle}>People also ordered</Text>
        </View>
        <ScrollView horizontal style={styles.alsoOrderList} showsHorizontalScrollIndicator={false}>
          <RenderAlsoOrderedItem />
          <RenderAlsoOrderedItem />
          <RenderAlsoOrderedItem />
          <RenderAlsoOrderedItem />
        </ScrollView>
      </View>
    </>
  );
};

export default AlsoOrder;
