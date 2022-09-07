import React, {useEffect, useState, useContext} from 'react';
import {Dimensions, StyleSheet, Text, View, ImageBackground} from 'react-native';

//COMPONENTS
import {HeaderBack, HeaderTitleRevamp, LoadingIndicator, SomethingWentWrong} from 'toktokwallet/components';
import {OTCPartner, TransferableAndNonTransferableBalance, VerifyContext, VerifyContextProvider} from './components';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_CASH_OUT_PROVIDER_PARTNERS} from 'toktokwallet/graphql';

//HELPER
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const {height, width} = Dimensions.get('window');

//IMAGES
import {backgrounds} from 'toktokwallet/assets';

const MainComponent = ({navigation}) => {
  const {getCashOutProviderPartnersError, getCashOutProviderPartners} = useContext(VerifyContext);

  if (getCashOutProviderPartnersError) {
    return <SomethingWentWrong onRefetch={getCashOutProviderPartners} error={getCashOutProviderPartnersError} />;
  }
  return (
    <ImageBackground style={styles.container} source={backgrounds.gradient_bg} resizeMode="cover">
      <TransferableAndNonTransferableBalance />
      <OTCPartner />
    </ImageBackground>
  );
};

export const ToktokWalletCashOutOTCHome = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack color={COLOR.ORANGE} />,
    headerTitle: () => <HeaderTitleRevamp label={'Cash Out'} />,
  });

  return (
    <VerifyContextProvider>
      <MainComponent />
    </VerifyContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
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
