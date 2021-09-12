import React, {useState, useContext, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {Image, View, Text, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';

import MIcon from 'react-native-vector-icons/MaterialIcons';

import {FoodCart, HeaderImageBackground, VerifyContextProvider, VerifyContext} from './components';
import HeaderTitle from 'toktokfood/components/HeaderTitle';

import ContentLoader from 'react-native-easy-content-loader';

import {Variations} from './components';
import {useSelector} from 'react-redux';

import {scale} from 'toktokfood/helper/scale';

import styles from './styles';

const MainComponent = () => {
  const routes = useRoute();

  const {variants} = routes.params;
  const {price} = useSelector((state) => state.toktokFood.totalAmount);
  const {totalPrice, setTotalPrice} = useContext(VerifyContext);
  const [bannerLoaded, setBannerLoaded] = useState(false);

  useEffect(() => {
    setTotalPrice(routes.params.price);
  }, []);

  const ItemDetails = () => {
    const {id, itemname, price, summary} = routes.params;
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
            <Variations item={variants} basePrice={routes.params.price} />
          )}
          <FoodCart basePrice={routes.params.price} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const ToktokFoodItemDetails = () => {
  return (
    <VerifyContextProvider>
      <MainComponent />
    </VerifyContextProvider>
  );
};

export default React.memo(ToktokFoodItemDetails);
