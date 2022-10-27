import React from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import CONSTANTS from '../../../../../common/res/constants';
import {DIRTY_WHITE} from '../../../../../res/constants';
import LocationCard from '../Components/LocationCard';
import EditIcon from '../../../../../assets/icons/SavedAddress/custom.png';

const ItemSeparator = () => <View style={styles.separator} />;

const RecentSearch = ({recentSearchDataList, setShowMap, stopData, setStopData, setSearchText}) => {
  const onSelect = item => {
    setShowMap(true);
    setStopData({
      ...stopData,
      latitude: item.location.latitude,
      longitude: item.location.longitude,
      formattedAddress: item.formattedAddress,
    });
    setSearchText(item.formattedAddress);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Recent Search</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={recentSearchDataList}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={item => item.placeId}
          renderItem={({item, index}) => <LocationCard item={item} onSelect={onSelect} actionIcon={EditIcon} />}
        />
      </View>
      <View style={styles.bottomSeparator} />
    </>
  );
};

export default RecentSearch;

const styles = StyleSheet.create({
  separator: {
    height: 1,
    borderTopWidth: 1,
    borderColor: DIRTY_WHITE,
  },
  container: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  title: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.ORANGE,
  },
  bottomSeparator: {
    height: 1,
    borderTopWidth: 8,
    borderColor: DIRTY_WHITE,
  },
});
