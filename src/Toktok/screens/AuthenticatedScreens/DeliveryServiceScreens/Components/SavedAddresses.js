import React from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import CONSTANTS from '../../../../../common/res/constants';
import {DIRTY_WHITE} from '../../../../../res/constants';
import LocationCard from './LocationCard';
import EditIcon from '../../../../../assets/toktokgo/editIcon.png';

const ItemSeparator = () => <View style={styles.separator} />;

const SavedAddresses = ({data, setShowMap, stopData, setStopData, setSearchText, onPressAddAddress}) => {
  const onSelect = item => {};

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Saved Addresses</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            const label = item.place.formattedAddress.split(',');
            return (
              <LocationCard
                item={item}
                label={label[0]}
                formattedAddress={item.place.formattedAddress}
                onSelect={onSelect}
                actionIcon={EditIcon}
                onActionPress={onPressAddAddress}
              />
            );
          }}
        />
      </View>
      <View style={styles.bottomSeparator} />
    </>
  );
};

export default SavedAddresses;

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
