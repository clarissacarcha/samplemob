import React, { useContext, useEffect, useState } from 'react';
import {
  Image, Keyboard, KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet, View
} from 'react-native';
import { COLORS } from 'res/constants';
import { rider1 } from 'toktokfood/assets/images';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import Separator from 'toktokfood/components/Separator';
import {
  verticalScale
} from 'toktokfood/helper/scale';
// Components
import {
  RateComments, RatingAction, RiderInformation, SubmitButton,
  VerifyContext,
  VerifyContextProvider, WalletActions
} from './components';

const MainComponent = () => {
  const [viewHeight, setViewHeight] = useState(100);
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const {hasToktokWallet} = useContext(VerifyContext);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'position' : null} style={styles.container}>
      <View
        onLayout={(e) => {
          setViewHeight(e.nativeEvent.layout.height);
        }}>
        <HeaderImageBackground>
          <HeaderTitle forRating={true} />
          <Image source={rider1} style={styles.riderAvatar} />
        </HeaderImageBackground>
      </View>
      <ScrollView
        style={{marginTop: viewHeight / 2 - 10}}
        contentContainerStyle={{
          paddingBottom: Platform.OS == 'ios' ? viewHeight : keyboardStatus ? verticalScale(50) : 0,
        }}>
        <RiderInformation />
        <Separator />
        <RatingAction />
        <Separator />
        {hasToktokWallet && (
          <>
            <WalletActions />
            <Separator />
          </>
        )}
        <RateComments />
        <SubmitButton />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const ToktokRiderRating = ({navigation}) => {
  return (
    <VerifyContextProvider>
      <MainComponent navigation={navigation} />
    </VerifyContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  riderAvatar: {
    width: 138,
    height: 138,
    marginTop: 10,
    borderRadius: 100,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
});

export default ToktokRiderRating;