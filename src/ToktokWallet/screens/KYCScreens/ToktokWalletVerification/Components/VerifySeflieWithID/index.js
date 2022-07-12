import React, {useState, useRef, useContext, useEffect, useCallback} from 'react';
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
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
import ImageCropper from 'react-native-simple-image-cropper';

//COMPONENTS
import {PreviousNextButton} from 'toktokwallet/components';

//FONT & IMAGES
import circleCheck from 'toktokwallet/assets/icons/circleCheck.png';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const {width, height} = Dimensions.get('window');

const CROP_AREA_WIDTH = width * 0.8;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH + 30;

const ratio = Math.min(width / CROP_AREA_WIDTH, height / CROP_AREA_HEIGHT);

const ViewPrivacyPolicy = () => {
  return Linking.openURL('https://toktok.ph/privacy-policy');
};

const MainComponent = ({children, onPress, onPressBack}) => {
  return (
    <>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
          <Text style={styles.title}>Take a Selfie with your Valid ID</Text>
          <Text style={styles.titleDescription}>
            Get verified by taking selfie with your valid government issued ID.
          </Text>
          <View style={styles.mainInput}>
            <View style={{marginTop: 20, flex: 1}}>
              <Text style={styles.selfieLabel}>Take a Selfie with ID</Text>
              {children}
            </View>
            <View style={styles.reminderContainer}>
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
                  <Text style={styles.benefitsListText}>
                    Take a selfie with the same valid government-issued ID that you have uploaded
                  </Text>
                </View>
                <View style={styles.benefitsListContainer}>
                  <Image style={styles.checkIcon} source={circleCheck} />
                  <Text style={styles.benefitsListText}>
                    Show front side of the ID and do not cover while taking a selfie{' '}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.instructionsContainer}>
              <Image
                style={styles.instructionsPicture}
                source={require('toktokwallet/assets/images/correctWay.png')}
                resizeMode="contain"
              />
              <Image
                style={styles.instructionsPicture}
                source={require('toktokwallet/assets/images/wrongWay.png')}
                resizeMode="contain"
              />
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

export const VerifySelfieWithID = () => {
  const [required, setRequired] = useState(false);
  const {setCacheImagesList, setCurrentIndex, setSelfieImageWithID, setTempSelfieImageWithID, tempSelfieImageWithID} =
    useContext(VerifyContext);

  const [cropperParams, setCropperParams] = useState({});
  const navigation = useNavigation();
  const cropSize = {
    // width: width,
    // height: height,
    width: CROP_AREA_WIDTH,
    height: CROP_AREA_HEIGHT,
  };
  const cropAreaSize = {
    // width: width,
    // height: height,
    width: CROP_AREA_WIDTH,
    height: CROP_AREA_HEIGHT,
  };

  const setImage = data => {
    // setSelfieImageWithID(data);
    setCacheImagesList(state => {
      return [...state, data.uri];
    });
    setTempSelfieImageWithID(data);
    // setCurrentIndex(oldval => oldval + 1)
  };

  const Back = () => {
    setCurrentIndex(oldstate => oldstate - 1);
  };

  const Proceed = async () => {
    if (tempSelfieImageWithID == null) {
      // return navigation.push('ToktokWalletSelfieImageWithIDCamera', {setImage});
      setRequired(true);
    } else {
      try {
        const croppedResult = await ImageCropper.crop({
          ...cropperParams,
          // imageUri: selfieImage.uri,
          imageUri: tempSelfieImageWithID.uri,
          cropSize,
          cropAreaSize,
        });

        setSelfieImageWithID(state => ({
          ...state,
          uri: croppedResult,
        }));

        return setCurrentIndex(oldval => oldval + 1);
      } catch (error) {
        throw error;
      }
    }
  };

  if (tempSelfieImageWithID) {
    return (
      <>
        <MainComponent onPress={Proceed} onPressBack={Back}>
          <View style={styles.PreviewImage}>
            {/* <Image style={{height:290,width: 280,flex: 1}} resizeMode="stretch" source={{uri: selfieImageWithID.uri}}/> */}
            <ImageCropper
              imageUri={tempSelfieImageWithID.uri}
              cropAreaWidth={Platform.OS === 'ios' ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110}
              cropAreaHeight={Platform.OS === 'ios' ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100}
              containerColor="transparent"
              areaColor="black"
              areaOverlay={<View style={styles.overlay} />}
              setCropperParams={cropperParams => {
                setCropperParams(cropperParams);
              }}
              areaOverlay={<View style={styles.overlay} />}
            />
            <TouchableOpacity
              onPress={() => navigation.push('ToktokWalletSelfieImageWithIDCamera', {setImage})}
              style={styles.changePhoto}>
              <EIcon name="camera" color={COLOR.ORANGE} size={20} />
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
          </View>
        </MainComponent>
      </>
    );
  }

  return (
    <>
      <MainComponent onPress={Proceed} onPressBack={Back}>
        <TouchableOpacity
          onPress={() => {
            navigation.push('ToktokWalletSelfieImageWithIDCamera', {setImage});
          }}
          style={[styles.selfieBtn, required && {borderColor: COLOR.RED}]}>
          <EIcon name="camera" color={COLOR.ORANGE} size={25} />
          <Text style={{marginBottom: 5, fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>Take a photo</Text>
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
    marginHorizontal: moderateScale(30),
  },
  requiredText: {
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
    color: COLOR.RED,
    marginTop: moderateScale(-5),
  },
  title: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    marginBottom: moderateScale(5),
  },
  titleDescription: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    color: '#525252',
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
  instructionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  instructionsPicture: {
    height: moderateScale(189),
    width: moderateScale(140),
    alignSelf: 'center',
  },
  privacyPolicyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  reminderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(10),
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
    marginTop: moderateScale(30),
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
    marginBottom: moderateScale(5),
    marginTop: moderateScale(15),
  },
  selfieBtn: {
    width: Platform.OS === 'ios' ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110,
    height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100,
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
    height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100 + 3,
    width: Platform.OS === 'ios' ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110 + 3,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 7,
    borderStyle: 'dashed',
    borderColor: COLOR.ORANGE,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    transform: [
      {
        scaleX: -1,
      },
    ],
  },
  changePhoto: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    transform: [
      {
        scaleX: -1,
      },
    ],
  },
  overlay: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
  },
});
