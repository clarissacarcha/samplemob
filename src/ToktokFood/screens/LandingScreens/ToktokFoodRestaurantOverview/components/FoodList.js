import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Fonts & Colors
import {COLOR} from 'res/variables';


import {
  verticalScale,
  getDeviceHeight,
  getStatusbarHeight,
  moderateScale,
  isIphoneXorAbove,
} from 'toktokfood/helper/scale';

const FoodList = (props) => {
  const {foodList} = props;
  const navigation = useNavigation();

  const onNavigateToFoodItemDetails = (item) => {
    navigation.navigate('ToktokFoodItemDetails', item);
  };

  const FoodItem = (item) => {
    return (
      <TouchableOpacity onPress={() => onNavigateToFoodItemDetails(item)} style={styles.listContainer}>
        <View>
          <Text style={styles.listText}>{item.name}</Text>
          <Text style={styles.listPrice}>PHP {item.price.toFixed(2)}</Text>
          <Text>{item.description}</Text>
        </View>
        <View>
          <Image resizeMode="contain" source={item.image} style={styles.img} />
        </View>
      </TouchableOpacity>
    );
  };

  return <View style={styles.container}></View>;
};

export default FoodList;

const styles = StyleSheet.create({
  container: {
    minHeight:
      Platform.OS === 'ios' && isIphoneXorAbove()
        ? 518
        : getDeviceHeight -
          ((Platform.OS === 'android' ? moderateScale(88 + getStatusbarHeight) : moderateScale(105)) +
            moderateScale(180)),

    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLOR.WHITE,
  },
  headerBack: {
    paddingHorizontal: 18,
    justifyContent: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(15),
  },
});
