import React, {useState, useRef, useCallback, useEffect} from 'react';
import {View, ActivityIndicator, StatusBar, Text, BackHandler} from 'react-native';
import {SomethingWentWrong, AlertOverlay} from 'src/components';
import {useDispatch} from 'react-redux';
import {useAccount} from 'toktokwallet/hooks';
import {CheckIdleState, FlagSecureScreen} from 'toktokwallet/components';
import {useFocusEffect} from '@react-navigation/native';
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS
import {WalletLandingPage} from './Components';

const {COLOR} = CONSTANTS;

export const ToktokWalletHomePage = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const {refreshWallet, getMyAccountLoading} = useAccount();
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    refreshWallet();
  }, []);

  useEffect(() => {
    refreshWallet();
    dispatch({
      type: 'SET_TOKWA_EVENTS_REDIRECT',
      payload: {
        event: 'cashInTopUp',
        value: false,
      },
    });
  }, []);


  return (
    <FlagSecureScreen>
      <AlertOverlay visible={getMyAccountLoading} />
      <CheckIdleState>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <WalletLandingPage onRefresh={onRefresh} refreshing={refreshing} />
      </CheckIdleState>
    </FlagSecureScreen>
  );
};
