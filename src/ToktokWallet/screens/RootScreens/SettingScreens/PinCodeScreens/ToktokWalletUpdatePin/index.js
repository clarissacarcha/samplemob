import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableHighlight, BackHandler, Platform, ImageBackground} from 'react-native';
import {AlertOverlay} from 'src/components';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {PATCH_PIN_CODE} from 'toktokwallet/graphql';
import {useMutation} from '@apollo/react-hooks';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {LeavePromptModal, CheckIdleState} from 'toktokwallet/components';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';
import CONSTANTS from 'common/res/constants';
import {backgrounds} from 'toktokwallet/assets';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {usePrompt} from 'src/hooks';
import { getUniqueId , getBrand, getModel } from 'react-native-device-info';

//SELF IMPORTS
import {ConfirmPin, NewPin, SuccessModal} from './Components';

const {COLOR} = CONSTANTS;

const HeaderBack = ({pageIndex, setPageIndex, navigation}) => {
  const backAction = () => {
    closeScreen();
    return true;
  };

  const closeScreen = () => {
    pageIndex == 0 ? navigation.pop(1) : setPageIndex(oldstate => oldstate - 1);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [pageIndex]);

  return (
    <TouchableHighlight onPress={closeScreen} underlayColor={'white'} style={styles.button}>
      <View style={styles.iconBox}>
        <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={16} />
      </View>
    </TouchableHighlight>
  );
};

export const ToktokWalletUpdatePin = ({navigation, route}) => {
  navigation.setOptions({
    headerShown: false,
  });

  const {otp, event} = route.params;
  const prompt = usePrompt();

  const [pageIndex, setPageIndex] = useState(0);
  const [pinCode, setPinCode] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [LeaveModalvisible, setLeaveModalVisible] = useState(false);
  const alert = useAlert();

  const [patchPinCode, {data, error, loading}] = useMutation(PATCH_PIN_CODE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({patchPinCode}) => {
      // setSuccessModalVisible(true);
      prompt({
        type: 'success',
        title: 'TPIN Changed',
        message: 'You have successfully changed your TPIN. Please do not share this with anyone.',
        event: 'TOKTOKBILLSLOAD',
        onPress: () => {
          if (event) {
            navigation.pop(2);
          } else {
            navigation.navigate('ToktokWalletHomePage');
            navigation.replace('ToktokWalletHomePage');
          }
        },
      });
    },
    onError: error => {
      onErrorAlert({alert, error, navigation});
    },
  });

  const proceed = async () => {
    patchPinCode({
      variables: {
        input: {
          pinCode: pinCode,
          otp: otp,
          deviceType: Platform.OS === 'ios' ? 'IOS' : 'Android',
          deviceName: `${await getBrand()} ${await getModel()}`,
          deviceId: getUniqueId(),
        },
      },
    });
  };

  const DisplayComponent = () => {
    switch (pageIndex) {
      case 0:
        return <NewPin pinCode={pinCode} setPinCode={setPinCode} pageIndex={pageIndex} setPageIndex={setPageIndex} />;
      case 1:
        return (
          <ConfirmPin
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
      <ImageBackground source={backgrounds.gradient_tpin} style={styles.container}>
        <View style={{marginTop: Platform.OS === 'ios' ? moderateScale(10) : getStatusbarHeight + moderateScale(10)}}>
          <HeaderBack pageIndex={pageIndex} setPageIndex={setPageIndex} navigation={navigation} />
        </View>
        <LeavePromptModal
          visible={LeaveModalvisible}
          setVisible={setLeaveModalVisible}
          onConfirm={() => navigation.pop(2)}
        />
        <SuccessModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} event={event} />
        <View style={{flex: 1}}>{DisplayComponent()}</View>
      </ImageBackground>
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
