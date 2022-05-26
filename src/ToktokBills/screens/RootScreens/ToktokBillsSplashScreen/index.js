import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, FlatList, Dimensions, Image, RefreshControl} from 'react-native';
import {moderateScale, getStatusbarHeight, checkViewOnboarding} from 'toktokbills/helper';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {toktokbills_sq_logo} from 'toktokbills/assets';
import {verticalScale} from 'toktokbills/helper';

//SELF IMPORTS
import {HeaderBack, HeaderTitle, LoadingIndicator, Separator, SomethingWentWrong} from 'toktokbills/components';
import {SplashHome} from 'src/ToktokLoad/components';

//IMAGE, FONT & COLOR
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const ToktokBillsSplashScreen = ({navigation, route}) => {
  navigation.setOptions({
    headerShown: false,
  });

  const {person} = useSelector(state => state.session.user);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (person?.id && !showSplash) {
      showOnboarding();
    }
  }, [person, showSplash]);

  const showOnboarding = async () => {
    navigation.replace('ToktokBillsHome');
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={toktokbills_sq_logo} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBFAE3',
  },
  logo: {
    height: width * 0.4,
    width: width * 0.4,
    marginTop: 20,
  },
});
