import React, {useMemo, useContext} from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';

//COMPONENTS
import {LoadingIndicator} from 'toktokwallet/components';
import {OTCPartnerDetails} from './OTCPartnerDetails';
import {VerifyContext} from '../VerifyContextProvider';

import {moderateScale} from 'toktokwallet/helper';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const OTCPartner = () => {
  const {cashOutProviderPartnersHighlighted, getHighlightedPartnersLoading} = useContext(VerifyContext);

  const ListOTCPartnerComponent = useMemo(() => {
    return (
      <View style={styles.billerTypesContainer}>
        {cashOutProviderPartnersHighlighted.map((content, contentIndex) => {
          return (
            <OTCPartnerDetails
              content={content}
              contentIndex={contentIndex}
              title={Object.keys(content)[contentIndex]}
            />
          );
        })}
      </View>
    );
  }, [cashOutProviderPartnersHighlighted]);

  return (
    <View style={styles.container}>
      <Animated.View style={styles.shadowContainer}>
        <Text style={[styles.title, styles.lineSeperator]}>Select OTC Partner</Text>
        {getHighlightedPartnersLoading ? (
          <LoadingIndicator isLoading={true} style={{marginVertical: moderateScale(30)}} size="small" />
        ) : (
          ListOTCPartnerComponent
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: moderateScale(16),
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
