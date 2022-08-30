import React, {useState, useContext, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableHighlight,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {useFocusEffect} from '@react-navigation/native';
import {Separator, QuestionModal, FlagSecureScreen, HeaderTitleRevamp} from 'toktokwallet/components';
import RNFS from 'react-native-fs';
import CONSTANTS from 'common/res/constants';
import {VerifyContextProvider, VerifyContext} from './Components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const HeaderBackClose = ({currentIndex, setCurrentIndex, closeScreen}) => {
  useFocusEffect(() => {
    const backAction = () => {
      closeScreen();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  });

  return (
    <TouchableHighlight onPress={closeScreen} underlayColor={'white'} style={styles.button}>
      <FIcon5 name={'chevron-left'} size={15} color={COLOR.ORANGE} />
    </TouchableHighlight>
  );
};

const MainSetupComponent = () => {
  const {currentIndex, setCurrentIndex, stepsScreens, person, birthInfo, incomeInfo} = useContext(VerifyContext);
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  navigation.setOptions({
    headerLeft: () => (
      <HeaderBackClose
        closeScreen={() => {
          if (
            person.middleName ||
            !person.hasMiddleName ||
            person.gender ||
            birthInfo.birthdate ||
            birthInfo.birthPlace ||
            incomeInfo.source ||
            incomeInfo.occupation
          ) {
            setVisible(true);
          } else {
            navigation.goBack();
          }
        }}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    ),
    headerTitle: () => <HeaderTitleRevamp label={'Create Account'} />,
  });

  return (
    <>
      <QuestionModal
        visible={visible}
        setVisible={setVisible}
        onPressYes={() => {
          if (RNFS.CachesDirectoryPath) RNFS.unlink(RNFS.CachesDirectoryPath);
          navigation.goBack();
        }}
        title="Unsaved Changes"
        message="You are about to close form with unsaved changes. Would you like to proceed?"
      />
      {/* visible={visible}
        setVisible={setVisible}
        onPressNo={() => navigation.navigate('ToktokBillsHome')}
        onPressYes={onPressFavorite} */}
      {/* <Separator /> */}
      <View style={styles.container}>
        <View style={styles.progressBar}>
          {stepsScreens.map((item, index) => {
            if (index < stepsScreens.length)
              return (
                <View
                  style={[styles.progressBarItem, {backgroundColor: index <= currentIndex ? '#F6841F' : 'transparent'}]}
                />
              );
          })}
        </View>
        {stepsScreens[currentIndex]}
      </View>
    </>
  );
};

export const ToktokWalletVerification = () => {
  return (
    <FlagSecureScreen>
      <VerifyContextProvider>
        <MainSetupComponent />
      </VerifyContextProvider>
    </FlagSecureScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  progressBar: {
    height: 10,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFF1D2',
  },
  progressBarItem: {
    flex: 1,
  },
  button: {
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },
});
