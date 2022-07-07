import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

//SELF IMPORTS
import {
  ApprovedRegistration,
  BlockedAccount,
  DeletedAccount,
  HaveInactiveAccount,
  NoAccount,
  PendingKyc,
  RejectedKyc,
  SecurewithPIN,
  SecureWithMPIN,
  WalletOnHold,
} from './Components';

export const ToktokWalletRestricted = ({navigation, route}) => {
  navigation.setOptions({
    headerShown: false,
  });

  const data = route.params.data ? route.params.data : null;
  const amount = route?.params?.amount ? route.params.amount : null;
  const onCashIn = route?.params.onCashIn ? route.params.onCashIn : null;
  const setUpTpinCallBack = route?.params?.setUpTpinCallBack ? route.params.setUpTpinCallBack : null;
  const showPrompt = route?.params?.showPrompt ? true : null;

  const DisplayComponent = () => {
    switch (route.params.component) {
      case 'onHold':
        return <WalletOnHold navigation={navigation} walletinfo={route.params.walletinfo} />;
      case 'approvedRegistration':
        return <ApprovedRegistration />;
      case 'noPin':
        return (
          <SecurewithPIN
            setUpTpinCallBack={setUpTpinCallBack}
            amount={amount}
            onCashIn={onCashIn}
            navigation={navigation}
            walletinfo={route.params.walletinfo}
          />
        );
      case 'noMpin':
        return <SecureWithMPIN navigation={navigation} walletinfo={route.params.walletinfo} />;
      case 'noAccount':
        return <NoAccount />;
      case 'pendingKYC':
        return <PendingKyc navigation={navigation} />;
      case 'rejectedKYC':
        return <RejectedKyc navigation={navigation} />;
      case 'blockedAccount':
        return <BlockedAccount data={data} showPrompt={showPrompt} />;
      case 'deletedAccount':
        return <DeletedAccount />;
      case 'haveInactiveAccount':
        return <HaveInactiveAccount />;
      default:
        break;
    }
  };

  return (
    <>
      <View style={styles.container}>{DisplayComponent()}</View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 16,
  },
});
