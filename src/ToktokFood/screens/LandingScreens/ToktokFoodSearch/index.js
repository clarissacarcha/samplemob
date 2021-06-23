import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Image, View, FlatList, Text, TouchableWithoutFeedback} from 'react-native';

import {Rating} from 'react-native-ratings';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import HeaderTabs from 'toktokfood/components/HeaderTabs';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

// Fonts & Colors
import {COLOR, FONT} from 'res/variables';

// Strings
import {restaurants, tabs} from 'toktokfood/helper/strings';

// Utils
import {scale, verticalScale} from 'toktokfood/helper/scale';

const ToktokFoodSearch = () => {

  tabs[3] = {
    id: 4,
    name: 'Best Sellers',
  };

  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRestaurantNavigate = (item) => {
    console.log(item);
    navigation.navigate('ToktokFoodRestaurantOverview', {item});
  };

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback onPress={() => onRestaurantNavigate(item)}>
      <View style={styles.itemContainer}>
        <View style={styles.imgWrapper}>
          <Image resizeMode="contain" source={item.image} style={styles.img} />

          <View style={styles.branchWrapper}>
            <MCIcon name="store" color={COLOR.ORANGE} size={13} />
            <Text style={styles.branchText}>{item.totalBranches} branches</Text>
          </View>
        </View>

        <View style={styles.restaurantInfo}>
          <View style={styles.infoWrapper}>
            <Text numberOfLines={2} style={styles.restaurantName}>
              {item.name}
            </Text>
            <Rating
              startingValue={item.ratings}
              tintColor="whitesmoke"
              imageSize={15}
              readonly
              style={styles.ratings}
            />
          </View>

          <View style={styles.subInfoWrapper}>
            <MCIcon name="clock-outline" color="#868686" size={13} />
            <Text style={styles.subInfoText}>{item.time}</Text>
            <MCIcon name="map-marker-outline" color="#868686" size={13} />
            <Text style={styles.subInfoText}>{item.distance}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <HeaderImageBackground>
        <HeaderTitle />
        <HeaderSearchBox />
      </HeaderImageBackground>
      <View style={styles.tabContainer}>
        <HeaderTabs activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} />
      </View>
      <View style={styles.listContainer}>
        <FlatList data={restaurants} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default ToktokFoodSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  listContainer: {
    flex: 1,
    paddingVertical: 15,
  },
  itemContainer: {
    width: scale(330),
    alignSelf: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderColor: '#E6E6E6',
    paddingVertical: verticalScale(8),
  },
  imgWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  branchWrapper: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  branchText: {
    color: COLOR.ORANGE,
    paddingHorizontal: 3,
  },
  img: {
    height: 75,
    width: 78,
  },
  restaurantInfo: {
    paddingEnd: 8,
    paddingStart: 10,
    color: COLOR.BLACK,
  },
  restaurantName: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
  },
  ratings: {
    marginTop: 4,
    alignItems: 'flex-start',
  },
  infoWrapper: {
    paddingEnd: 10,
    width: scale(250),
  },
  subInfoWrapper: {
    marginTop: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  subInfoText: {
    paddingHorizontal: 3,
  },
  tabContainer: {
    marginTop: 9,
    paddingHorizontal: 10,
  },
});
