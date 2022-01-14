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
} from 'react-native';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';
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

const {width, height} = Dimensions.get('window');

const BOX_WIDTH = (width - 140) / 6;

const {COLOR, FONT_SIZE, FONT_FAMILY} = Constants;

const NumberBox = ({onPress, value}) => (
  <TouchableHighlight onPress={onPress} underlayColor={COLOR.YELLOW_UNDERLAY} style={styles.numberBox}>
    <View style={styles.inputView}>
      <Text style={{fontSize: FONT_SIZE.XL + 5}}>{value ? '*' : ''}</Text>
    </View>
  </TouchableHighlight>
);

const NumberBoxes = ({verificationCode, onNumPress}) => {
  const numberBoxes = [];
  var i;
  for (i = 0; i <= 5; i++) {
    numberBoxes.push(<NumberBox onPress={onNumPress} value={verificationCode[i]} />);
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

  const [postDelivery, {loading: postDeliveryLoading}] = useMutation(POST_DELIVERY, {
    onError: error => {
      onErrorAlert({alert: AlertHook, error});
    },
    onCompleted: () => {
      try {
        setBooked(true);
      } catch (error) {}
    },
  });

  const [postDeliveryRequestTakeMoney, {data, error, loading}] = useMutation(POST_DELIVERY_REQUEST_TAKE_MONEY, {
    onCompleted: data => {
      setTimeout(() => {
        inputRef.current.focus();
      }, 1);
    },
  });

  const [postDeliveryVerifyRequestTakeMoney, verifyState] = useMutation(POST_DELIVERY_VERIFY_REQUEST_TAKE_MONEY, {
    onError: error => {
      onErrorAlert({alert: AlertHook, error});
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
      <AlertOverlay visible={verifyState.loading || postDeliveryLoading} />
      <LoadingSuccessOverlay visible={booked} done={booked} onOkay={onSuccessOkay} />
      <Text style={styles.validator}>Enter {data.postDeliveryRequestTakeMoney.validator}</Text>
      <Text style={styles.instruction}>
        Please enter your {data.postDeliveryRequestTakeMoney.validator} below to proceed with your toktokwallet
        transaction.
      </Text>
      <View style={{width: '100%'}}>
        <NumberBoxes verificationCode={verificationCode} onNumPress={onNumPress} />
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
      <View style={styles.flex} />
      <View style={{margin: 20, height: 50, width: '100%'}}>
        <ThrottledOpacity
          style={isButtonEnabled ? styles.button : styles.buttonDisabled}
          disabled={!isButtonEnabled}
          onPress={onSubmit}>
          <Text style={styles.buttonText}>Confirm</Text>
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
});
