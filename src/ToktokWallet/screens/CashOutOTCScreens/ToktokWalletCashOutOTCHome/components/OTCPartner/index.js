import React, {useMemo} from 'react';
import {Dimensions, StyleSheet, Text, View, Animated, FlatList} from 'react-native';

//COMPONENTS
import {HeaderBack, HeaderTitle} from 'src/revamp';

import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
import {OTCPartnerDetails} from './OTCPartnerDetails';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const {height, width} = Dimensions.get('window');

const OTCPartnerData = [
  {
    name: 'LBC Express',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/LBC_Express_2013_Logo.svg/1200px-LBC_Express_2013_Logo.svg.png',
  },
  {
    name: 'LBC Express',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/LBC_Express_2013_Logo.svg/1200px-LBC_Express_2013_Logo.svg.png',
  },
  {
    name: 'LBC Express',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/LBC_Express_2013_Logo.svg/1200px-LBC_Express_2013_Logo.svg.png',
  },
  {
    name: 'LBC Express',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/LBC_Express_2013_Logo.svg/1200px-LBC_Express_2013_Logo.svg.png',
  },
];

export const OTCPartner = ({navigation}) => {
  const ListOTCPartnerComponent = useMemo(() => {
    return (
      <Animated.View style={[styles.shadowContainer]}>
        <Text style={[styles.title, styles.lineSeperator]}>Select OTC Partner</Text>
        <View style={styles.billerTypesContainer}>
          <FlatList
            data={OTCPartnerData}
            renderItem={({item, index}) => <OTCPartnerDetails item={item} index={index} />}
            numColumns={4}
          />
        </View>
      </Animated.View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>{ListOTCPartnerComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  flatlistContainer: {
    paddingVertical: moderateScale(15),
    flexGrow: 1,
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(15),
    color: COLOR.ORANGE,
  },
  lineSeperator: {
    borderWidth: 1,
    borderColor: '#C4C4C436',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
  },
  seeAllText: {
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  billerTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: moderateScale(20),
  },
});
