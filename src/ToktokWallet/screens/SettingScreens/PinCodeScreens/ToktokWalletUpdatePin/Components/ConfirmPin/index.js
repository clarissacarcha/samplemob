import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import {DisabledButton, NumberBoxes, BuildingBottom, OrangeButton} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {backgrounds} from 'toktokwallet/assets';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import tokwaLogo from 'toktokwallet/assets/images/tokwa_splash.png';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const ConfirmPin = ({pinCode, pageIndex, setPageIndex, patchPincodeToktokWallet}) => {
  const inputRef = useRef();
  const [showPin, setShowPin] = useState(false);
  const [confirmpinCode, setConfirmPinCode] = useState('');
  const [message, setMessage] = useState('');

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onSubmit = () => {
    if (confirmpinCode.length < 6) return;
    setPageIndex(oldstate => oldstate + 1);
  };

  useEffect(() => {
    if (confirmpinCode.length == 6) {
      if (pinCode != confirmpinCode) {
        return setMessage('TPIN code does not match! Please try again');
      }
      return patchPincodeToktokWallet();
    } else {
      return setMessage('');
    }
  }, [confirmpinCode]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image style={styles.logo} source={tokwaLogo} />
        </View>
        <Text style={{fontSize: FONT_SIZE.L + 1, fontFamily: FONT.BOLD, marginTop: 30, alignSelf: 'center'}}>
          Confirm New TPIN
        </Text>
        <Text style={{marginHorizontal: 30, textAlign: 'center', marginTop: 10}}>
          Ka-toktok, do not forget your TPIN. Keep it to yourself and do not share this with anyone.
        </Text>
        <View style={{position: 'relative', marginTop: 30}}>
          <NumberBoxes pinCode={confirmpinCode} onNumPress={onNumPress} showPin={showPin} />
          <TextInput
            autoFocus={true}
            caretHidden
            value={confirmpinCode}
            ref={inputRef}
            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
            keyboardType="number-pad"
            returnKeyType="done"
            onChangeText={value => {
              if (value.length <= 6) {
                const num = value.replace(/[^0-9]/g, '');
                setConfirmPinCode(num);
              }
            }}
            onSubmitEditing={onSubmit}
          />
          {message != '' && (
            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M, color: 'red', alignSelf: 'center'}}>
              {message}
            </Text>
          )}
          <TouchableOpacity
            style={{marginTop: height * 0.07, alignItems: 'center'}}
            onPress={() => setShowPin(!showPin)}>
            <Text style={{color: COLOR.ORANGE, fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD}}>
              {showPin ? 'Hide TPIN' : 'Show TPIN'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{padding: 16}}>
        {confirmpinCode.length < 6 ? (
          <DisabledButton label="Confirm" />
        ) : (
          <OrangeButton label="Confirm" onPress={onSubmit} />
        )}
      </View>
      {/* <TouchableOpacity
                disabled={pinCode.length < 6}
                onPress={onSubmit}
                style={{alignItems: "center",height: 40,backgroundColor: pinCode.length < 6 ? "gray" : DARK,margin: 20,justifyContent: "center",borderRadius: 10,}}
            >
                    <Text style={{color: pinCode.length < 6 ? "white" : COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Next</Text>
            </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    // alignItems: "center",
    padding: 16,
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 25,
    width: 30,
  },
  logo: {
    resizeMode: 'contain',
    width: moderateScale(72),
    height: moderateScale(88),
  },
});
