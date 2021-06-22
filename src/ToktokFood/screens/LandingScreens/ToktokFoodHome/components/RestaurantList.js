import React, {useState} from 'react';
import {FlatList, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';

// Components
// import HeaderTabs from 'toktokfood/components/HeaderTabs';

// Assets
import {image1, image2, image3, image4} from 'toktokfood/assets/images';

const RestaurantList = () => {
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
      ratings: 5,
      totalBranches: 4,
      time: '40 mins',
      distance: '2.1km',
      image: image2,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.restaurantList}>
      <Image style={styles.img} source={item.image} resizeMode="contain" />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  columnStyle: {
    justifyContent: 'space-between',
  },
  img: {
    width: 170,
    height: 150,
  },
  listContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 10,
  },
  restaurantInfo: {
    marginTop: 5,
    marginHorizontal: 3,
  },
  restaurantList: {
    alignItems: 'center',
    width: '50%',
  },
  restaurantName: {
    fontSize: 12,
    fontWeight: '500',
  },
});
