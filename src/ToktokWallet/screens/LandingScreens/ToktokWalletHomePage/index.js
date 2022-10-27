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

export const ToktokWalletHomePage = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const {refreshWallet, getMyAccount, getMyAccountLoading} = useAccount();
  const dispatch = useDispatch();

  const getData = useCallback(() => {
    refreshWallet();
    getMyAccount();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  useEffect(() => {
    dispatch({
      type: 'SET_TOKWA_EVENTS_REDIRECT',
      payload: {
        event: 'cashInTopUp',
        value: false,
      },
    });
  }, []);

  useEffect(() => {
    if (refreshing) {
      setRefreshing(getMyAccountLoading);
    }
  }, [getMyAccountLoading, refreshing]);

  const onRefresh = () => {
    setRefreshing(true);
    refreshWallet();
    getMyAccount();
  };

  return (
    <FlagSecureScreen>
      <CheckIdleState>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <WalletLandingPage onRefresh={onRefresh} refreshing={refreshing} />
      </CheckIdleState>
    </FlagSecureScreen>
  );
};
