import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Alert, BackHandler, ImageBackground, Platform} from 'react-native';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {PATCH_MPIN_CODE} from 'toktokwallet/graphql';
import {useMutation} from '@apollo/react-hooks';
import {usePrompt} from 'src/hooks';
import {backgrounds} from 'toktokwallet/assets';
import {useAccount} from 'toktokwallet/hooks';

//UTIL, HELPER
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {TransactionUtility} from 'toktokwallet/util';
//COMPONENTS
import {Confirm, New} from './Components';
import {LeavePromptModal, CheckIdleState, HeaderBack} from 'toktokwallet/components';
import {AlertOverlay} from 'src/components';

// const HeaderBack = ({pageIndex, setPageIndex, navigation}) => {
//   const backAction = () => {
//     closeScreen();
//     return true;
//   };

//   const closeScreen = () => {
//     pageIndex == 0 ? navigation.pop() : setPageIndex(oldstate => oldstate - 1);
//   };

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

//     return () => backHandler.remove();
//   }, [pageIndex]);

//   return (
//     <TouchableHighlight onPress={closeScreen} underlayColor={'white'} style={styles.button}>
//       <View style={styles.iconBox}>
//         <FIcon5 name="chevron-left" color={COLOR.YELLOW} size={13} />
//       </View>
//     </TouchableHighlight>
//   );
// };

export const ToktokWalletMPINUpdate = ({navigation, route}) => {
  const otp = route.params.otp;
  const event = route.params.event;
  const category = route.params?.category ? route.params?.category : null;
  const {getMyAccount} = useAccount();

  navigation.setOptions({
    headerShown: false,
  });

  const cancelSetup = () => {
    console.log('Cancelling');
    setLeaveModalVisible(true);
  };

  const [pageIndex, setPageIndex] = useState(0);
  const [pinCode, setPinCode] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [LeaveModalvisible, setLeaveModalVisible] = useState(false);
  const prompt = usePrompt();

  const backAction = useCallback(() => {
    closeScreen();
    return true;
  }, [closeScreen]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeScreen = () => {
    pageIndex === 0 ? navigation.pop() : setPageIndex(oldstate => oldstate - 1);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [backAction, pageIndex]);

  const [patchMPinCode, {loading}] = useMutation(PATCH_MPIN_CODE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: () => {
      const title = event === 'ACCOUNT RECOVERY' && !category ? 'Account Recovery Successful' : 'MPIN Changed';
      const message =
        event === 'ACCOUNT RECOVERY' && !category
          ? '"You have successfully recovered your account. Please do not forget your new MPIN and do not share this with anyone.'
          : 'You have successfully changed your MPIN. Please do not share this with anyone.';
      prompt({
        type: 'success',
        title,
        message,
        event: 'TOKTOKBILLSLOAD',
        onPress: () => {
          if (event === 'ACCOUNT RECOVERY') {
            getMyAccount();
            navigation.pop(3);
            navigation.navigate('ToktokLandingHome');
            navigation.push('ToktokWalletLoginPage');
          } else if (event === 'FORGOT MPIN') {
            navigation.pop(2);
          } else {
            navigation.navigate('ToktokWalletHomePage');
            navigation.replace('ToktokWalletHomePage');
          }
        },
      });
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
          otp: otp,
          deviceType: Platform.OS === 'ios' ? 'IOS' : 'Android',
        },
      },
    });
  };

  const DisplayComponent = () => {
    switch (pageIndex) {
      case 0:
        return <New pinCode={pinCode} setPinCode={setPinCode} pageIndex={pageIndex} setPageIndex={setPageIndex} />;
      case 1:
        return (
          <Confirm
            pinCode={pinCode}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            patchPincodeToktokWallet={proceed}
          />
        );
      default:
        return null;
    }
  };

  return (
    <CheckIdleState>
      <AlertOverlay visible={loading} />
      <LeavePromptModal
        visible={LeaveModalvisible}
        setVisible={setLeaveModalVisible}
        onConfirm={() => navigation.pop(2)}
      />
      {/* <Separator /> */}
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
