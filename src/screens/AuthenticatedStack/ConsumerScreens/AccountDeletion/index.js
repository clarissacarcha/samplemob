import React, {useState} from 'react';
import {Alert, Image, ImageBackground, Text, View} from 'react-native';
import {AlertOverlay, HeaderBack, HeaderTitle} from '../../../../components';
import GradientBackground from '../../../../assets/toktokgo/toktokgo-gradient-background.png';
import ToktokLogo from '../../../../assets/images/ToktokLogo.png';
import {ThrottledOpacity} from '../../../../components_section';
import {COLOR} from '../../../../res/variables';
import CONSTANTS from '../../../../common/res/constants';
import {EnterOTPScreen, WithoutTokwaMessage} from './sections';
const AccountDeletion = ({navigation}) => {
  const [accountDeletionStep, setAccountDeletionStep] = useState(0);
  const [loading, setLoading] = useState(false);
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Account', 'Deletion']} />,
  });

  const onPressConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setAccountDeletionStep(1);
      setLoading(false);
    }, 2000);
  };

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      //   setAccountDeletionStep(1);
      Alert.alert('', 'Something went wrong.');
      setLoading(false);
    }, 2000);
  };

  const onPressCancelAccountDeletion = () => {
    setLoading(true);
    setTimeout(() => {
      setAccountDeletionStep(0);
      setLoading(false);
    }, 2000);
  };

  return (
    <ImageBackground style={{flex: 1}} source={GradientBackground}>
      <AlertOverlay visible={loading} />
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image source={ToktokLogo} resizeMode={'contain'} style={{height: 103, width: 123, marginTop: 50}} />
        <View style={{marginVertical: 40}}>
          {accountDeletionStep === 0 ? <WithoutTokwaMessage /> : <></>}
          {accountDeletionStep === 1 ? <EnterOTPScreen onSubmit={onSubmit} /> : <></>}
        </View>
        <View style={{position: 'absolute', bottom: 11, width: '100%'}}>
          <View style={{alignSelf: 'stretch', marginHorizontal: 80}}>
            {accountDeletionStep === 0 ? (
              <ThrottledOpacity
                onPress={onPressConfirm}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: COLOR.ORANGE,
                  paddingVertical: 11,
                }}>
                <Text
                  style={{
                    color: COLOR.WHITE,
                    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                  }}>
                  Continue to Delete Account
                </Text>
              </ThrottledOpacity>
            ) : (
              <></>
            )}
            <ThrottledOpacity
              onPress={onPressCancelAccountDeletion}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 11,
              }}>
              <Text
                style={{
                  color: CONSTANTS.COLOR.ORANGE,
                  fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                }}>
                Cancel Account Deletion
              </Text>
            </ThrottledOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default AccountDeletion;
