import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import {useNavigation} from '@react-navigation/native';
import {useAccount} from 'toktokwallet/hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ACCOUNT_USED_LIMITS} from 'toktokwallet/graphql';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useLazyQuery} from '@apollo/react-hooks';
import {useAlert} from 'src/hooks';
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS
import Card from './Card';
import IncomingLimits from './IncomingLimits';
import OutgoingLimits from './OutgoingLimits';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const toktokwalletLabel = () => {
  return (
    <Text style={{...styles.labelRegular, color: COLOR.YELLOW}}>
      toktok<Text style={{...styles.labelRegular, color: COLOR.ORANGE}}>wallet</Text>
    </Text>
  );
};

export const Limits = () => {
  const {tokwaAccount, getMyAccount} = useAccount();
  const alert = useAlert();
  const navigation = useNavigation();
  const [usedLimits, setUsedLimits] = useState(null);

  const [getAccountUsedLimits, {data, error, loading}] = useLazyQuery(GET_ACCOUNT_USED_LIMITS, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => onErrorAlert({alert, error, navigation}),
    onCompleted: ({getAccountUsedLimits}) => {
      setUsedLimits(getAccountUsedLimits);
    },
  });

  useEffect(() => {
    //   getMyAccount();
    getAccountUsedLimits();
  }, []);

  if (loading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: moderateScale(16)}}>
        <ActivityIndicator size={'small'} color={COLOR.ORANGE} />
      </View>
    );
  }

  if (error) return null;

  const limits = {
    incoming: {
      daily: tokwaAccount?.person?.accountType?.incomingValueDailyLimit,
      monthly: tokwaAccount?.person?.accountType?.incomingValueMonthlyLimit,
      annual: tokwaAccount?.person?.accountType?.incomingValueAnnualLimit,
    },
    outgoing: {
      daily: tokwaAccount?.person?.accountType?.outgoingValueDailyLimit,
      monthly: tokwaAccount?.person?.accountType?.outgoingValueMonthlyLimit,
      annual: tokwaAccount?.person?.accountType?.outgoingValueAnnualLimit,
    },
  };

  return (
    <View style={styles.container}>
      <Card
        title="Wallet Limit"
        description={() => (
          <Text style={styles.labelRegular}>Maximum amount that can be kept in your {toktokwalletLabel()}.</Text>
        )}
        limit={tokwaAccount?.person?.accountType?.walletSize}
        used={tokwaAccount?.wallet?.balance}
        remaining={+tokwaAccount?.person?.accountType?.walletSize - +tokwaAccount?.wallet?.balance}
      />
      {usedLimits && (
        <>
          <OutgoingLimits limits={limits?.outgoing} used={usedLimits?.outgoing} />
          <IncomingLimits limits={limits?.incoming} used={usedLimits?.incoming} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  labelRegular: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: '#525252',
  },
});
