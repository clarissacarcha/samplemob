import React from 'react';
import {FlatList, Image, Platform, StyleSheet, Text, View} from 'react-native';
// Fonts & Colors
import {FONT_SIZE} from 'res/variables';
import {empty_shop_2} from 'toktokfood/assets/images';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
// Utils
import {moderateScale, scale, verticalScale} from 'toktokfood/helper/scale';
import RestaurantItem from './RestaurantItem';

const RestaurantList = props => {
  const {loading, error, data, loadMore, location} = props;

  const renderFooter = () => {
    if (loadMore) {
      return <LoadingIndicator isLoading={loadMore} />;
    } else {
      return <Text style={styles.footerText}>No more restaurants available to display.</Text>;
    }
  };

  const listEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image style={styles.emptyImg} resizeMode="contain" source={empty_shop_2} />
      <Text style={styles.emptyText}>
        It seems like there is no open restaurant near you. Refresh or try again later.
      </Text>
    </View>
  );

  // if (loading || error || location == undefined) {
  //   return <LoadingIndicator style={{marginVertical: 20}} isFlex isLoading={true} />;
  // }
  return (
    <FlatList
      data={data}
      extraData={loadMore}
      numColumns={2}
      renderItem={({item}) => <RestaurantItem item={item} />}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={(val, index) => index.toString()}
      ListFooterComponent={renderFooter()}
      ListFooterComponentStyle={[styles.footerContainer, {borderTopWidth: loadMore ? 0 : 1}]}
      style={styles.listStyle}
    />
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
    fontSize: Platform.OS === 'android' ? 9 : 10,
  },
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  columnStyle: {
    justifyContent: 'space-between',
  },
  img: {
    height: 150,
    alignSelf: 'center',
    width: Platform.OS === 'android' ? 153 : scale(150),
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
    // marginTop: Platform.OS === 'android' ? 0 : 10,
  },
  listStyle: {
    flex: 1,
    // minHeight: 800,
    paddingTop: moderateScale(15),
    paddingHorizontal: 20,
    backgroundColor: 'white',
    paddingBottom: Platform.OS == 'android' ? verticalScale(20) : 0,
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
  emptyContainer: {
    height: verticalScale(300),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImg: {
    height: moderateScale(175),
    width: moderateScale(250),
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: FONT_SIZE.L,
    textAlign: 'center',
    marginTop: moderateScale(20),
    marginHorizontal: moderateScale(20),
  },
  footerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    marginTop: 7,
    borderColor: '#E6E6E6',
    height: verticalScale(40),
  },
  footerText: {
    fontSize: 13,
    color: '#9E9E9E',
  },
});
