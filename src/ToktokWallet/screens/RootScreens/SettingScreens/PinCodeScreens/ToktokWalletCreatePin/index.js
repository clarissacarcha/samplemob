import React, {useState, useEffect} from 'react';
import {View, StyleSheet, BackHandler, Platform, ImageBackground} from 'react-native';
//GRAPHQL, HOOKS
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {PATCH_PIN_CODE} from 'toktokwallet/graphql';
import {useMutation} from '@apollo/react-hooks';
import {useSelector} from 'react-redux';
import {usePrompt} from 'src/hooks';
import {useAccount} from 'toktokwallet/hooks';
//ASSETS
import {backgrounds} from 'toktokwallet/assets';
//UTIL, HELPER
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {TransactionUtility} from 'toktokwallet/util';
//COMPONENTS
import {CreateConfirmPin, CreatePin, SuccessfulModal, VerifyPin} from './Components';
import {LeavePromptModal, CheckIdleState, HeaderBack} from 'toktokwallet/components';
import {AlertOverlay} from 'src/components';

export const ToktokWalletCreatePin = ({navigation, route}) => {
  // const walletinfo = route.params.walletinfo
  const tokwaAccount = useSelector(state => state.toktokWallet);
  const {getMyAccount, tokwaAccount: tokwaAccountLatest, getMyAccountLoading} = useAccount();
  const [pinCode, setPinCode] = useState('');
  const [oldTPIN, setOldTPIN] = useState('');
  const [newPinCode, setNewPinCode] = useState('');
  const [pageIndex, setPageIndex] = useState(tokwaAccount.pinCode ? 0 : 1);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successPinChange, setSuccessPinChange] = useState(false);
  const [LeaveModalvisible, setLeaveModalVisible] = useState(false);
  const prompt = usePrompt();
  const amount = route?.params?.amount ? route.params.amount : null;
  const onCashIn = route?.params?.onCashIn ? route.params.onCashIn : null;
  const setUpTpinCallBack = route?.params?.setUpTpinCallBack ? route.params.setUpTpinCallBack : null;

  const cancelSetup = () => {
    setLeaveModalVisible(true);
  };

  navigation.setOptions({
    headerShown: false,
  });

  const backAction = () => {
    closeScreen();
    return true;
  };

  const closeScreen = () => {
    const landingPage = tokwaAccount.pinCode ? 0 : 1;
    if (pageIndex === landingPage) {
      navigation.pop();
      setNewPinCode('');
    } else {
      setPageIndex(oldstate => oldstate - 1);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [pageIndex]);

  useEffect(() => {
    if (successPinChange) {
      if (tokwaAccountLatest.pinCode && onCashIn) {
        if (navigation.canGoBack()) navigation.pop();
        navigation.push('ToktokWalletPaymentOptions', {
          amount: amount ? amount : 0,
          onCashIn: onCashIn,
        });
        setSuccessPinChange(false);
      }
      if (tokwaAccountLatest.pinCode && setUpTpinCallBack) {
        setUpTpinCallBack();
        if (navigation.canGoBack()) navigation.pop();
        setSuccessPinChange(false);
        return;
      }
      if (tokwaAccountLatest.pinCode && !onCashIn && !setUpTpinCallBack) {
        navigation.navigate('ToktokWalletHomePage');
        setSuccessPinChange(false);
        return;
      }
    }
  }, [tokwaAccountLatest, onCashIn, setUpTpinCallBack, navigation, amount, successPinChange]);

  const [patchPinCode, {loading}] = useMutation(PATCH_PIN_CODE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: () => {
      if (tokwaAccount.pinCode || onCashIn) {
        prompt({
          type: 'success',
          title: 'TPIN Changed',
          message: 'You have successfully changed your TPIN. Please do not share this with anyone.',
          event: 'TOKTOKBILLSLOAD',
          onPress: () => {
            setSuccessPinChange(true);
            getMyAccount();
          },
        });
      } else {
        setSuccessModalVisible(true);
      }
    },
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
    },
  });

  const proceed = () => {
    patchPinCode({
      variables: {
        input: {
          pinCode: pinCode,
          oldTPIN: oldTPIN,
          deviceType: Platform.OS === 'ios' ? 'IOS' : 'Android',
        },
      },
    });
  };

  const DisplayComponent = () => {
    switch (pageIndex) {
      case 0:
        return (
          <VerifyPin pageIndex={pageIndex} setPageIndex={setPageIndex} oldTPIN={oldTPIN} setOldTPIN={setOldTPIN} />
        );
      case 1:
        return (
          <CreatePin
            pinCode={pinCode}
            tokwaAccount={tokwaAccount}
            setPinCode={setPinCode}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            newPinCode={newPinCode}
            setNewPinCode={setNewPinCode}
          />
        );
      case 2:
        return (
          <CreateConfirmPin
            tokwaAccount={tokwaAccount}
            pinCode={pinCode}
            setPinCode={setPinCode}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            patchPincodeToktokWallet={proceed}
          />
        );
      default:
        return;
    }
  };

  return (
    <CheckIdleState>
      <AlertOverlay visible={loading} />
      <LeavePromptModal
        visible={LeaveModalvisible}
        setVisible={setLeaveModalVisible}
        onConfirm={() => navigation.goBack()}
      />
      <SuccessfulModal
        amount={amount}
        setUpTpinCallBack={setUpTpinCallBack}
        onCashIn={onCashIn}
        modalVisible={successModalVisible}
        tokwaAccount={tokwaAccount}
        setSuccessModalVisible={setSuccessModalVisible}
      />
      <ImageBackground source={backgrounds.gradient_tpin} style={styles.container}>
        <View style={{marginTop: Platform.OS === 'ios' ? moderateScale(16) : getStatusbarHeight + moderateScale(16)}}>
          <HeaderBack onBack={backAction} />
        </View>
        {DisplayComponent()}
      </ImageBackground>
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    borderRadius: 10,
    marginLeft: 10,
    overflow: 'hidden',

    height: 30,
    width: 30,
  },
  iconBox: {
    // backgroundColor: DARK,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
