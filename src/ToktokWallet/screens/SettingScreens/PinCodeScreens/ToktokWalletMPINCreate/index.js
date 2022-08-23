import React, {useState, useEffect} from 'react';
import {View, StyleSheet, BackHandler, Platform, ImageBackground} from 'react-native';
import {useAccount} from 'toktokwallet/hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {PATCH_MPIN_CODE} from 'toktokwallet/graphql';
import {useMutation} from '@apollo/react-hooks';
import {usePrompt} from 'src/hooks';
import {backgrounds} from 'toktokwallet/assets';
//UTIL, HELPER
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {TransactionUtility} from 'toktokwallet/util';
//COMPONENTS
import {Confirm, Create, SuccessfulModal, Verify} from './Components';
import {LeavePromptModal, CheckIdleState, HeaderBack} from 'toktokwallet/components';
import {AlertOverlay} from 'src/components';
export const ToktokWalletMPINCreate = ({navigation, route}) => {
  const {tokwaAccount} = useAccount();
  const [pageIndex, setPageIndex] = useState(tokwaAccount.mpinCode ? 0 : 1);
  const [pinCode, setPinCode] = useState('');
  const [oldMPIN, setOldMPIN] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [LeaveModalvisible, setLeaveModalVisible] = useState(false);
  const prompt = usePrompt();

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
    } else {
      setPageIndex(oldstate => oldstate - 1);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [pageIndex]);

  const [patchMPinCode, {loading}] = useMutation(PATCH_MPIN_CODE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: () => {
      if (tokwaAccount.mpinCode) {
        prompt({
          type: 'success',
          title: 'MPIN Changed',
          message: 'You have successfully changed your MPIN. Please do not share this with anyone.',
          event: 'TOKTOKBILLSLOAD',
          onPress: () => {
            navigation.pop(3);
            navigation.navigate('ToktokLandingHome');
            navigation.push('ToktokWalletLoginPage');
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
    patchMPinCode({
      variables: {
        input: {
          pinCode: pinCode,
          oldMPIN: oldMPIN,
          deviceType: Platform.OS === 'ios' ? 'IOS' : 'Android',
        },
      },
    });
  };

  const DisplayComponent = () => {
    switch (pageIndex) {
      case 0:
        return <Verify pageIndex={pageIndex} setPageIndex={setPageIndex} setOldMPIN={setOldMPIN} />;
      case 1:
        return (
          <Create
            pinCode={pinCode}
            tokwaAccount={tokwaAccount}
            setPinCode={setPinCode}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
          />
        );
      case 2:
        return (
          <Confirm
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
      <SuccessfulModal modalVisible={successModalVisible} tokwaAccount={tokwaAccount} />
      <LeavePromptModal
        visible={LeaveModalvisible}
        setVisible={setLeaveModalVisible}
        onConfirm={() => {
          if (!tokwaAccount.mpinCode) {
            return navigation.pop(3);
          }
          navigation.goBack();
        }}
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
  },
});
