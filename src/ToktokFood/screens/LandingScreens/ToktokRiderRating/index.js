import React, {useState, useEffect} from 'react';
import {Rating} from 'react-native-ratings';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

import {COLOR} from 'res/variables';
import {COLORS, FONTS, FONT_SIZE, BUTTON_HEIGHT} from 'res/constants';
import {
  verticalScale,
  moderateScale,
  scale,
  getDeviceWidth,
  getDeviceHeight,
  getStatusbarHeight,
} from 'toktokfood/helper/scale';
import InputScrollView from 'react-native-input-scroll-view';

// Components
import {RiderInformation, RatingAction, WalletActions, RateComments, SubmitButton} from './components';
import Separator from 'toktokfood/components/Separator';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {headerBg, rider1} from 'toktokfood/assets/images';

const ToktokRiderRating = () => {
  const [viewHeight, setViewHeight] = useState(100);
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);

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
        <WalletActions />
        <Separator />
        <RateComments />
        <SubmitButton />
      </ScrollView>
    </KeyboardAvoidingView>
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
