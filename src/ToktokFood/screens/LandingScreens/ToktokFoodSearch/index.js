import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, View, FlatList, Text, TouchableWithoutFeedback, RefreshControl} from 'react-native';

import {Rating} from 'react-native-ratings';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Components

// import HeaderTabs from 'toktokfood/components/HeaderTabs';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import DialogMessage from 'toktokfood/components/DialogMessage';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// Strings
import {restaurants, tabs} from 'toktokfood/helper/strings';

import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

import {useSelector} from 'react-redux';
import ENVIRONMENTS from 'src/common/res/environments';
import {empty_shop, empty_search} from 'toktokfood/assets/images';

import styles from './styles';

const ToktokFoodSearch = ({ route }) => {
  const {location} = useSelector((state) => state.toktokFood);
  const [shopList, setShopList] = useState([]);

  tabs[3] = {
    id: 4,
    name: 'Best Sellers',
  };

  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [isShowError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRestaurantNavigate = (item) => {
    navigation.navigate('ToktokFoodRestaurantOverview', {item});
  };

  useEffect(() => {
    if(route.params?.searchByCategory){
      searchFood(route.params?.searchByCategory)
    }
  }, [route.params])

  const searchFood = async (s = '', radius = 5) => {
    try {
      setLoading(true)
      const API_RESULT = await axios({
        url: `${ENVIRONMENTS.TOKTOKFOOD_SERVER}/graphql`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          query: `
            query {
              getSearchFood(input: {
                foodName: "${s}",
                radius: ${radius},
                userLatitude: ${location.latitude},
                userLongitude: ${location.longitude}
              }) {
                id
                ratings
                shopname
                logo
                banner
                address
                estimatedDistance
                estimatedDeliveryTime
              }
          }`,
        },
      });
      const {getSearchFood} = API_RESULT.data.data;
      console.log(getSearchFood)
      setShopList(getSearchFood);
      setLoading(false)
      setSearch(s)
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback onPress={() => onRestaurantNavigate(item)}>
      <View style={styles.itemContainer}>
        <View style={styles.imgWrapper}>
          <Image
            resizeMode="contain"
            source={{
              uri: item.logo,
            }}
            style={styles.img}
          />
          {/* <View style={styles.branchWrapper}>
            <MCIcon name="store" color={COLOR.ORANGE} size={13} />
            <Text style={styles.branchText}>{item.totalBranches} branches</Text>
          </View> */}
        </View>

        <View style={styles.restaurantInfo}>
          <View style={styles.infoWrapper}>
            <Text numberOfLines={2} style={styles.restaurantName}>
              {item.shopname}
            </Text>
            <Rating startingValue={item.ratings} imageSize={15} readonly style={styles.ratings} />
          </View>

          <View style={styles.subInfoWrapper}>
            <MCIcon name="clock-outline" color="#868686" size={13} />
            <Text style={styles.subInfoText}>{item.estimatedDeliveryTime} mins</Text>
            <MCIcon name="map-marker-outline" color="#868686" size={13} />
            <Text style={styles.subInfoText}>{item.estimatedDistance}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image style={styles.emptyImg} resizeMode="contain" source={search != '' ? empty_shop : empty_search} />
      { search != '' && 
        <Text style={styles.emptyText}>It seems like there is no open restaurant near you. Refresh or try again later.</Text>
      }
    </View>
  );

  const onRefresh = () => {
    searchFood(search)
  }
  
  return (
    <View style={styles.container}>
      <DialogMessage
        type="error"
        visibility={isShowError}
        title="No result found"
        onCloseModal={() => setShowError(false)}
      />
      <HeaderImageBackground>
        <HeaderTitle />
        <HeaderSearchBox
          onSearch={(t) => {
            searchFood(t);
          }}
        />
      </HeaderImageBackground>
      { shopList.length != 0 && (
        <View style={styles.tabContainer}>
          <Text style={[styles.restaurantName, {fontSize: 18}]}>Restaurants</Text>
        </View>
      )}
      <View style={styles.listContainer}>
        { loading ? (
          <LoadingIndicator isFlex isLoading={true} />
        ) : (
          <FlatList
            data={shopList}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={onRefresh}
                colors={['#FFA700']}
                tintColor='#FFA700'
              />
            }
          />
        )}
      </View>
    </View>
  );
};

export default ToktokFoodSearch;
