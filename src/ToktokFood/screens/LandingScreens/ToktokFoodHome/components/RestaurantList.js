import React, {useState} from 'react';
import {FlatList, Image, View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {Rating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// import HeaderTabs from 'toktokfood/components/HeaderTabs';

// Assets
import {image1, image2, image3, image4} from 'toktokfood/assets/images';

const RestaurantList = () => {
  const navigation = useNavigation();

  const tabs = [
    {
      id: 1,
      name: 'Near You',
    },
    {
      id: 2,
      name: 'Promos',
    },
    {
      id: 3,
      name: 'All',
    },
  ];
  const restaurants = [
    {
      id: 1,
      name: 'Starbucks (32nd Street)',
      ratings: 5,
      totalBranches: 4,
      time: '40 mins',
      distance: '1km',
      image: image1,
    },
    {
      id: 2,
      name: 'Yellow Cab (32nd Street)',
      ratings: 5,
      totalBranches: 4,
      time: '40 mins',
      distance: '2.1km',
      image: image2,
    },
    {
      id: 3,
      name: 'Starbucks (32nd Street)',
      ratings: 5,
      totalBranches: 4,
      time: '40 mins',
      distance: '1km',
      image: image3,
    },
    {
      id: 4,
      name: 'Yellow Cab (32nd Street)',
      ratings: 5,
      totalBranches: 4,
      time: '40 mins',
      distance: '2.1km',
      image: image4,
    },
    {
      id: 5,
      name: 'Starbucks (32nd Street)',
      ratings: 5,
      totalBranches: 4,
      time: '40 mins',
      distance: '1km',
      image: image1,
    },
    {
      id: 6,
      name: 'Yellow Cab (32nd Street)',
      ratings: 5,
      totalBranches: 4,
      time: '40 mins',
      distance: '2.1km',
      image: image2,
    },
    {
      id: 7,
      name: 'Starbucks (32nd Street)',
      ratings: 5,
      totalBranches: 4,
      time: '40 mins',
      distance: '1km',
      image: image1,
    },
    {
      id: 8,
      name: 'Yellow Cab (32nd Street)',
      ratings: 4.5,
      totalBranches: 4,
      time: '40 mins',
      distance: '2.1km',
      image: image2,
    },
  ];

  const onRestaurantNavigate = (item) => {
    navigation.navigate('ToktokFoodRestaurantOverview', {item});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => onRestaurantNavigate(item)} style={styles.restaurantList}>
      <Image style={styles.img} source={item.image} resizeMode="contain" />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Rating startingValue={item.ratings} tintColor={'whitesmoke'} imageSize={13} readonly style={styles.ratings} />

        <View style={styles.branchInfo}>
          <MCIcon name="store" color={'#868686'} size={13} />
          <Text style={styles.branches}>{item.totalBranches} branches</Text>

          <MCIcon name="clock-outline" color={'#868686'} size={13} />
          <Text style={styles.branches}>{item.time}</Text>

          <MCIcon name="map-marker-outline" color={'#868686'} size={13} />
          <Text style={styles.branches}>{item.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} /> */}

      <View style={styles.listContainer}>
        <FlatList data={restaurants} numColumns={2} renderItem={renderItem} columnWrapperStyle={styles.columnStyle} />
      </View>
    </View>
  );
};

export default RestaurantList;

const styles = StyleSheet.create({
  branchInfo: {
    flexDirection: 'row',
  },
  branches: {
    fontWeight: '400',
    paddingHorizontal: 3,
    fontSize: Platform.OS === 'android' ? 9 : 10 ,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  columnStyle: {
    justifyContent: 'space-between',
  },
  img: {
    height: 150,
    alignSelf: 'center',
    width: Platform.OS === 'android' ? 150 : 170,
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 0 : 10,
  },
  ratings: {
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  restaurantInfo: {
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  restaurantList: {
    // alignItems: 'center',
    width: '50%',
  },
  restaurantName: {
    fontSize: 12,
    fontWeight: '500',
  },
});
