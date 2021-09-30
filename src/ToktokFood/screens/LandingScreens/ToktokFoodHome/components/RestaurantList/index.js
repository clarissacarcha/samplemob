import React from 'react';
import {FlatList, Platform, StyleSheet, Text, View, Image} from 'react-native';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
// Utils
import {scale, verticalScale, moderateScale} from 'toktokfood/helper/scale';
import RestaurantItem from './RestaurantItem';
import {empty_shop} from 'toktokfood/assets/images';
// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

const RestaurantList = (props) => {
  const {loading, error, data, loadMore, location} = props;

  const renderFooter = () => <LoadingIndicator style={{}} isLoading={loadMore} />;

  const listEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image style={styles.emptyImg} resizeMode="contain" source={empty_shop} />
      <Text style={styles.emptyText}>
        It seems like there is no open restaurant near you. Refresh or try again later.
      </Text>
    </View>
  );

  if (loading || error || location == undefined) {
    return <LoadingIndicator style={{marginVertical: 20}} isFlex isLoading={true} />;
  }
  return (
    // <View style={styles.container}>
    <FlatList
      data={data ? data.getShops : []}
      extraData={loadMore}
      numColumns={2}
      renderItem={({item}) => <RestaurantItem item={item} />}
      // columnWrapperStyle={styles.columnStyle}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={(val, index) => index.toString()}
      ListFooterComponent={renderFooter()}
      ListEmptyComponent={listEmpty()}
      style={{flex: 1}}
      contentContainerStyle={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: Platform.OS == 'android' ? verticalScale(20) : 0,
      }}
    />
    // </View>
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
    alignItems: 'center',
    flex: 1,
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
  },
});
