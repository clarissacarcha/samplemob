import React from 'react';
import {FlatList, Image, Platform, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Assets
import {allcuisines, drinks, dailydeals, fastfood} from 'toktokfood/assets/images';

import {moderateScale} from 'toktokfood/helper/scale';

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
    // {
    //   id: 3,
    //   category: 'Daily Deals',
    //   image: dailydeals,
    // },
    // {
    //   id: 4,
    //   category: 'All Cuisines',
    //   image: allcuisines,
    // },
    // {
    //   id: 5,
    //   category: 'Promo',
    //   image: drinks,
    // },
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
        <TouchableOpacity onPress={() => onNavigateCategories()}>
          <Text style={styles.endText}>{rightText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
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
    width: '100%',
    paddingHorizontal: 15,
    flex: Platform.OS === 'android' ? 1 : 0,
  },
  img: {
    borderRadius: 10,
    width: 84,
  },
  listContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  listItemContainer: {
    marginHorizontal: 5,
  },
  listItemVerticalContainer: {
    marginHorizontal: 5,
    marginBottom: moderateScale(18),
  },
  listItemText: {
    fontSize: 13,
    marginTop: 5,
    fontWeight: '500',
    textAlign: 'center',
  },
  endText: {
    fontSize: 15,
    color: '#FFA700',
    fontWeight: '400',
  },
  startText: {
    fontSize: 15,
    fontWeight: '500',
  },
  textContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginVertical: moderateScale(8),
    justifyContent: 'space-between',
  },
});
