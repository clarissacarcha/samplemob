import React, {useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';
import {SomethingWentWrong} from 'src/components';
import {HeaderBack, HeaderTitleRevamp, CheckIdleState} from 'toktokwallet/components';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ACCOUNT_RECOVERY} from 'toktokwallet/graphql';
import {useQuery} from '@apollo/react-hooks';
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS
import {SetupAnswers, ViewAccountRecovery} from './Components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
export const ToktokWalletAccountRecoverySetup = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Account Recovery'} />,
  });

  const {data, error, loading} = useQuery(GET_ACCOUNT_RECOVERY, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
  });

  if (error) {
    return <SomethingWentWrong />;
  }

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator size={24} color={COLOR.YELLOW} />
      </View>
    );
  }

  if (data?.getAccountRecovery.length > 0) {
    return (
      <CheckIdleState>
        <View style={styles.container}>
          <ViewAccountRecovery data={data.getAccountRecovery} />
        </View>
      </CheckIdleState>
    );
  }

  // SETUP ACCOUNT RECOVERY

  return (
    <CheckIdleState>
      <SetupAnswers />
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
