import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, View, FlatList, Text, TouchableWithoutFeedback} from 'react-native';

import {Rating} from 'react-native-ratings';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Components

// import HeaderTabs from 'toktokfood/components/HeaderTabs';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import DialogMessage from 'toktokfood/components/DialogMessage';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

// Fonts & Colors
// import {COLOR} from 'res/variables';

// Strings
import {restaurants, tabs} from 'toktokfood/helper/strings';

import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

import styles from './styles';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(143 + getStatusbarHeight) : moderateScale(145),
  bgImage: Platform.OS === 'android' ? moderateScale(115 + getStatusbarHeight) : moderateScale(125),
};

const ToktokFoodSearch = () => {
  tabs[3] = {
    id: 4,
    name: 'Best Sellers',
  };

  const navigation = useNavigation();
  // const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isShowError, setShowError] = useState(false);
  // const [foodQuery, setFoodQuery] = useState(true);

  const onRestaurantNavigate = (item) => {
    navigation.navigate('ToktokFoodRestaurantOverview', {item});
  };

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback onPress={() => onRestaurantNavigate(item)}>
      <View style={styles.itemContainer}>
        <View style={styles.imgWrapper}>
          <Image resizeMode="contain" source={item.image} style={styles.img} />
          {/* <View style={styles.branchWrapper}>
            <MCIcon name="store" color={COLOR.ORANGE} size={13} />
            <Text style={styles.branchText}>{item.totalBranches} branches</Text>
          </View> */}
        </View>

        <View style={styles.restaurantInfo}>
          <View style={styles.infoWrapper}>
            <Text numberOfLines={2} style={styles.restaurantName}>
              {item.name}
            </Text>
            <Rating startingValue={item.ratings} imageSize={15} readonly style={styles.ratings} />
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
      <DialogMessage
        type="error"
        visibility={isShowError}
        title="No result found"
        onCloseModal={() => setShowError(false)}
      />
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle showAddress={true} />
        <HeaderSearchBox
          onSearch={(t) => {
            if (t === 'mcdo') {
              setShowError(true);
            }
          }}
        />
      </HeaderImageBackground>
      <View style={styles.tabContainer}>
        {/* <HeaderTabs activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} /> */}
        <Text style={[styles.restaurantName, {fontSize: 18}]}>Restaurants</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList data={restaurants} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default ToktokFoodSearch;
