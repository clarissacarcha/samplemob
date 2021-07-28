import React from 'react';
import {FlatList, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Assets
import {allcuisines, drinks, dailydeals, fastfood} from 'toktokfood/assets/images';
const CategoryList = ({horizontal, rightText = ''}) => {
  const navigation = useNavigation();
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
    {
      id: 5,
      category: 'Promo',
      image: drinks,
    },
  ];

  const onNavigateCategories = () => {
    navigation.navigate('ToktokFoodCategories');
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={horizontal ? styles.listItemContainer : styles.listItemVerticalContainer}>
        <Image style={styles.img} resizeMode="cover" source={item.image} />
        <Text style={styles.listItemText}>{item.category}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.startText}>Categories</Text>
        <TouchableOpacity onPress={onNavigateCategories}>
          <Text style={styles.endText}>{rightText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {/* showsHorizontalScrollIndicator={false} added for Android */}
        <FlatList
          horizontal={horizontal}
          numColumns={!horizontal ? 4 : 0}
          data={data}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    paddingHorizontal: 15,
    flex: 1,
  },
  img: {
    borderRadius: 10,
    width: 84,
  },
  listContainer: {
    alignItems: 'center',
    marginTop: 3,
  },
  listItemContainer: {
    marginHorizontal: 5,
  },
  listItemVerticalContainer: {
    marginHorizontal: 5,
    marginBottom: 10,
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
    fontSize: 15,
    fontWeight: '500',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
});
