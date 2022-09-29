import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, Text, ActivityIndicator, ScrollView} from 'react-native';
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

const DisplayComponent = ({
  finishLabel,
  notFinishLabel,
  title,
  btnLabel,
  onPress,
  disabled,
  imgSource,
  checkVcs,
  headerTitle,
  notFinishComponent,
}) => {
  if (disabled) {
    return (
      <FinishRequirement
        finishLabel={finishLabel}
        imgSource={imgSource}
        checkVcs={checkVcs}
        headerTitle={headerTitle}
      />
    );
  }
  return (
    <NotFinishRequirement
      notFinishComponent={notFinishComponent}
      notFinishLabel={notFinishLabel}
      btnLabel={btnLabel}
      onPress={onPress}
      imgSource={imgSource}
      headerTitle={headerTitle}
    />
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
    return navigation.navigate('ToktokWalletBankTransferHome', {screenLabel: 'Link Account'});
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
          Choose your preferred verification method below to upgrade your account to Fully Verified.
        </Text>
        <DisplayComponent
          onPress={redirectLinking} // Navigate here the screen for link bank account
          disabled={isLinkedBankAccount || isPendingLinking}
          headerTitle={!isLinkedBankAccount ? 'Link Account via Bank Transfer' : 'Account Linked'}
          notFinishLabel="Link your toktokwallet account to your bank account via Bank Transfer. It is a faster and easier way to verify your account. One successful transfer will automatically upgrade your account from basic to fully verified."
          notFinishComponent={() => (
            <Text style={{marginTop: 10, marginBottom: 0}}>
              Link your <Text style={{color: '#FDBA1C'}}>toktok</Text>
              <Text style={{color: '#F6841F'}}>wallet</Text> account to your bank account via Bank Transfer. It is a
              faster and easier way to verify your account. One successful transfer will automatically upgrade your
              account from basic to fully verified.
            </Text>
          )}
          btnLabel="Link Now"
          finishLabel={
            isLinkedBankAccount
              ? 'Your application has been approved. Your link account has been verified.'
              : 'Linking your toktokwallet account to your bank account is in progress.'
          }
          imgSource={bank_icon}
        />
        <DisplayComponent
          onPress={() => {
            navigation.navigate('ToktokWalletVideoCallSchedule');
          }}
          disabled={checkVcs.hasVcs}
          headerTitle={
            !checkVcs.hasVcs
              ? 'Request Video Call'
              : checkVcs.isPendingVcs
              ? 'Video Call Requested'
              : 'Video Call Approved'
          }
          notFinishLabel="Request a video call for verification. The Customer Service Representative will assess your chosen schedule and contact you within 24-72hrs for verification and approval of your request for a fully verified account."
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
    fontSize: FONT_SIZE.M,
    marginBottom: 20,
    color: '#525252',
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
