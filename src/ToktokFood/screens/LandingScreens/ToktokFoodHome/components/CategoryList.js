import React from 'react';
import {FlatList, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';

// Assets
import {allcuisines, drinks, dailydeals, fastfood} from 'toktokfood/assets/images';
const CategoryList = () => {
  const data = [
    {
      id: 1,
      category: 'Drinks',
      image: drinks,
    },
    {
      id: 2,
      category: 'Fast Food',
      image: fastfood,
    },
    {
      id: 3,
      category: 'Daily Deals',
      image: dailydeals,
    },
    {
      id: 4,
      category: 'All Cuisines',
      image: allcuisines,
    },
  ];

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.listItemContainer}>
        <Image style={styles.img} resizeMode="cover" source={item.image} />
        <Text style={styles.listItemText}>{item.category}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.startText}>Categories</Text>
        <Text style={styles.endText}>See all</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList scrollEnabled={false} horizontal data={data} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    height: 120,
    paddingHorizontal: 15,
  },
  img: {
    borderRadius: 10,
    width: 84,
  },
  listContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 5,
  },
  listItemContainer: {
    marginHorizontal: 5,
  },
  listItemText: {
    fontWeight: '500',
    fontSize: 13,
    marginTop: 5,
    textAlign: 'center',
  },
  endText: {
    color: '#FFA700',
    fontWeight: '400',
    fontSize: 15,
  },
  startText: {
    fontWeight: '500',
    fontSize: 15,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});
