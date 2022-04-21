import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {MEDIUM} from '../../../../res/constants';
import CONSTANTS from '../../../../common/res/constants';

export const SavedLocation = ({location, deleteSavedLocation}) => {
  return (
    <TouchableHighlight underlayColor={CONSTANTS.COLOR.WHITE_UNDERLAY} style={styles.container}>
      <View style={styles.cardShadow}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{location.name}</Text>
          {/* to do: condition here */}
          {true && <Text style={styles.headerDefaultText}>Default</Text>}
        </View>
        <View style={styles.lineDivider} />
        <View style={styles.contentContainer}>
          <Text style={styles.contactNameText}>Contact Name Here</Text>
          <Text style={styles.mobNumberText}>Mobile Number Here</Text>
          <Text style={styles.addressText}>{location.formattedAddress}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardShadow: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: MEDIUM,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    marginBottom: 8,
  },
  headerDefaultText: {
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ORANGE,
  },
  lineDivider: {
    marginHorizontal: -16,
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
  },
  contentContainer: {
    alignContent: 'center',
  },
  contactNameText: {
    marginTop: 16,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  mobNumberText: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginVertical: 8,
  },
  addressText: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: MEDIUM,
  },
});
