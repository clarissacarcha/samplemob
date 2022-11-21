import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, View, FlatList, Text, TouchableWithoutFeedback, RefreshControl, Platform, TextInput} from 'react-native';

import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomStarRating from 'toktokfood/components/CustomStarRating';

// Components

// import HeaderTabs from 'toktokfood/components/HeaderTabs';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import DialogMessage from 'toktokfood/components/DialogMessage';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import ChangeAddress from 'toktokfood/components/ChangeAddress';

// Strings
import {tabs} from 'toktokfood/helper/strings';

import {moderateScale, getStatusbarHeight, getIphoneNotchSize} from 'toktokfood/helper/scale';

import {useSelector} from 'react-redux';
import ENVIRONMENTS from 'src/common/res/environments';
import {searchIcon, empty_search_2, time, new_empty_shop_icon} from 'toktokfood/assets/images';

import styles from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {saveNewShopHistory, getShopHistory, clearShopHistory} from 'toktokfood/helper/persistentHistory';

import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SEARCH_FOOD} from 'toktokfood/graphql/toktokfood';

const ToktokFoodSearch = ({route}) => {
  const {location} = useSelector(state => state.toktokFood);
  const [shopList, setShopList] = useState([]);

  tabs[3] = {
    id: 4,
    name: 'Best Sellers',
  };

  const navigation = useNavigation();
  const [search, setSearch] = useState(route.params?.searchByCategory ? route.params?.searchByCategory : '');
  const [isShowError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setSearch('');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params?.searchByCategory) {
      searchFood(route.params?.searchByCategory);
    }
  }, [route.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      searchFood('');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    initSearchHistoryList();
  }, []);

  const onRestaurantNavigate = (item, forHistory = true) => {
    if (forHistory) {
      setSearch(item.shopname);
      searchFood(item.shopname);
    } else {
      navigation.navigate('ToktokFoodRestaurantOverview', {item});
    }
  };

  const shopAlreadyExist = shopId => {
    return history.some(function (el) {
      return el.id === shopId;
    });
  };

  const initSearchHistoryList = async () => {
    const historyList = await getShopHistory();
    setHistory(historyList);
  };

  const updateHistoryList = item => {
    const currentHistory = history;

    if (!shopAlreadyExist(item.id)) {
      if (currentHistory.length === 5) {
        currentHistory.pop();
      }

      currentHistory.unshift(item);
      saveNewShopHistory(currentHistory);
    }

    onRestaurantNavigate(item, false);
  };

  const clearHistoryList = async () => {
    await clearShopHistory();
    setHistory([]);
  };

  const [getSearchFood, {data, error, loading: loadingSearchFood}] = useLazyQuery(GET_SEARCH_FOOD, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getSearchFood}) => {
      console.log('getSearchFood', getSearchFood);
      setShopList(search != '' ? getSearchFood : []);
      setLoading(false);
    },
  });

  const searchFood = async (s = '', radius = 3) => {
    try {
      setLoading(true);
      getSearchFood({
        variables: {
          input: {
            foodName: s,
            userLatitude: location.latitude,
            userLongitude: location.longitude,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderStatusTag = ({hasOpen, hasProduct}) => {
    if (hasOpen && hasProduct) {
      return null;
    }
    if (!hasProduct) {
      return (
        <View style={styles.closedTag}>
          <Text style={styles.closedText}>Currently Unavailable</Text>
        </View>
      );
    }
    return (
      <View style={styles.closedTag}>
        <Text style={styles.closedText}>Currently Closed</Text>
      </View>
    );
  };

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback onPress={() => updateHistoryList(item)}>
      <View style={styles.itemContainer}>
        <View style={styles.imgWrapper}>
          <Image resizeMode="cover" source={{uri: item.logo}} style={styles.img} />
        </View>
        <View style={styles.restaurantInfo}>
          <View style={styles.infoWrapper}>
            <Text numberOfLines={1} style={styles.restaurantName}>
              {item.shopname} ({item.address})
            </Text>
            {/* <CustomStarRating rating={item.ratings ?? '0'} starImgStyle={styles.ratingImg} readOnly /> */}
          </View>
          <View style={styles.subInfoWrapper}>
            <Image resizeMode="contain" source={time} style={styles.timeImg} />
            <Text style={styles.subInfoText}>{item.estimatedDeliveryTime} mins</Text>
            <MCIcon name="map-marker-outline" color="#868686" size={13} />
            <Text style={styles.subInfoText}>{item.estimatedDistance} KM</Text>
          </View>
          {renderStatusTag(item)}
          {/* {!item.hasOpen && (
            <View style={styles.closedTag}>
              <Text style={styles.closedText}>Currently Closed</Text>
            </View>
          )} */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderEmpty = () => {
    if (history.length > 0 && search === '') {
      return <RenderHistory />;
    } else {
      return (
        <View style={[styles.emptyContainer]}>
          <Image
            resizeMode="cover"
            style={search != '' ? styles.emptyShop : styles.emptyImg}
            source={search != '' ? new_empty_shop_icon : empty_search_2}
          />
          {search != '' ? (
            <>
              <Text style={styles.emptyTextTitle}>No Restaurant Available</Text>
              <Text style={styles.emptyText}>
                It seems like there is no open restaurant{'\n'}near you. Refresh or try again later.
              </Text>
            </>
          ) : (
            BottomLabel()
          )}
        </View>
      );
    }
  };

  const RenderHistory = () => {
    return (
      <>
        <View style={styles.historyContainer}>
          <TouchableOpacity onPress={() => clearHistoryList()} style={styles.historyTextClearWrapper}>
            <Text style={styles.historyTextClear}>Clear All</Text>
          </TouchableOpacity>
          <View style={styles.historyListWrapper}>
            {history.map(v => (
              <TouchableOpacity style={styles.historyItem} onPress={() => onRestaurantNavigate(v, true)}>
                <Text numberOfLines={1} style={styles.historyText}>
                  {v.shopname}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </>
    );
  };

  const onRefresh = () => {
    searchFood(search);
  };

  const BottomLabel = () => (
    <>
      {shopList.length === 0 && search === '' && (
        <Text style={styles.footerText}>Find your favorite food from nearby restaurants.</Text>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <DialogMessage
        type="error"
        visibility={isShowError}
        title="No result found"
        onCloseModal={() => setShowError(false)}
      />

      <HeaderImageBackground>
        <HeaderTitle backOnly />
        <View style={styles.searchBoxContainer}>
          <View style={[styles.textInputWrapper, styles.searchBoxShadow]}>
            <Image style={styles.searchBoxIcon} source={searchIcon} />
            <TextInput
              defaultValue={search}
              multiline={false}
              placeholder="What would you like to eat?"
              onChangeText={text => {
                setSearch(text);
              }}
              onSubmitEditing={() => searchFood(search)}
              style={[styles.searchBox, styles.textInputFontStyles]}
            />
          </View>
        </View>
      </HeaderImageBackground>
      <ChangeAddress />
      {shopList.length != 0 && (
        <View style={styles.tabContainer}>
          <Text style={[styles.restaurantTitle]}>Restaurants</Text>
        </View>
      )}
      {loading ? (
        <LoadingIndicator isFlex isLoading={true} />
      ) : (
        <>
          <FlatList
            data={shopList}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            // ListFooterComponent={BottomLabel}
            ListFooterComponentStyle={styles.footerContainer}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={['#FFA700']} tintColor="#FFA700" />
            }
            contentContainerStyle={{flexGrow: 1}}
          />
        </>
      )}
    </View>
  );
};

export default ToktokFoodSearch;
