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
import {searchIcon} from 'toktokfood/assets/images';

// Strings
import {tabs} from 'toktokfood/helper/strings';

import {moderateScale, getStatusbarHeight, getIphoneNotchSize} from 'toktokfood/helper/scale';

import {useSelector} from 'react-redux';
import ENVIRONMENTS from 'src/common/res/environments';
import {empty_shop_2, empty_search, time} from 'toktokfood/assets/images';

import styles from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {saveNewShopHistory, getShopHistory, clearShopHistory} from 'toktokfood/helper/persistentHistory';

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

  const searchFood = async (s = '', radius = 3) => {
    try {
      setLoading(true);
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
      setShopList(s != '' ? getSearchFood : []);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
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
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderEmpty = () => {
    let withSearch = moderateScale(Platform.OS == 'android' ? getStatusbarHeight * 5 : getIphoneNotchSize * 5);
    let withoutSearch = moderateScale(Platform.OS == 'android' ? getStatusbarHeight * 6 : getIphoneNotchSize * 6);
    let paddingTop = search != '' ? withSearch : withoutSearch;

    if (history.length > 0 && search === '') {
      return <RenderHistory />;
    } else {
      return (
        <View style={[styles.emptyContainer, {paddingTop}]}>
          <Image style={styles.emptyImg} resizeMode="contain" source={search != '' ? empty_shop_2 : empty_search} />
          {search != '' && (
            <Text style={styles.emptyText}>
              It seems like there is no open restaurant near you. Refresh or try again later.
            </Text>
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
        <View style={styles.searchBoxContainer}>
          <View style={[styles.textInputWrapper, styles.searchBoxShadow]}>
            <Image style={styles.searchBoxIcon} source={searchIcon} />
            <TextInput
              defaultValue={search}
              multiline={false}
              autoFocus={true}
              placeholder="What would you like to eat?"
              onChangeText={text => {
                setSearch(text);
                searchFood(text);
              }}
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
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={['#FFA700']} tintColor="#FFA700" />
            }
          />
        </>
      )}
    </View>
  );
};

export default ToktokFoodSearch;
