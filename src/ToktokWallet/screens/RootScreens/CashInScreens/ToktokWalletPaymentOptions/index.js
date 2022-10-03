import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, FlatList, Alert, ActivityIndicator} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FIcon from 'react-native-vector-icons/Feather';
import {useQuery, useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_CASH_IN_PROVIDERS, GET_WALLET_REMAINING_CASH_IN} from 'toktokwallet/graphql';
import {
  Separator,
  HeaderImageBackground,
  CheckIdleState,
  HeaderTitleRevamp,
  HeaderBack,
  SomethingWentWrong,
} from 'toktokwallet/components';
import {numberFormat} from 'toktokwallet/helper';
import {useDispatch} from 'react-redux';
import CONSTANTS from 'common/res/constants';
import {usePrompt} from 'src/hooks';
import {useAccount} from 'toktokwallet/hooks';
import {AlertOverlay} from 'src/components';
import {TransactionUtility} from 'toktokwallet/util';
//SELF IMPORTS
import {DragonPayCashIn} from './Components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;

export const ToktokWalletPaymentOptions = ({navigation, route}) => {
  const amount = route?.params?.amount ? route.params.amount : null;
  const onCashIn = route?.params?.onCashIn ? route.params.onCashIn : null;
  const {tokwaAccount, getMyAccountLoading, getMyAccount, getGlobalSettings, getGlobalSettingsLoading} = useAccount();
  const [remainingCashIn, setRemainingCashIn] = useState(0);
  const dispatch = useDispatch();
  const prompt = usePrompt();
  const {
    data: cashinmethods,
    error,
    loading,
  } = useQuery(GET_CASH_IN_PROVIDERS, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        isPop: false,
      });
    },
  });

  const [getWalletRemainingCashIn, {loading: remainingLoading, error: remainingError}] = useLazyQuery(
    GET_WALLET_REMAINING_CASH_IN,
    {
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onCompleted: data => {
        setRemainingCashIn(data.getWalletRemainingCashIn);
      },
    },
  );

  // if(tokwaAccount.constants.CashInType == "paypanda"){
  //     navigation.setOptions({
  //         headerShown: false,
  //     })
  // }else{
  //     navigation.setOptions({
  //         headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
  //         headerTitle: ()=> <ToktokHeaderTitle label={['Cash In','']}/>,
  //     })
  // }

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={['Cash In']} />,
  });
  const checkStatus = async () => {
    await getMyAccount();
    // if(!tokwaAccount.mobileNumber){
    //     await getMyAccount()
    //     return
    // }

    // if(!tokwaAccount?.constants?.CashInType){
    //     await getGlobalSettings();
    //     return
    // }

    // if(!tokwaAccount.pinCode){
    //     return navigation.replace("ToktokWalletRestricted", {component: "noPin" , amount: amount , onCashIn: onCashIn})
    // }
  };

  useEffect(() => {
    getWalletRemainingCashIn();
  }, []);

  useEffect(() => {
    if (!tokwaAccount.pinCode && tokwaAccount.mobileNumber) {
      return navigation.replace('ToktokWalletRestricted', {component: 'noPin', amount: amount, onCashIn: onCashIn});
    }
  }, [tokwaAccount, onCashIn]);

  useEffect(() => {
    if (onCashIn) {
      dispatch({
        type: 'SET_TOKWA_EVENTS_REDIRECT',
        payload: {
          event: 'cashInTopUp',
          value: true,
        },
      });
      checkStatus();
    }
  }, []);

  if (loading || remainingLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator size={'small'} color={COLOR.ORANGE} />
      </View>
    );
  }

  if (error || remainingError) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
        <SomethingWentWrong error={error ?? remainingError} onRefetch={getWalletRemainingCashIn} />
      </View>
    );
  }

  const CashInMethod = ({item, index}) => {
    let image, navigateLink;
    if (item.name.toLowerCase() == 'paypanda') {
      image = require('toktokwallet/assets/images/cash-in-providers/paypanda.png');
      navigateLink = 'ToktokWalletPayPandaForm';
    } else {
      image = require('toktokwallet/assets/images/cash-in-providers/jcwallet.png');
      navigateLink = 'ToktokWalletPayPandaForm';
    }
    return (
      <TouchableOpacity
        key={`cashin-${index}`}
        style={styles.cashinoption}
        onPress={() =>
          navigateLink != ''
            ? navigation.navigate(navigateLink, {
                walletinfo: null,
                transactionType: item,
                amount: amount,
                onCashIn: onCashIn,
              })
            : Alert.alert('', 'Temporary Unavailable')
        }>
        <View style={styles.logo}>
          <Image style={{height: 35, width: 35}} resizeMode="contain" source={image} />
        </View>
        <View style={styles.name}>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD}}>{item.name}</Text>
          <Text style={{fontSize: FONT_SIZE.S, fontFamily: FONT.REGULAR}}>Use {item.name} to cash in</Text>
        </View>
        <View style={styles.arrowright}>
          <FIcon name={'chevron-right'} size={20} color={'#A6A8A9'} />
        </View>
      </TouchableOpacity>
    );
  };

  const PayPandaOption = () => {
    return (
      <View style={styles.container}>
        <View style={styles.headings}>
          <HeaderImageBackground>
            <HeaderTitle label="Cash In" />
            <View style={styles.walletBalance}>
              <Text style={{fontSize: 24, fontFamily: FONT.BOLD}}>
                {tokwaAccount.wallet.currency.code}{' '}
                {numberFormat(tokwaAccount.wallet.balance ? tokwaAccount.wallet.balance : 0)}
              </Text>
              <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>Available Balance</Text>
            </View>
          </HeaderImageBackground>
        </View>
        <View style={styles.paymentoptions}>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD}}>Choose cash in method</Text>
        </View>
        <Separator />
        <FlatList data={cashinmethods.getCashInProviders} keyExtractor={item => item.id} renderItem={CashInMethod} />
      </View>
    );
  };

  return (
    <CheckIdleState>
      <AlertOverlay visible={getMyAccountLoading || getGlobalSettingsLoading} />
      {/* {
               tokwaAccount.constants.CashInType == "paypanda"
               ? <PayPandaOption/>
               : <DragonPayCashIn
                    route={route}
                    navigation={navigation}
                    transactionType={cashinmethods.getCashInProviders[0]}
               />
           } */}
      <DragonPayCashIn
        route={route}
        navigation={navigation}
        transactionType={cashinmethods.getCashInProviders[0]}
        remainingCashIn={remainingCashIn}
      />
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headings: {
    height: 190,
    backgroundColor: 'black',
  },
  walletBalance: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentoptions: {
    padding: 16,
  },
  cashinoption: {
    padding: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#F4F4F4',
    flexDirection: 'row',
  },
  logo: {
    flexBasis: 45,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  arrowright: {
    flexBasis: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
