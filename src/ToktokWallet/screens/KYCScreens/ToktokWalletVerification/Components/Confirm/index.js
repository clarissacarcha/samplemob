import React, {useState, useRef, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Dimensions, Image} from 'react-native';
import {VerifyContext} from '../VerifyContextProvider';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_KYC_REGISTER} from 'toktokwallet/graphql';
import {useMutation} from '@apollo/react-hooks';
import {useAlert} from 'src/hooks/useAlert';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {AlertOverlay} from 'src/components';
import {ReactNativeFile} from 'apollo-upload-client';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {connect} from 'react-redux';
import {YellowButton} from 'src/revamp';
import {DisabledButton} from 'toktokwallet/components';
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import CONSTANTS from 'common/res/constants';
import ImageCropper from 'react-native-simple-image-cropper';
import {usePrompt} from 'src/hooks';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

//COMPONENTS
import {PreviousNextButton} from 'toktokwallet/components';

//UTIL
import {moderateScale} from 'toktokwallet/helper';
const {width, height} = Dimensions.get('window');

const CROP_AREA_WIDTH = width * 0.9;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH + 50;

const UserInfo = ({label, value}) => {
  return (
    <View style={{paddingVertical: 10, width: '100%', flexDirection: 'row'}}>
      <View style={{flex: 1}}>
        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M, color: '#525252', textAlign: 'left'}}>{label}</Text>
      </View>
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M, textAlign: 'right'}}>{value}</Text>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const Confirm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({session}) => {
  const prompt = usePrompt();
  const {setCurrentIndex} = useContext(VerifyContext);
  const VerifyUserData = useContext(VerifyContext);
  const {selfieImage, selfieImageWithID, frontImage, backImage} = VerifyUserData;
  const [cropperParams, setCropperParams] = useState({});
  const navigation = useNavigation();
  const alert = useAlert();
  const [cacheImages, setCacheImages] = useState(null);

  const [isCertify, setCertify] = useState(false);

  const [postKYCRegister, {data, error, loading}] = useMutation(POST_KYC_REGISTER, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (graphQLErrors[0]?.payload?.code === 'EXISTING_ACCOUNT') {
        navigation.navigate('ToktokLandingHome');
      }
      onErrorAlert({alert, error, title: graphQLErrors[0]?.payload?.title ? graphQLErrors[0]?.payload?.title : null});
    },
    onCompleted: response => {
      let result = response.postKycRegister;
      // removeCacheImages({
      //     VerifyUserData
      // })
      if (RNFS.CachesDirectoryPath) RNFS.unlink(RNFS.CachesDirectoryPath);
      if (result.status == 2) {
        // navigation.pop(2)
        // navigation.navigate("ToktokWalletVerifyResult")
        prompt({
          type: 'success',
          title: 'Application Submitted',
          message:
            'Kindly wait for the notification as our representative assesses your application. Thank you for choosing toktokwallet!',
          event: 'TOKTOKBILLSLOAD',
          onPress: () => navigation.replace('ToktokWalletVerifyResult'),
        });
      }
    },
  });

  const deleteFile = path => {
    RNFS.exists(path)
      .then(() => RNFS.unlink(path))
      .then(() => RNFS.scanFile(path))
      .catch(err => console.log(err))
      .finally(() => console.log(path, ' is deleted'));
    return;
  };

  const removeCacheImages = async ({VerifyUserData}) => {
    const {cacheImagesList, selfieImage, selfieImageWithID, frontImage, backImage} = VerifyUserData;
    const {rnSelfieFile, rnSelfieFileWithID, rnFrontIDFile, rnBackIDFile} = cacheImages;

    try {
      if (rnSelfieFile) await deleteFile(rnSelfieFile.uri);
      if (rnSelfieFileWithID) await deleteFile(rnSelfieFileWithID.uri);
      if (rnFrontIDFile) await deleteFile(rnFrontIDFile.uri);
      if (rnBackIDFile) await deleteFile(rnBackIDFile.uri);
      if (tempSelfieImage) await deleteFile(tempSelfieImage.uri);
      if (tempSelfieImageWithID) await deleteFile(tempSelfieImageWithID.uri);
      if (frontImage) await deleteFile(frontImage.uri);
      if (backImage) await deleteFile(backImage.uri);
      if (selfieImage) await deleteFile(selfieImage.uri);
      if (selfieImageWithID) await deleteFile(selfieImageWithID.uri);
      if (cacheImagesList.length > 0) {
        cacheImagesList.map(async image => {
          await deleteFile(image);
        });
      }
      return;
    } catch (error) {
      throw error;
    }
  };

  const Back = async () => {
    setCurrentIndex(oldstate => oldstate - 1);
  };

  const confirm = async () => {
    if (isCertify) {
      const rnValidIDFile = new ReactNativeFile({
        ...VerifyUserData.verifyID.idImage,
        name: 'documentValidID.jpg',
        type: 'image/jpeg',
      });

      const rnSelfieFile = new ReactNativeFile({
        ...VerifyUserData.selfieImage,
        name: 'documentSelfie.jpg',
        type: 'image/jpeg',
      });

      const rnSelfieFileWithID = new ReactNativeFile({
        ...VerifyUserData.selfieImageWithID,
        name: 'documentSelfieWithID.jpg',
        type: 'image/jpeg',
      });

      const rnFrontIDFile = VerifyUserData.frontImage
        ? new ReactNativeFile({
            ...VerifyUserData.frontImage,
            name: 'documentValidIDFront.jpg',
            type: 'image/jpeg',
          })
        : null;

      const rnBackIDFile = VerifyUserData.backImage
        ? new ReactNativeFile({
            ...VerifyUserData.backImage,
            name: 'documentValidIDBack.jpg',
            type: 'image/jpeg',
          })
        : null;

      const input = {
        // userId: session.user.id,
        userId: await AsyncStorage.getItem('accessToken'),
        mobileNumber: VerifyUserData.contactInfo.mobile_number,
        emailAddress: VerifyUserData.contactInfo.email,
        firstName: VerifyUserData.person.firstName,
        middleName: VerifyUserData.person.middleName,
        lastName: VerifyUserData.person.lastName,
        hasMiddleName: VerifyUserData.person.hasMiddleName,
        gender: VerifyUserData.person.gender,
        birthdate: moment(VerifyUserData.birthInfo.birthdate).format('YYYY-MM-DD'),
        // birthdate: VerifyUserData.birthInfo.birthdate,
        birthPlace: VerifyUserData.birthInfo.birthPlace,
        ...(rnSelfieFile ? {selfieImage: rnSelfieFile} : {}),
        ...(rnSelfieFileWithID ? {selfieImageWithID: rnSelfieFileWithID} : {}),
        nationality: VerifyUserData.nationalityId.toString(),
        line1: VerifyUserData.address.line1,
        line2: VerifyUserData.address.line2,
        postalCode: VerifyUserData.address.postalCode,
        cityId: VerifyUserData.cityId,
        provinceId: VerifyUserData.provinceId,
        ...(rnFrontIDFile ? {frontImage: rnFrontIDFile} : {}),
        ...(rnBackIDFile ? {backImage: rnBackIDFile} : {}),
        identificationCardNumber: VerifyUserData.verifyID.idNumber,
        identificationCardId: VerifyUserData.identificationId,
        sourceIncomeId: VerifyUserData.incomeInfo.source.id,
        otherSource: VerifyUserData.incomeInfo.otherSource,
        occupation: VerifyUserData.incomeInfo.occupation,
        isPep: VerifyUserData.pepInfo.isPep,
        pepRequest: {
          videocall: {
            videoCallContactDetails: VerifyUserData.pepInfo.videocall.videoCallContactDetails,
            callChannelId: VerifyUserData.pepInfo.videocall.callChannelId,
            preferredVcsDayMin: +VerifyUserData.pepInfo.videocall.preferredVcsDayMin,
            preferredVcsDayMax: +VerifyUserData.pepInfo.videocall.preferredVcsDayMax,
            preferredVcsTimeMin: VerifyUserData.pepInfo.videocall.preferredVcsTimeMin,
            preferredVcsTimeMax: VerifyUserData.pepInfo.videocall.preferredVcsTimeMax,
          },
          questionnaire: {
            isPep: VerifyUserData.pepInfo.questionnaire.isPep,
            pepPosition: VerifyUserData.pepInfo.questionnaire.pepPosition,
            isFamilyPep: VerifyUserData.pepInfo.questionnaire.isFamilyPep,
            familyPepPosition: VerifyUserData.pepInfo.questionnaire.familyPepPosition,
            sourceOfIncomeId: JSON.stringify(VerifyUserData.pepInfo.questionnaire.sourceOfIncomeId),
            sourceOfIncome: VerifyUserData.pepInfo.questionnaire.sourceOfIncome,
            sourceOfWealthId: JSON.stringify(VerifyUserData.pepInfo.questionnaire.sourceOfWealthId),
            sourceOfWealth: VerifyUserData.pepInfo.questionnaire.sourceOfWealth,
          },
        },
      };

      postKYCRegister({
        variables: {
          input: input,
        },
      });
    }
  };

  const ViewPrivacyPolicy = () => {
    return Linking.openURL('https://toktok.ph/privacy-policy');
  };

  return (
    <>
      <AlertOverlay visible={loading} />
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
        <ScrollView style={styles.mainInput} showsVerticalScrollIndicator={false}>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD, color: '#525252'}}>Review and Confirm</Text>
          <Text style={{fontFamily: FONT.REGULAR, marginBottom: 10, fontSize: FONT_SIZE.M, color: '#929191'}}>
            Review the details that you enter before clicking ‘Confrm’.
          </Text>
          <Text style={styles.titleText}>Personal Information</Text>
          <UserInfo label="Mobile Number" value={VerifyUserData.contactInfo.mobile_number} />
          <UserInfo label="First Name" value={VerifyUserData.person.firstName} />
          <UserInfo label="Middle Name" value={VerifyUserData.person.middleName} />
          <UserInfo label="Last Name" value={VerifyUserData.person.lastName} />
          <UserInfo label="Gender" value={VerifyUserData.person.gender} />
          <UserInfo label="Date of Birth" value={moment(VerifyUserData.birthInfo.birthdate).format('MMM DD, YYYY')} />
          <UserInfo label="Place of Birth" value={VerifyUserData.birthInfo.birthPlace} />
          <UserInfo label="Nationality" value={VerifyUserData.nationality} />
          <UserInfo
            label="Address"
            value={`${VerifyUserData.address.line1} ${VerifyUserData.address.line2} ${VerifyUserData.city} ${VerifyUserData.province}, ${VerifyUserData.address.country} ${VerifyUserData.address.postalCode}`}
          />
          <UserInfo label="Source of Income" value={VerifyUserData.incomeInfo.source.description} />
          {VerifyUserData.incomeInfo.source.description == 'others' && (
            <UserInfo label="" value={VerifyUserData.incomeInfo.otherSource} />
          )}
          <UserInfo label="Occupation" value={VerifyUserData.incomeInfo.occupation} />
          <UserInfo label="ID Type" value={VerifyUserData.verifyID.idType} />
          <UserInfo label="ID number" value={VerifyUserData.verifyID.idNumber} />
          {VerifyUserData.pepInfo.isPep && (
            <>
              <Text style={styles.titleText}>PEP Information</Text>
              <UserInfo
                label="Have you ever been categorized as PEP (Political Exposed Person) by a bank, brokerage firm or any financial institution?"
                value={
                  VerifyUserData.pepInfo.questionnaire.isPep === '1'
                    ? 'Yes'
                    : VerifyUserData.pepInfo.questionnaire.isPep === '2'
                    ? 'No'
                    : "I don't know"
                }
              />
              <UserInfo
                label="Do you have an immediate family member or business/close associate which is currently/formally qualified as PEP?"
                value={
                  VerifyUserData.pepInfo.questionnaire.isFamilyPep === '1'
                    ? 'Yes'
                    : VerifyUserData.pepInfo.questionnaire.isFamilyPep === '2'
                    ? 'No'
                    : "I don't know"
                }
              />
              <UserInfo
                label="Source of Income"
                value={VerifyUserData.pepInfo.questionnaire.sourceOfIncomeDes.join(',')}
              />
              <UserInfo
                label="Source of Wealth"
                value={VerifyUserData.pepInfo.questionnaire.sourceOfWealthDes.join(',')}
              />
              <Text style={styles.titleText}>Video Call Schedule</Text>
              <UserInfo
                label={VerifyUserData.pepInfo.videocall.callChannel}
                value={VerifyUserData.pepInfo.videocall.videoCallContactDetails}
              />
              <UserInfo label="Weekday" value={!VerifyUserData.pepInfo.videocall.selectedDay && 'Monday-Friday'} />
              <UserInfo label="Time" value={!VerifyUserData.pepInfo.videocall.selectedTime && '8:00 AM - 12:00 PM'} />
            </>
          )}
          <Text style={styles.titleText}>Gallery</Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View style={[styles.previewImage]}>
              <Image source={frontImage} style={[styles.imageStyle, {height: moderateScale(50)}]} />
            </View>
            {backImage && (
              <View style={styles.previewImage}>
                <Image source={backImage} style={[styles.imageStyle, {height: moderateScale(50)}]} />
              </View>
            )}
            <View style={styles.previewImage}>
              <Image source={selfieImage} style={styles.imageStyle} />
            </View>
            <View style={styles.previewImage}>
              <Image source={selfieImageWithID} style={styles.imageStyle} />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginVertical: moderateScale(20),
            }}>
            <CheckBox
              isChecked={isCertify}
              onClick={() => {
                return setCertify(!isCertify);
              }}
              checkBoxColor={COLOR.ORANGE}
            />
            <TouchableOpacity
              // onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")}
              onPress={() => navigation.navigate('ToktokWalletTermsConditions')}
              style={{paddingHorizontal: 16, textAlign: 'left'}}>
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>
                I hereby certify that the above information is true and correct. I have also read, understand, and
                accepts the{' '}
                <Text style={{color: COLOR.ORANGE, fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>
                  Terms and Conditions.
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* <View style={styles.proceedBtn}>
          <View style={{height: SIZE.FORM_HEIGHT}}>
            {isCertify ? <YellowButton label="Confirm" onPress={confirm} /> : <DisabledButton label="Confirm" />}
          </View>
        </View> */}
      </View>
      <PreviousNextButton
        label="Previous"
        labelTwo="Confirm"
        onPressNext={confirm}
        onPressPrevious={Back}
        hasShadow
        isPrevious
      />
    </>
  );
});

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flex: 1,
  },
  mainInput: {
    flex: 1,
  },
  proceedBtn: {
    height: 90,
    width: '100%',
    justifyContent: 'flex-end',
    // flexDirection: "row",
  },
  titleText: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    color: COLOR.ORANGE,
    paddingVertical: moderateScale(16),
  },
  input: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'silver',
    marginTop: 20,
  },
  imageStyle: {
    resizeMode: 'cover',
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(5),
    transform: [
      {
        scaleX: -1,
      },
    ],
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
  overlay: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  previewImage: {
    height: moderateScale(85),
    width: moderateScale(85),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginRight: moderateScale(7),
  },
});
