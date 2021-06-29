import React from 'react';
import {FlatList, View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Fonts & Colors
import {COLOR} from 'res/variables';

// Strings
import {foodData} from 'toktokfood/helper/strings';

import {verticalScale} from 'toktokfood/helper/scale';

const FoodList = () => {
  const navigation = useNavigation();

  const onNavigateToDriver = () => {
    navigation.navigate('ToktokFoodDriver');
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={onNavigateToDriver} style={styles.listContainer}>
      <View>
        <Text style={styles.listText}>{item.name}</Text>
        <Text style={styles.listPrice}>PHP {item.price}</Text>
        <Text>{item.description}</Text>
      </View>
      <View>
        <Image resizeMode="contain" source={item.image} style={styles.img} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={foodData} renderItem={renderItem} />
    </View>
  );
};

export default FoodList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLOR.WHITE,
  },
  headerBack: {
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  img: {
    height: 55,
    width: 60,
  },
  listText: {
    fontWeight: '500',
    paddingVertical: 3,
  },
  listPrice: {
    color: '#FF6200',
    fontWeight: '500',
    paddingVertical: 3,
  },
  listContainer: {
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    // borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(15),
    // marginBottom: verticalScale(5),
  },
});
