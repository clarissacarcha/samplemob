import React, {useState, useRef, useEffect} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
} from 'react-native';
import {HeaderBack, HeaderTitle, AlertOverlay, AlertModal} from '../../../../../components';
import {ThrottledOpacity} from '../../../../../common/components/ThrottledOpacity';
import {
  POST_DELIVERY_REQUEST_TAKE_MONEY,
  POST_DELIVERY_VERIFY_REQUEST_TAKE_MONEY,
  POST_DELIVERY,
} from '../../../../../graphql';
import {onErrorAlert} from '../../../../../util/ErrorUtility';
import {useAlert} from '../../../../../hooks';

import Constants from '../../../../../common/res/constants';

import LoadingSuccessOverlay from '../DeliverySummary/LoadingSuccessOverlay';

import ModalImage from '../../../../../assets/toktokwallet-assets/error.png';

const {width, height} = Dimensions.get('window');

const BOX_WIDTH = (width - 140) / 6;

const modalWidth = width - 120;

const {COLOR, FONT_SIZE, FONT_FAMILY} = Constants;

const NumberBox = ({onPress, value, isPinSecured}) => (
  <TouchableHighlight onPress={onPress} underlayColor={COLOR.YELLOW_UNDERLAY} style={styles.numberBox}>
    <View style={styles.inputView}>
      {isPinSecured ? (
        <Text style={{fontSize: FONT_SIZE.L}}>{value ? '●' : ''}</Text>
      ) : (
        <Text style={{fontSize: FONT_SIZE.L}}>{value}</Text>
      )}
    </View>
  </TouchableHighlight>
);

const NumberBoxes = ({verificationCode, onNumPress, isPinSecured}) => {
  const numberBoxes = [];
  var i;
  for (i = 0; i <= 5; i++) {
    numberBoxes.push(<NumberBox onPress={onNumPress} value={verificationCode[i]} isPinSecured={isPinSecured} />);
  }
  return <View style={styles.numberBoxes}>{numberBoxes}</View>;
};

