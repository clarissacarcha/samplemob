import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {Image, View, Text, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';

import MIcon from 'react-native-vector-icons/MaterialIcons';

import FoodCart from './components/FoodCart';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderImageBackground from './components/HeaderImageBackground';

import ContentLoader from 'react-native-easy-content-loader';

import {Variations} from './components';
import {useSelector} from 'react-redux';

import {scale} from 'toktokfood/helper/scale';

import styles from './styles';

const ToktokFoodItemDetails = () => {
  const routes = useRoute();

  const {variants} = routes.params;
  const {price} = useSelector((state) => state.toktokFood.totalAmount);
  const [newCartTotal, setNewCartTotal] = useState(routes.params.price);

  const [bannerLoaded, setBannerLoaded] = useState(false);

  const ItemDetails = () => {
    const {id, itemname, price, summary, ratings} = routes.params;
    return (
      <View key={id} style={styles.foodContainer}>
        <View style={styles.foodDetails}>
          <View style={styles.foodNameWrapper}>
            <Text style={styles.foodName}>{itemname}</Text>
            <MIcon name="favorite-border" size={22} color="#808080" style={styles.heart} />
          </View>
          <Text style={styles.foodPrice}>PHP {price.toFixed(2)}</Text>
        </View>
        <View style={styles.ratingsWrapper}>
          {/* <Rating startingValue={ratings} imageSize={16} readonly style={styles.ratings} /> */}
          <Text style={styles.description} numberOfLines={3}>
            {summary}
          </Text>
        </View>
      </View>
    );
  };

  const updateAmount = (amount, lastAmount) => {
    console.log(amount, 'asdjaskdjlkasjd');
    if (amount) {
      setNewCartTotal((prevAmount) => prevAmount + amount.total);
    }
    // console.log(newCartTotal - lastAmount + amount);
  };

  const BannerPlaceHolder = () => {
    return (
      <View style={{alignSelf: 'center', height: scale(140), width: scale(350)}}>
        <ContentLoader
          active
          pRows={1}
          pHeight="100%"
          pWidth="100%"
          title={false}
          primaryColor="rgba(256,186,28,0.2)"
          secondaryColor="rgba(256,186,28,0.7)"
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <HeaderImageBackground>
            <HeaderTitle title="Order Details" showAddress={true} />

            {!bannerLoaded && <BannerPlaceHolder />}

            <Image
              onLoadEnd={() => setBannerLoaded(true)}
              source={{uri: routes.params.filename}}
              style={[styles.banner]}
            />
          </HeaderImageBackground>
          <ItemDetails />
          {typeof variants === 'object' && (
            <Variations
              currentTotal={price}
              item={variants}
              onVariationChange={(v) => updateAmount(v.value, v.lastValue)}
              onAddOnsChange={(ons) => updateAmount(ons)}
            />
          )}
          <FoodCart item_price={newCartTotal} currentTotal={0} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default React.memo(ToktokFoodItemDetails);
