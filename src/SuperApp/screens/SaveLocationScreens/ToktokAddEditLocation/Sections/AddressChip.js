import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import CONSTANTS from '../../../../../common/res/constants';
import HomeIcon from '../../../../../assets/icons/SavedAddress/home.png';
import OfficeIcon from '../../../../../assets/icons/SavedAddress/office.png';
import CustomIcon from '../../../../../assets/icons/SavedAddress/custom.png';
import {ThrottledOpacity} from '../../../../../components_section';

export const AddressChip = ({
  selectAddressLabel,
  showHomeFunc,
  showOfficeFunc,
  showCustomFunc,
  isHomeSelected,
  isOfficeSelected,
  isCustomSelected,
}) => {
  return (
    <View style={styles.labelContainer}>
      {showHomeFunc() && (
        <ThrottledOpacity onPress={() => selectAddressLabel('Home')}>
          <View style={[styles.labelBox, isHomeSelected ? styles.labelSelected : null]}>
            <Image source={HomeIcon} resizeMode={'contain'} style={styles.labelIcon} />
            <Text>Home</Text>
          </View>
        </ThrottledOpacity>
      )}

      {showOfficeFunc() && (
        <ThrottledOpacity onPress={() => selectAddressLabel('Office')}>
          <View style={[styles.labelBox, isOfficeSelected ? styles.labelSelected : null]}>
            <Image source={OfficeIcon} resizeMode={'contain'} style={styles.labelIcon} />
            <Text>Office</Text>
          </View>
        </ThrottledOpacity>
      )}

      {showCustomFunc() && (
        <ThrottledOpacity onPress={() => selectAddressLabel('Custom')}>
          <View style={[styles.labelBox, isCustomSelected ? styles.labelSelected : null]}>
            <Image source={CustomIcon} resizeMode={'contain'} style={styles.labelIcon} />
            <Text>Custom</Text>
          </View>
        </ThrottledOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  labelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 16,
    marginBottom: 4,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  labelSelected: {
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  labelIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
});