export const DeliveryPaymentPin = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['', '']} />,
  });

  const AlertHook = useAlert();
  const {input, setRequestTakeMoneyData} = route.params;
  const inputRef = useRef();
  const [verificationCode, setVerificationCode] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [booked, setBooked] = useState(false);
  const [isPinSecured, setIsPinSecured] = useState(true);
  const [pinError, setPinError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [postDelivery, {loading: postDeliveryLoading}] = useMutation(POST_DELIVERY, {
    onError: error => {
      onErrorAlert({alert: AlertHook, error, navigation: navigation});
    },
    onCompleted: () => {
      setBooked(true);
    },
  });

  const [postDeliveryRequestTakeMoney, {data, error, loading}] = useMutation(POST_DELIVERY_REQUEST_TAKE_MONEY, {
    onError: err => {
      console.log(JSON.stringify({err}, null, 4));
      if (err.graphQLErrors?.[0].message.includes('attempts left.')) {
        setPinError(err.graphQLErrors[0].message);
      } else if (err.graphQLErrors?.[0].message.includes('You have reached the maximum')) {
        setModalMessage(err.graphQLErrors?.[0].message);
        setIsModalVisible(true);
      } else {
        onErrorAlert({alert: AlertHook, error: err});
      }
    },
    onCompleted: data => {
      setTimeout(() => {
        inputRef.current.focus();
      }, 1);
    },
  });

  const onModalDismiss = () => {
    setIsModalVisible(false);
    navigation.pop(2);
  };

  const [postDeliveryVerifyRequestTakeMoney, verifyState] = useMutation(POST_DELIVERY_VERIFY_REQUEST_TAKE_MONEY, {
    onError: err => {
      console.log(JSON.stringify({err}, null, 4));
      if (err.graphQLErrors?.[0].message.includes('attempts left.')) {
        setPinError(err.graphQLErrors[0].message);
      } else if (err.graphQLErrors?.[0].message.includes('You have reached the maximum')) {
        setModalMessage(err.graphQLErrors?.[0].message);
        setIsModalVisible(true);
      } else {
        onErrorAlert({alert: AlertHook, error: err});
      }
    },
    onCompleted: () => {
      // setRequestTakeMoneyData({
      //   requestTakeMoneyId: data.postDeliveryRequestTakeMoney.requestTakeMoneyId,
      //   validator: data.postDeliveryRequestTakeMoney.validator,
      //   verificationCode,
      // });

      const newInput = {...input};

      newInput.requestTakeMoneyId = data.postDeliveryRequestTakeMoney.requestTakeMoneyId;
      newInput.validator = data.postDeliveryRequestTakeMoney.validator;
      newInput.tpin = data.postDeliveryRequestTakeMoney.validator === 'TPIN' ? verificationCode : '';
      newInput.otp = data.postDeliveryRequestTakeMoney.validator === 'OTP' ? verificationCode : '';

      delete newInput.price;

      postDelivery({
        variables: {
          input: newInput,
        },
      });
    },
  });

  useEffect(() => {
    postDeliveryRequestTakeMoney({
      variables: {
        input: {
          amount: parseInt(input.price),
        },
      },
    });
  }, []);

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onSubmit = () => {
    if (verificationCode.length >= 6) {
      setPinError(null);
      postDeliveryVerifyRequestTakeMoney({
        variables: {
          input: {
            requestTakeMoneyId: data.postDeliveryRequestTakeMoney.requestTakeMoneyId,
            tpin: data.postDeliveryRequestTakeMoney.validator === 'TPIN' ? verificationCode : '',
            otp: data.postDeliveryRequestTakeMoney.validator === 'OTP' ? verificationCode : '',
          },
        },
      });
    }
  };

  const onForgotTpin = () => {
    navigation.push('ToktokWalletRecoveryMethods', {type: 'TPIN', event: 'enterprise'});
  };

  const onSuccessOkay = () => {
    setBooked(false);
    navigation.replace('RootDrawer', {
      screen: 'AuthenticatedStack',
      params: {
        screen: 'ConsumerLanding',
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size={24} color={COLOR.YELLOW} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loading}>
        <Modal visible={isModalVisible} transparent={true}>
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0,0,0,0.75)'}}>
            <View
              style={{
                width: modalWidth,
                borderRadius: 5,
                backgroundColor: 'white',
                padding: 20,
                alignItems: 'center',
              }}>
              <Image style={{height: 80, width: 80, marginBottom: 10}} source={ModalImage} />
              <Text style={{marginVertical: 10, fontFamily: FONT_FAMILY.BOLD, fontSize: FONT_SIZE.XL}}>
                Max Attempt Reached
              </Text>
              <Text>{modalMessage}</Text>
              <TouchableOpacity
                onPress={onModalDismiss}
                style={{
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  width: 100,
                  backgroundColor: COLOR.YELLOW,
                  borderRadius: 5,
                }}>
                <Text style={{fontFamily: FONT_FAMILY.BOLD}}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ActivityIndicator size={24} color={COLOR.YELLOW} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Modal visible={isModalVisible} transparent={true}>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0,0,0,0.75)'}}>
          <View
            style={{
              width: modalWidth,
              borderRadius: 5,
              backgroundColor: 'white',
              padding: 20,
              alignItems: 'center',
            }}>
            <Image style={{height: 80, width: 80, marginBottom: 10}} source={ModalImage} />
            <Text style={{marginVertical: 10, fontFamily: FONT_FAMILY.BOLD, fontSize: FONT_SIZE.XL}}>
              Max Attempt Reached
            </Text>
            <Text>{modalMessage}</Text>
            <TouchableOpacity
              onPress={onModalDismiss}
              style={{
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                width: 100,
                backgroundColor: COLOR.YELLOW,
                borderRadius: 5,
              }}>
              <Text style={{fontFamily: FONT_FAMILY.BOLD}}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AlertOverlay visible={verifyState.loading || postDeliveryLoading} />
      <LoadingSuccessOverlay visible={booked} done={booked} onOkay={onSuccessOkay} />
      <Text style={styles.validator}>Enter {data.postDeliveryRequestTakeMoney.validator}</Text>
      <View style={{width: '100%'}}>
        <NumberBoxes verificationCode={verificationCode} onNumPress={onNumPress} isPinSecured={isPinSecured} />
        <TextInput
          caretHidden
          value={verificationCode}
          ref={inputRef}
          style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
          keyboardType="number-pad"
          returnKeyType="done"
          onChangeText={value => {
            if (value.length <= 6) {
              setVerificationCode(value);
              setIsButtonEnabled(false);
            }
            if (value.length === 6) {
              setIsButtonEnabled(true);
            }
          }}
          onSubmitEditing={onSubmit}
        />
      </View>
      {pinError && <Text style={{fontSize: FONT_SIZE.S, color: COLOR.RED, margin: 20}}>{pinError}</Text>}
      <TouchableOpacity onPress={() => setIsPinSecured(!isPinSecured)}>
        <Text style={styles.wordButton}>Show TPIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onForgotTpin}>
        <Text style={styles.wordButton}>Forgot TPIN?</Text>
      </TouchableOpacity>
      <View style={styles.flex} />
      <View style={{margin: 20, height: 50, width: '100%'}}>
        <ThrottledOpacity
          style={isButtonEnabled ? styles.button : styles.buttonDisabled}
          disabled={!isButtonEnabled}
          onPress={onSubmit}>
          <Text style={styles.buttonText}>Proceed</Text>
        </ThrottledOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loading: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  button: {
    height: 50,
    backgroundColor: COLOR.YELLOW,
    marginHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    height: 50,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONT_SIZE.L,
    color: COLOR.WHITE,
  },
  validator: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT_FAMILY.BOLD,
    marginVertical: 50,
  },
  instruction: {
    marginHorizontal: 50,
    textAlign: 'center',
    marginBottom: 25,
  },
  numberBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  numberBox: {
    borderRadius: 10,
    width: BOX_WIDTH,
    height: BOX_WIDTH + 5,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLOR.YELLOW,
  },
  wordButton: {
    color: COLOR.ORANGE,
    marginVertical: 20,
  },
});
