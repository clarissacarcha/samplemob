import React, {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {Image, View, Text, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';

import {Rating} from 'react-native-ratings';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderImageBackground from './components/HeaderImageBackground';
import FoodCart from './components/FoodCart';

import {Variations} from './components';

import {useSelector} from 'react-redux';

import styles from './styles';

const ToktokFoodItemDetails = () => {
  const routes = useRoute();

  const {price} = useSelector((state) => state.toktokFood.totalAmount);

  const [newCartTotal, setNewCartTotal] = useState(routes.params.price);

  const CancelOrderOption = () => {
    return <>
      
    </>;
  };

  const ItemDetails = () => {
    const {id, name, price, description, ratings} = routes.params;
    return (
      <View key={id} style={styles.foodContainer}>
        <View style={styles.foodDetails}>
          <View style={styles.foodNameWrapper}>
            <Text style={styles.foodName}>{name}</Text>
            <MIcon name="favorite-border" size={22} color="#808080" style={styles.heart} />
          </View>
          <Text style={styles.foodPrice}>PHP {price.toFixed(2)}</Text>
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

  const updateAmount = (amount) => {
    setNewCartTotal(newCartTotal + amount);
  };


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <HeaderImageBackground>
            <HeaderTitle title="Order Details" showAddress={true} />
            <Image source={routes.params.image} style={styles.banner} />
          </HeaderImageBackground>
          <ItemDetails />
          <Variations
            currentTotal={price}
            item={routes.params}
            onVariationChange={(vary) => updateAmount(vary)}
            onAddOnsChange={(ons) => updateAmount(ons)}
          />
          <FoodCart item_price={newCartTotal} currentTotal={price} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default React.memo(ToktokFoodItemDetails);
