import React, {useEffect} from 'react';
import {ImageBackground, StyleSheet, ActivityIndicator} from 'react-native';

import {COLOR} from 'res/variables';
import {splash} from 'toktokfood/assets/images';

import {useNavigation, CommonActions} from '@react-navigation/native';

const TokTokFoodSplashScreen = () => {
  const navigation = useNavigation();

  const showHomPage = () => {
    navigation.replace('ToktokFoodLanding');
  };

  useEffect(() => {
    setTimeout(() => {
      showHomPage();
    }, 1500);
  }, []);

  return (
    <>
      <ImageBackground style={styles.container} source={splash} resizeMode="cover">
        <ActivityIndicator style={{marginBottom: 30}} size="large" color={COLOR.WHITE} />
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default TokTokFoodSplashScreen;
