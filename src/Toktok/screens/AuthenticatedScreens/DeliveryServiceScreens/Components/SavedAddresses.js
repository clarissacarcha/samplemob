import React from 'react';
import {View, StyleSheet, Text, FlatList, Image, ActivityIndicator} from 'react-native';
import CONSTANTS from '../../../../../common/res/constants';
import {DIRTY_WHITE} from '../../../../../res/constants';
import EditIcon from '../../../../../assets/toktokgo/editIcon.png';
import NavIcon from '../../../../../assets/icons/arrow-right-icon.png';
import {ThrottledOpacity} from '../../../../../components_section';
import LocationCard from './LocationCard';

const ItemSeparator = () => <View style={styles.separator} />;

const SavedAddresses = ({navigation, data, onSelectSavedAddress, callMe}) => {
  const onPressAddAddress = item => {
    navigation.push('ToktokAddEditLocation', {addressIdFromService: item.id});
  };

  const getAddressObj = item => {
    onSelectSavedAddress(item);
    // callMe(item);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Saved Addresses</Text>
          <ThrottledOpacity
            style={styles.innerWrapper}
            onPress={() => {
              navigation.push('ToktokSavedLocations', {getAddressObj});
            }}>
            <Text style={styles.textstyle}>See All</Text>
            <Image source={NavIcon} resizeMode={'contain'} style={{width: 11, height: 11}} />
          </ThrottledOpacity>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            const label = item.isHome ? 'Home' : item.isOffice ? 'Office' : item.label;

            return (
              <LocationCard
                item={item}
                label={label}
                formattedAddress={item.place.formattedAddress}
                onSelect={onSelectSavedAddress}
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
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textstyle: {
    color: CONSTANTS.COLOR.ORANGE,
    marginRight: 10,
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
