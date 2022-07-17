import React, {useState, useRef, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  Image,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import EIcon from 'react-native-vector-icons/EvilIcons';
import {VerifyContext} from '../VerifyContextProvider';
import {useNavigation} from '@react-navigation/native';
import ImageCropper from 'react-native-simple-image-cropper';
import CONSTANTS from 'common/res/constants';
import {throttle} from 'lodash';

//FONT & IMAGES
import circleCheck from 'toktokwallet/assets/icons/circleCheck.png';

//COMPONENTS
import {PreviousNextButton} from 'toktokwallet/components';

//HELPER
import {moderateScale} from 'toktokwallet/helper';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');
const CROP_AREA_WIDTH = width * 0.85;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH;
const ratio = Math.min(width / CROP_AREA_WIDTH, height / CROP_AREA_HEIGHT);

const ViewPrivacyPolicy = () => {
  return Linking.openURL('https://toktok.ph/privacy-policy');
};

const MainComponent = ({children, onPress, onPressBack}) => {
  return (
    <>
      <ScrollView>
        <TouchableOpacity onPress={ViewPrivacyPolicy} style={styles.policyView}>
          <View>
            <Image
              style={styles.policyIcon}
              source={require('toktokwallet/assets/icons/walletVerify.png')}
              resizeMode="contain"
            />
          </View>
          <View style={styles.privacyPolicyContainer}>
            <Text style={styles.detailsText}>
              All your details are protected in accordance with our{' '}
              <Text style={styles.privacyPolicy}>Privacy Policy.</Text>
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.title}>Take a Selfie</Text>
          <Text style={styles.titleDescription}>Take a photo to verify your identity.</Text>
          <View style={styles.mainInput}>
            <View style={{marginTop: 20, flex: 1}}>
              <Text style={styles.selfieLabel}>Take a Selfie</Text>
              {children}
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.benefitsText}>Reminders</Text>
              <View style={styles.benefitsContainer}>
                <View style={styles.benefitsListContainer}>
                  <Image style={styles.checkIcon} source={circleCheck} />
                  <Text style={styles.benefitsListText}>Position your face within the frame</Text>
                </View>
                <View style={styles.benefitsListContainer}>
                  <Image style={styles.checkIcon} source={circleCheck} />
                  <Text style={styles.benefitsListText}>Don’t wear anything covering your face</Text>
                </View>
                <View style={styles.benefitsListContainer}>
                  <Image style={styles.checkIcon} source={circleCheck} />
                  <Text style={styles.benefitsListText}>Avoid blurry, grainy or shadows in the photo</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <PreviousNextButton
        label="Previous"
        labelTwo="Next"
        onPressNext={onPress}
        onPressPrevious={onPressBack}
        hasShadow
        isPrevious
      />
    </>
  );
};

