import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
//COMPONENTS
import {CheckIdleState, SomethingWentWrong} from 'toktokwallet/components';
import {NotFinishRequirement, FinishRequirement} from './components';
import {HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';
//HOOKS & GRAPHQL
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_CHECK_FULLY_VERIFIED_UPGRADE_REQUEST, GET_CHECK_PENDING_DISBURSEMENT_ACCOUNT} from 'toktokwallet/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {useAccount} from 'toktokwallet/hooks';
import {useDispatch} from 'react-redux';
//ASSETS
import {bank_icon, schedule_icon} from 'toktokwallet/assets';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

const DisplayComponent = ({finishLabel, notFinishLabel, title, btnLabel, onPress, disabled, imgSource, checkVcs}) => {
  if (disabled) {
    return <FinishRequirement finishLabel={finishLabel} imgSource={imgSource} checkVcs={checkVcs} />;
  }
  return (
    <NotFinishRequirement notFinishLabel={notFinishLabel} btnLabel={btnLabel} onPress={onPress} imgSource={imgSource} />
  );
};
export const ToktokWalletFullyVerifiedApplication = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Upgrade Account'} />,
  });

  const [isLinkedBankAccount, setIsLinkedBankAccount] = useState(false);
  const [isPendingLinking, setIsPendingLinking] = useState(false);
  const [checkVcs, setCheckVcs] = useState({
    hasVcs: false,
    isPendingVcs: false,
  });
  const {tokwaAccount, getMyAccountLoading, getMyAccount} = useAccount();
  const dispatch = useDispatch();

  const [checkHasVcs, {error: errorCheckVcs, loading: loadingCheckVcs}] = useLazyQuery(
    GET_CHECK_FULLY_VERIFIED_UPGRADE_REQUEST,
    {
      fetchPolicy: 'network-only',
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onCompleted: ({getCheckFullyVerifiedUpgradeRequest}) => {
        setCheckVcs(getCheckFullyVerifiedUpgradeRequest);
      },
    },
  );

  const [
    getCheckPendingDisbursementAccount,
    {error: errorCheckPendingDisbursement, loading: loadingCheckPendingDisbursement},
  ] = useLazyQuery(GET_CHECK_PENDING_DISBURSEMENT_ACCOUNT, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: data => {
      setIsPendingLinking(data.getCheckPendingDisbursementAccount.result);
    },
  });

  const checkHasLinkBankAccount = useCallback(() => {
    tokwaAccount.isLinked ? setIsLinkedBankAccount(true) : getCheckPendingDisbursementAccount();
  }, [getCheckPendingDisbursementAccount, tokwaAccount.isLinked]);

  useEffect(() => {
    handleGetData();
  }, [getMyAccount, checkHasLinkBankAccount, checkHasVcs, handleGetData]);

  useEffect(() => {
    checkHasLinkBankAccount();
  }, [tokwaAccount, checkHasLinkBankAccount]);

  const handleGetData = useCallback(() => {
    getMyAccount();
    checkHasLinkBankAccount();
    checkHasVcs();
  }, [checkHasLinkBankAccount, checkHasVcs, getMyAccount]);

  const redirectLinking = () => {
    dispatch({
      type: 'SET_TOKWA_EVENTS_REDIRECT',
      payload: {
        event: 'upgradeAccount',
        value: true,
      },
    });
    return navigation.navigate('ToktokWalletCashOutHomePage', {screenLabel: 'Link Account'});
  };

  if (loadingCheckVcs || loadingCheckPendingDisbursement || getMyAccountLoading) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator color={COLOR.ORANGE} size={'small'} />
      </View>
    );
  }

  if (errorCheckVcs || errorCheckPendingDisbursement) {
    return <SomethingWentWrong error={errorCheckVcs ?? errorCheckPendingDisbursement} onRefetch={handleGetData} />;
  }

  return (
    <CheckIdleState>
      {/* <AlertOverlay visible={getMyAccountLoading} /> */}
      {/* <SuccessfulModal
        visible={showSuccessModal}
        title="Success!"
        description={'Your schedule has been submitted.\nPlease wait for our representative to\nget in touch with you'}
        redirect={() => {
          setShowSuccessModal(false);
        }}
      /> */}
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Upgrade Account</Text>
        <Text style={styles.fontRegularStyle}>
          Meet the following requirements for upgrading your account to Fully Verifed
        </Text>
        <DisplayComponent
          onPress={redirectLinking} // Navigate here the screen for link bank account
          disabled={isLinkedBankAccount || isPendingLinking}
          notFinishLabel="Link your toktokwallet account to one bank account."
          btnLabel="Link Now"
          finishLabel={
            isLinkedBankAccount
              ? 'Your account has been successfully linked to your bank account.'
              : 'Your Account Application has been submitted. Please wait for approval.'
          }
          imgSource={bank_icon}
        />
        <DisplayComponent
          onPress={() => {
            navigation.navigate('ToktokWalletVideoCallSchedule');
          }}
          disabled={checkVcs.hasVcs}
          notFinishLabel="Request a video call for verification."
          btnLabel="Schedule Now"
          finishLabel={
            checkVcs.isPendingVcs
              ? 'Your schedule has been submitted. Kindly wait for our representative to call on the schedule provided.'
              : 'Your video call has been carefully reviewed and approved.'
          }
          imgSource={schedule_icon}
          checkVcs={checkVcs}
        />
      </View>
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  fontRegularStyle: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    marginBottom: 20,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    marginBottom: 10,
  },
});
