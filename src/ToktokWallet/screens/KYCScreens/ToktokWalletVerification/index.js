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
import {Separator, LeavePromptModal, FlagSecureScreen, HeaderTitleRevamp} from 'toktokwallet/components';
import RNFS from 'react-native-fs';
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS
import {
  Confirm,
  VerifyAddress,
  VerifyContextProvider,
  VerifyContext,
  VerifyFullname,
  VerifyID,
  VerifySelfie,
  VerifySelfieWithID,
  VerifySourceOfIncome,
} from './Components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const HeaderBackClose = ({currentIndex, setCurrentIndex, setPromptVisible}) => {
  const closeScreen = () => {
    if (currentIndex == 0) {
      PromptQuestionCloseMessage();
    } else {
      setCurrentIndex(oldstate => oldstate - 1);
    }
  };

  const PromptQuestionCloseMessage = () => {
    setPromptVisible(true);
  };

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
  const {currentIndex, setCurrentIndex} = useContext(VerifyContext);
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  navigation.setOptions({
    headerLeft: () => (
      <HeaderBackClose
        setPromptVisible={value => setVisible(true)}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    ),
    headerTitle: () => <HeaderTitleRevamp label={'Create Account'} />,
  });

  const [screenSlides, setScreenSlides] = useState([
    'Fullname',
    'Address',
    'IDPic',
    'SelfiePic',
    'SelfiePicWithID',
    'Confirm',
  ]);

  const cancelSetup = () => {
    console.log('Cancelling');
    setVisible(true);
  };

  const DisplayComponents = () => {
    switch (4) {
      case 0:
        return <VerifyFullname />;
      case 1:
        return <VerifyAddress />;
      case 2:
        return <VerifyID />;
      case 3:
        return <VerifySelfie />;
      case 4:
        return <VerifySelfieWithID />;
      default:
        return <Confirm />;
    }
  };

  return (
    <>
      <LeavePromptModal
        visible={visible}
        setVisible={setVisible}
        onConfirm={() => {
          if (RNFS.CachesDirectoryPath) RNFS.unlink(RNFS.CachesDirectoryPath);
          navigation.goBack();
        }}
      />
      {/* <Separator /> */}
      <View style={styles.container}>
        <View style={styles.progressBar}>
          {screenSlides.map((item, index) => {
            if (index < screenSlides.length)
              return (
                <View
                  style={[styles.progressBarItem, {backgroundColor: index <= currentIndex ? '#F6841F' : 'transparent'}]}
                />
              );
          })}
        </View>

        {DisplayComponents()}
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