export const VerifySelfie = () => {
  const VerifyUserData = useContext(VerifyContext);
  const [required, setRequired] = useState(false);
  const {
    setCacheImagesList,
    setCurrentIndex,
    currentIndex,
    selfieImage,
    setSelfieImage,
    setTempSelfieImage,
    tempSelfieImage,
  } = VerifyUserData;
  const [cropperParams, setCropperParams] = useState({});
  const navigation = useNavigation();
  const cropSize = {
    // width: Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH + 100,
    // height: Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT + 100,
    width: CROP_AREA_WIDTH,
    height: CROP_AREA_HEIGHT,
  };
  const cropAreaSize = {
    // width: Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 20,
    // height: Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100,
    width: CROP_AREA_WIDTH,
    height: CROP_AREA_HEIGHT,
  };

  const setImage = data => {
    setCacheImagesList(state => {
      return [...state, data.uri];
    });
    setTempSelfieImage(data);
  };
  const Back = () => {
    setCurrentIndex(oldstate => oldstate - 1);
  };

  const Proceed = async () => {
    if (tempSelfieImage == null) {
      setRequired(true);
    } else {
      setSelfieImage(tempSelfieImage);
      setCurrentIndex(oldval => oldval + 1);
    }
  };

  const onPressTakeAPhoto = throttle(
    () => {
      navigation.push('ToktokWalletSelfieImageCamera', {setImage});
    },
    1000,
    {trailing: false},
  );

  if (tempSelfieImage) {
    return (
      <MainComponent onPress={Proceed} onPressBack={Back}>
        <View style={styles.PreviewImage}>
          <Image
            resizeMode="cover"
            style={{
              height: CROP_AREA_WIDTH - 130,
              width: CROP_AREA_HEIGHT - 130,
              borderRadius: 5,
            }}
            source={{uri: tempSelfieImage.uri}}
          />
          <TouchableOpacity onPress={onPressTakeAPhoto} style={styles.changePhoto}>
            <EIcon name="camera" color={COLOR.ORANGE} size={25} />
            <Text
              style={{
                textAlign: 'center',
                color: COLOR.WHITE,
                fontFamily: FONT.REGULAR,
                fontSize: FONT_SIZE.S,
              }}>
              Change Photo
            </Text>
          </TouchableOpacity>
          <View style={styles.overlay} />
        </View>
      </MainComponent>
    );
  }

  return (
    <>
      <MainComponent onPress={Proceed} onPressBack={Back}>
        <TouchableOpacity onPress={onPressTakeAPhoto} style={[styles.selfieBtn, required && {borderColor: COLOR.RED}]}>
          <EIcon name="camera" color={COLOR.ORANGE} size={25} />
          <Text style={{marginBottom: 5, fontSize: FONT_SIZE.S}}>Take a photo</Text>
        </TouchableOpacity>
        {required && <Text style={styles.requiredText}>Photo is required</Text>}
      </MainComponent>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flex: 1,
  },
  mainInput: {
    flex: 1,
    padding: moderateScale(30),
  },
  title: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    marginBottom: moderateScale(5),
  },
  titleDescription: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    color: '#929191',
  },
  proceedBtn: {
    height: 70,
    width: '100%',
    padding: 16,
    marginBottom: 16,
  },
  policyView: {
    flexDirection: 'row',
    backgroundColor: '#FFFCF4',
    padding: 16,
    alignItems: 'center',
  },
  policyIcon: {
    height: 21,
    width: 21,
    alignSelf: 'center',
  },
  requiredText: {
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
    color: COLOR.RED,
    marginTop: moderateScale(-5),
  },
  privacyPolicyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(20),
  },
  detailsText: {
    marginHorizontal: moderateScale(10),
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.REGULAR,
    color: COLOR.ORANGE,
  },
  privacyPolicy: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.SEMI_BOLD,
    textDecorationLine: 'underline',
  },
  benefitsContainer: {
    marginTop: 20,
    justifyContent: 'center',
  },
  benefitsListContainer: {
    flexDirection: 'row',
    marginVertical: 3,
    alignItems: 'center',
  },
  benefitsListText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  benefitsText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
    marginBottom: moderateScale(5),
    marginTop: moderateScale(48),
  },
  checkIcon: {
    resizeMode: 'contain',
    width: moderateScale(13),
    height: moderateScale(13),
    paddingHorizontal: moderateScale(14),
  },
  input: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'silver',
    marginTop: 20,
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inCapture: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  selfieLabel: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    alignSelf: 'center',
  },
  selfieBtn: {
    width: CROP_AREA_WIDTH - 130,
    height: CROP_AREA_HEIGHT - 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFAF6',
    alignSelf: 'center',
    marginVertical: moderateScale(10),
    borderStyle: 'dashed',
    borderColor: COLOR.ORANGE,
    borderWidth: 1,
    borderRadius: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  PreviewImage: {
    height: CROP_AREA_HEIGHT - 130 + 3,
    width: CROP_AREA_WIDTH - 130 + 3,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 7,
    borderStyle: 'dashed',
    borderColor: COLOR.ORANGE,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
  changePhoto: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 2,
  },
  overlay: {
    backgroundColor: 'black',
    opacity: 0.3,
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
});
