import React from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import CONSTANTS from '../../../../../common/res/constants';
import {DIRTY_WHITE} from '../../../../../res/constants';
import LocationCard from '../Components/LocationCard';
import EditIcon from '../../../../../assets/icons/SavedAddress/custom.png';

const ItemSeparator = () => <View style={styles.separator} />;

const RecentDelivery = ({data, onSelectRecentDelivery, navigation}) => {
  const onPressAddAddress = item => {
    navigation.push('ToktokAddEditLocation', {
      coordsFromService: item.hashedPlace.place.location,
      formattedAddress: item.hashedPlace.place.formattedAddress,
    });
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Recent Delivery</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data?.getDeliveryRecentRecipients}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={item => item.placeId}
          renderItem={({item, index}) => {
            const label = item.hashedPlace.place.formattedAddress.split(',');
            return (
              <LocationCard
                item={item}
                label={label[0]}
                formattedAddress={item.hashedPlace.place.formattedAddress}
                onSelect={onSelectRecentDelivery}
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

export default RecentDelivery;

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
