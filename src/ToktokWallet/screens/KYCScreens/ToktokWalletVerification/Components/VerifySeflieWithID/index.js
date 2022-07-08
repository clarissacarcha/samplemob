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
import {ICON_SET, VectorIcon, YellowButton} from 'src/revamp';
import {PepQuestionnaireModal, PepRequestVideoCallModal} from 'toktokwallet/components';
import {moderateScale} from 'toktokwallet/helper';
import {useMutation} from '@apollo/react-hooks';
import {useAlert} from 'src/hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {AlertOverlay} from 'src/components';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_VERIFY_IF_PEP} from 'toktokwallet/graphql';
import {useFocusEffect} from '@react-navigation/native';
import CONSTANTS from 'common/res/constants';
import ImageCropper from 'react-native-simple-image-cropper';

//COMPONENTS
import {PreviousNextButton} from 'toktokwallet/components';

//FONT & IMAGES
import circleCheck from 'toktokwallet/assets/icons/circleCheck.png';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const {width, height} = Dimensions.get('window');

const CROP_AREA_WIDTH = width * 0.9;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH + 50;

const ratio = Math.min(width / CROP_AREA_WIDTH, height / CROP_AREA_HEIGHT);

const Reminder = ({children}) => {
  return (
    <View style={{flexDirection: 'row', marginVertical: 5, paddingHorizontal: 16}}>
      <View>
        <View style={{padding: 2, borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1, marginRight: 10}}>
          <VectorIcon size={12} iconSet={ICON_SET.Feather} name="check" />
        </View>
      </View>
      <View style={{paddingRight: 20}}>{children}</View>
    </View>
  );
};

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
        onPress={onPress}
        onPressPrevious={onPressBack}
        hasShadow
        isPrevious
      />
    </>
  );
};

export const VerifySelfieWithID = () => {
  const [showPepQuestionnaire, setShowPepQuestionnaire] = useState(false);
  const [showPepVideoRequest, setShowPepVideoRequest] = useState(false);
  const VerifyUserData = useContext(VerifyContext);
  const {
    setCacheImagesList,
    setCurrentIndex,
    selfieImageWithID,
    setSelfieImageWithID,
    setTempSelfieImageWithID,
    tempSelfieImageWithID,
    person,
    birthInfo,
    nationalityId,
    pepInfo,
    setPepInfo,
  } = VerifyUserData;
  const [cropperParams, setCropperParams] = useState({});
  const navigation = useNavigation();
  const alert = useAlert();
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

  const [postVerifyIfPep, {loading}] = useMutation(POST_VERIFY_IF_PEP, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    onError: error => onErrorAlert({alert, error}),
    onCompleted: ({postVerifyIfPep}) => {
      if (postVerifyIfPep) {
        setPepInfo(state => {
          return {
            ...state,
            isPep: true,
          };
        });
        return setShowPepQuestionnaire(true);
      }

      return setCurrentIndex(oldval => oldval + 1);
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (pepInfo?.questionnaire?.sourceOfIncomeId.length > 0) setShowPepQuestionnaire(true);
    }, [pepInfo]),
  );
  const Back = async () => {
    setCurrentIndex(oldstate => oldstate - 1);
  };

  const Proceed = async () => {
    if (tempSelfieImageWithID == null) {
      return navigation.push('ToktokWalletSelfieImageWithIDCamera', {setImage});
    }
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

      postVerifyIfPep({
        variables: {
          input: {
            firstName: person.firstName,
            middleName: person.middleName,
            lastName: person.lastName,
            birthDate: birthInfo.birthdate,
            placeOfBirth: birthInfo.birthPlace,
            gender: person.gender,
            nationality: nationalityId,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };

  if (tempSelfieImageWithID) {
    return (
      <>
        <AlertOverlay visible={loading} />
        <PepRequestVideoCallModal
          visible={showPepVideoRequest}
          setVisible={setShowPepVideoRequest}
          callback={() => {
            navigation.navigate('ToktokWalletPepVideoCallSchedule', {
              setCurrentIndex,
              pepInfo,
              setPepInfo,
            });
            setShowPepVideoRequest(false);
          }}
          setShowPepQuestionnaire={setShowPepQuestionnaire}
        />
        <PepQuestionnaireModal
          visible={showPepQuestionnaire}
          setVisible={setShowPepQuestionnaire}
          onRequestClose={() => setShowPepQuestionnaire(false)}
          pepInfo={pepInfo}
          setPepInfo={setPepInfo}
          callback={() => {
            setShowPepQuestionnaire(false);
            setShowPepVideoRequest(true);
          }}
        />
        <MainComponent onPress={Proceed}>
          <View style={styles.PreviewImage}>
            {/* <Image style={{height:290,width: 280,flex: 1}} resizeMode="stretch" source={{uri: selfieImageWithID.uri}}/> */}
            <ImageCropper
              imageUri={tempSelfieImageWithID.uri}
              cropAreaWidth={Platform.OS === 'ios' ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110}
              cropAreaHeight={Platform.OS === 'ios' ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100}
              containerColor="transparent"
              areaColor="black"
              setCropperParams={cropperParams => {
                setCropperParams(cropperParams);
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.push('ToktokWalletSelfieImageWithIDCamera', {setImage})}
              style={styles.changePhoto}>
              <EIcon name="camera" color={COLOR.YELLOW} size={20} />
              <Text
                style={{
                  textAlign: 'center',
                  color: COLOR.YELLOW,
                  fontFamily: FONT.REGULAR,
                  fontSize: FONT_SIZE.S,
                  marginTop: -2,
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
          style={[styles.selfieBtn]}>
          <EIcon name="camera" color={COLOR.ORANGE} size={25} />
          <Text style={{marginBottom: 5, fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>Take a photo</Text>
        </TouchableOpacity>
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
    margin: moderateScale(30),
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
    color: '#929191',
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
    marginVertical: moderateScale(30),
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
    marginBottom: moderateScale(5),
  },
  selfieBtn: {
    height: 180,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFAF6',
    alignSelf: 'center',
    marginVertical: moderateScale(10),
    borderStyle: 'dashed',
    borderColor: COLOR.ORANGE,
    borderWidth: 2,
    borderRadius: 5,
  },
  PreviewImage: {
    // width: 290,
    // height: 300,
    height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100 + 10,
    width: Platform.OS === 'ios' ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110 + 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 7,
    padding: 2,
    borderStyle: 'dashed',
    borderColor: COLOR.YELLOW,
    borderWidth: 2,
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
    bottom: 15,
    width: 180,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    transform: [
      {
        scaleX: -1,
      },
    ],
  },
});
