import React, {useContext, useEffect, useState, useRef, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from 'react-native';
import {VerifyContext} from '../VerifyContextProvider';
import validator from 'validator';
import {YellowButton, VectorIcon, ICON_SET} from 'src/revamp';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_CHECK_BLOCKED_ACCOUNT_RECORD} from 'toktokwallet/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {useAlert} from 'src/hooks/useAlert';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useNavigation} from '@react-navigation/native';
import CheckBox from 'react-native-check-box';
import CONSTANTS from 'common/res/constants';
import {useHeaderHeight} from '@react-navigation/stack';
import {getStatusBarHeight} from 'react-native-status-bar-height';

//HELPER
import {moderateScale} from 'toktokwallet/helper';
import {calendar_icon} from 'toktokwallet/assets';

//SELF IMPORTS
import BottomSheetGender from './BottomSheetGender';
import BottomSheetSourceOfIncome from './BottomSheetSourceOfIncome';
import DateBirthModal from './DateBirthModal';
import ModalNationality from './ModalNationality';
import {OrangeButton} from 'toktokwallet/components';

const {COLOR, FONT_FAMILY: FONT, SIZE, FONT_SIZE} = CONSTANTS;

const screen = Dimensions.get('window');

export const VerifyFullname = () => {
  const {
    nationality,
    nationalityId,
    setCurrentIndex,
    person,
    changePersonInfo,
    contactInfo,
    changeContactInfo,
    birthInfo,
    changeBirthInfo,
    setModalCountryVisible,
    incomeInfo,
    changeIncomeInfo,
    verifyFullNameErrors,
    changeVerifyFullNameErrors,
  } = useContext(VerifyContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalNationalityVisible, setModalNationalityVisible] = useState(false);
  const [modaltype, setModaltype] = useState('');
  const [mobile, setMobile] = useState(contactInfo.mobile_number.replace('+63', ''));
  const genderRef = useRef();
  const SourceOfIncomeRef = useRef();
  const alert = useAlert();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const keyboardVerticalOffset = headerHeight + getStatusBarHeight() + 10;
  const [visibleGenderModal, setVisibleGenderModal] = useState(false);
  const [visibleSOIModal, setVisibleSOIModal] = useState(false);

  const scrollviewRef = useRef();

  const [getCheckBlockedAccountRecord, {loading}] = useLazyQuery(GET_CHECK_BLOCKED_ACCOUNT_RECORD, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => {
      const {graphQLErrors, networkError} = error;
      graphQLErrors.map(({message, payload}) => {
        if (payload.code == 'EXISTING_BLOCKED_ACCOUNT') {
          // restricted here
          navigation.push('ToktokWalletRestricted', {component: 'haveInactiveAccount'});
          //navigation.push("ToktokWalletHelpCentreContactUs");
        } else {
          onErrorAlert({alert, error});
        }
      });
    },
    onCompleted: ({getCheckBlockedAccountRecord}) => {
      return setCurrentIndex(oldval => oldval + 1);
    },
  });

  const checkFieldIsEmpty = (key, value, fieldType) => {
    let message = fieldType === 'selection' ? 'Please make a selection' : 'This field is required';
    let errorMessage = validator.isEmpty(value, {ignore_whitespace: true}) ? message : '';
    if (value != '' && key == 'emailError' && !validator.isEmail(contactInfo.email, {ignore_whitespace: true})) {
      errorMessage = 'Email format is invalid';
    }
    changeVerifyFullNameErrors(key, errorMessage);

    return !errorMessage;
  };

  const scrollToError = (scrollToY, isScrollToEnd) => {
    isScrollToEnd
      ? scrollviewRef.current.scrollToEnd({animated: true})
      : scrollviewRef.current.scrollTo({x: 0, y: screen.height * scrollToY, animated: true});
  };

  const NextPage = () => {
    const isFirstNameValid = checkFieldIsEmpty('firstNameError', person.firstName);
    const isMiddleNameValid = person.hasMiddleName ? checkFieldIsEmpty('middleNameError', person.middleName) : true;
    const isLastNameValid = checkFieldIsEmpty('lastNameError', person.lastName);
    const isGenderValid = checkFieldIsEmpty('genderError', person.gender, 'selection');
    const isEmailValid = checkFieldIsEmpty('emailError', contactInfo.email);
    const isBirthdateValid = checkFieldIsEmpty('birthdateError', birthInfo.birthdate.toString());
    const isBirthPlaceValid = checkFieldIsEmpty('birthPlaceError', birthInfo.birthPlace);
    const isOccupationValid = checkFieldIsEmpty('occupationError', incomeInfo.occupation);
    const isSourceIncomeValid = checkFieldIsEmpty(
      'sourceIncomeError',
      incomeInfo.source != '' ? incomeInfo.source.description : '',
      'selection',
    );
    const isOtherSourceIncomeValid =
      incomeInfo.source.id == '0' ? checkFieldIsEmpty('otherSourceError', incomeInfo.otherSource) : true;

    if (
      isFirstNameValid &&
      isMiddleNameValid &&
      isLastNameValid &&
      isGenderValid &&
      isEmailValid &&
      isBirthdateValid &&
      isBirthPlaceValid &&
      isOccupationValid &&
      isSourceIncomeValid &&
      isOtherSourceIncomeValid
    ) {
      changeContactInfo('mobile_number', '+63' + mobile);
      getCheckBlockedAccountRecord({
        variables: {
          input: {
            firstName: person.firstName,
            middleName: person.middleName,
            lastName: person.lastName,
            birthdate: birthInfo.birthdate,
          },
        },
      });
      setCurrentIndex(oldval => oldval + 1);
    }
  };

  const ViewPrivacyPolicy = () => {
    return Linking.openURL('https://toktok.ph/privacy-policy');
  };

  const onMobileChange = val => {
    const value = val.replace(/[^0-9]/g, '');
    if (value.length === 1 && value === '0') {
      setMobile('');
      return;
    }

    if (value.length > 10) {
      setMobile(mobile);
      return;
    }

    setMobile(value);
  };

  return (
    <>
      <DateBirthModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        birthInfo={birthInfo}
        changeBirthInfo={changeBirthInfo}
        changeError={() => changeVerifyFullNameErrors('birthdateError', '')}
      />
      <ModalNationality visible={modalNationalityVisible} setVisible={setModalNationalityVisible} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardVerticalOffset : screen.height * 0.5}
        style={{flex: 1}}>
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ref={scrollviewRef}>
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
          <View style={styles.mainInput}>
            <Text style={styles.title}>Fill out the Information</Text>
            <Text style={styles.information}>Please enter the name that appears on your Valid ID.</Text>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.mobileNoContainer}>
                <View style={styles.countryCode}>
                  <Text style={{marginHorizontal: 10, fontSize: FONT_SIZE.M}}>+63</Text>
                </View>
                <View style={{...styles.mobileNoContent, ...styles.input}}>
                  <Text style={styles.mobileNo}>{mobile}</Text>
                </View>
              </View>
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={{...styles.input, ...(!!verifyFullNameErrors.firstNameError ? styles.errorBorder : {})}}
                value={person.firstName}
                onChangeText={value => {
                  changePersonInfo('firstName', value);
                  changeVerifyFullNameErrors('firstNameError', '');
                }}
                placeholder="Enter first name here"
                placeholderTextColor={COLOR.DARK}
                returnKeyType="done"
              />
              {!!verifyFullNameErrors.firstNameError && (
                <Text style={styles.errorMessage}>{verifyFullNameErrors.firstNameError}</Text>
              )}
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Middle Name</Text>
              <TextInput
                editable={person.hasMiddleName}
                style={{...styles.input, ...(verifyFullNameErrors.middleNameError ? styles.errorBorder : {})}}
                value={person.middleName}
                onChangeText={value => {
                  changePersonInfo('middleName', value);
                  changeVerifyFullNameErrors('middleNameError', '');
                }}
                placeholder="Enter middle name here"
                placeholderTextColor={COLOR.DARK}
                returnKeyType="done"
              />
              {!!verifyFullNameErrors.middleNameError && (
                <Text style={styles.errorMessage}>{verifyFullNameErrors.middleNameError}</Text>
              )}
              <View style={styles.checkBoxContainer}>
                <CheckBox
                  isChecked={!person.hasMiddleName}
                  onClick={() => {
                    changePersonInfo('middleName', '');
                    changePersonInfo('hasMiddleName', !person.hasMiddleName);
                    changeVerifyFullNameErrors('middleNameError', '');
                    return;
                  }}
                  checkBoxColor={COLOR.ORANGE}
                  checkedCheckBoxColor={COLOR.ORANGE}
                />
                <Text style={styles.checkBoxDescription}>Click checkbox if Middle Name is unknown</Text>
              </View>
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={{...styles.input, ...(verifyFullNameErrors.lastNameError ? styles.errorBorder : {})}}
                value={person.lastName}
                onChangeText={value => {
                  changePersonInfo('lastName', value);
                  changeVerifyFullNameErrors('lastNameError', '');
                }}
                placeholder="Enter last name here"
                placeholderTextColor={COLOR.DARK}
                returnKeyType="done"
              />
              {!!verifyFullNameErrors.lastNameError && (
                <Text style={styles.errorMessage}>{verifyFullNameErrors.lastNameError}</Text>
              )}
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.selectionContainer,
                  styles.shadow,
                  {...(verifyFullNameErrors.genderError ? styles.errorBorder : {})},
                ]}
                onPress={() => setVisibleGenderModal(true)}>
                {person.gender == '' ? (
                  <Text style={[styles.selectionText, {color: COLOR.DARK}]}>Select Gender</Text>
                ) : (
                  <Text style={styles.selectionText}>{person.gender}</Text>
                )}
                <VectorIcon
                  iconSet={ICON_SET.FontAwesome5}
                  name="chevron-down"
                  size={moderateScale(16)}
                  color={COLOR.ORANGE}
                />
              </TouchableOpacity>
              {!!verifyFullNameErrors.genderError && (
                <Text style={styles.errorMessage}>{verifyFullNameErrors.genderError}</Text>
              )}
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={{...styles.input, ...(verifyFullNameErrors.emailError ? styles.errorBorder : {})}}
                value={contactInfo.email}
                onChangeText={value => {
                  changeContactInfo('email', value);
                  changeVerifyFullNameErrors('emailError', '');
                }}
                placeholder="Enter email here"
                placeholderTextColor={COLOR.DARK}
                returnKeyType="done"
              />
              {!!verifyFullNameErrors.emailError && (
                <Text style={styles.errorMessage}>{verifyFullNameErrors.emailError}</Text>
              )}
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                onPress={() => {
                  scrollviewRef.current.scrollTo({x: 0, y: screen.height * 0.9, animated: true});
                  setModalVisible(true);
                }}
                style={{
                  ...styles.input,
                  ...styles.flexCenter,
                  ...(verifyFullNameErrors.birthdateError ? styles.errorBorder : {}),
                }}>
                {birthInfo.birthdate == '' ? (
                  <Text style={[styles.selectionText, {color: COLOR.DARK}]}>mm/dd/yy</Text>
                ) : (
                  <Text style={[styles.selectionText]}>{moment(birthInfo.birthdate).format('MM/DD/YYYY')}</Text>
                )}
                <Image source={calendar_icon} style={{width: moderateScale(20), height: moderateScale(20)}} />
              </TouchableOpacity>
              {!!verifyFullNameErrors.birthdateError && (
                <Text style={styles.errorMessage}>{verifyFullNameErrors.birthdateError}</Text>
              )}
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Place of Birth</Text>
              <TextInput
                style={{
                  ...styles.input,
                  ...(verifyFullNameErrors.birthPlaceError ? styles.errorBorder : {}),
                }}
                value={birthInfo.birthPlace}
                onChangeText={value => {
                  changeBirthInfo('birthPlace', value);
                  changeVerifyFullNameErrors('birthPlaceError', '');
                }}
                placeholder={'Enter place of birth here'}
                placeholderTextColor={COLOR.DARK}
                returnKeyType="done"
              />
              {!!verifyFullNameErrors.birthPlaceError && (
                <Text style={styles.errorMessage}>{verifyFullNameErrors.birthPlaceError}</Text>
              )}
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Nationality</Text>
              <TouchableOpacity
                onPress={() => setModalNationalityVisible(true)}
                style={[styles.input, styles.selectionContainer, styles.shadow]}>
                <Text style={{flex: 1, fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>{nationality}</Text>
                <VectorIcon
                  iconSet={ICON_SET.FontAwesome5}
                  name="chevron-down"
                  size={moderateScale(16)}
                  color={COLOR.ORANGE}
                />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Occupation</Text>
              <TextInput
                placeholder="Enter occupation here"
                placeholderTextColor={COLOR.DARK}
                style={{
                  ...styles.input,
                  ...(verifyFullNameErrors.occupationError ? styles.errorBorder : {}),
                }}
                value={incomeInfo.occupation}
                onChangeText={value => {
                  changeIncomeInfo('occupation', value);
                  changeVerifyFullNameErrors('occupationError', '');
                }}
                maxLength={30}
              />
              {!!verifyFullNameErrors.occupationError && (
                <Text style={styles.errorMessage}>{verifyFullNameErrors.occupationError}</Text>
              )}
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Source of Income</Text>
              <TouchableOpacity
                onPress={() => setVisibleSOIModal(true)}
                style={[
                  styles.input,
                  styles.selectionContainer,
                  styles.shadow,
                  {...(verifyFullNameErrors.sourceIncomeError ? styles.errorBorder : {})},
                ]}>
                {incomeInfo.source == '' ? (
                  <Text style={[styles.selectionText, {color: COLOR.DARK}]}>Select Source of Income</Text>
                ) : (
                  <Text style={[styles.selectionText]}>{incomeInfo.source.description}</Text>
                )}
                <VectorIcon
                  iconSet={ICON_SET.FontAwesome5}
                  name="chevron-down"
                  size={moderateScale(16)}
                  color={COLOR.ORANGE}
                />
              </TouchableOpacity>
              {!!verifyFullNameErrors.sourceIncomeError && (
                <Text style={styles.errorMessage}>{verifyFullNameErrors.sourceIncomeError}</Text>
              )}
            </View>
            {incomeInfo.source.id == '0' && (
              <View style={{marginTop: 10}}>
                <TextInput
                  placeholder="Enter Source of Income here"
                  placeholderTextColor={COLOR.DARK}
                  style={{
                    ...styles.input,
                    ...(verifyFullNameErrors.otherSourceError ? styles.errorBorder : {}),
                  }}
                  value={incomeInfo.otherSource}
                  onChangeText={value => {
                    changeIncomeInfo('otherSource', value);
                    changeVerifyFullNameErrors('otherSourceError', '');
                  }}
                />
                {!!verifyFullNameErrors.otherSourceError && (
                  <Text style={styles.errorMessage}>{verifyFullNameErrors.otherSourceError}</Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <OrangeButton label="Next" onPress={NextPage} hasShadow />
      <BottomSheetGender
        setVisibleGenderModal={setVisibleGenderModal}
        visibleGenderModal={visibleGenderModal}
        changePersonInfo={changePersonInfo}
        changeVerifyFullNameErrors={changeVerifyFullNameErrors}
      />
      <BottomSheetSourceOfIncome
        changeIncomeInfo={changeIncomeInfo}
        visibleSOIModal={visibleSOIModal}
        setVisibleSOIModal={setVisibleSOIModal}
        changeVerifyFullNameErrors={changeVerifyFullNameErrors}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  progressBar: {
    height: 2,
    width: '100%',
    flexDirection: 'row',
  },
  progressBarItem: {
    flex: 1,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  mainInput: {
    flex: 1,
    padding: 16,
  },
  proceedBtn: {
    height: 40,
    width: '100%',
  },
  input: {
    height: 50,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    marginTop: 5,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    paddingHorizontal: moderateScale(15),
  },
  errorBorder: {
    borderColor: COLOR.RED,
    borderWidth: 1,
  },
  errorMessage: {
    color: COLOR.RED,
    fontSize: FONT_SIZE.S,
    marginTop: 5,
  },
  flexCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  label: {
    fontFamily: FONT.BOLD,
    marginBottom: moderateScale(5),
    color: '#525252',
    fontSize: FONT_SIZE.S,
  },
  mobileNoContainer: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: moderateScale(50),
    marginBottom: FONT_SIZE.MARGIN,
    backgroundColor: COLOR.LIGHT,
  },
  countryCode: {
    height: SIZE.FORM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: moderateScale(4.3),
    borderRightColor: '#DADADA',
    borderRightWidth: 1,
  },
  mobileNoContent: {
    paddingLeft: moderateScale(5),
    flex: 1,
    justifyContent: 'center',
  },
  mobileNo: {
    marginHorizontal: moderateScale(6),
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  checkBoxDescription: {
    alignSelf: 'center',
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    color: '#525252',
    marginTop: moderateScale(2),
    marginHorizontal: moderateScale(5),
  },
  checkBoxContainer: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: 'white',
  },
  selectionText: {
    flex: 1,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  information: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    color: '#525252',
    marginTop: 5,
  },
});
