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
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_VERIFY_IF_PEP, GET_CHECK_BLOCKED_ACCOUNT_RECORD} from 'toktokwallet/graphql/virtual';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {useAlert} from 'src/hooks/useAlert';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useNavigation} from '@react-navigation/native';
import CheckBox from 'react-native-check-box';
import CONSTANTS from 'common/res/constants';
import {useHeaderHeight} from '@react-navigation/stack';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {AlertOverlay} from 'src/components';

//HELPER
import {moderateScale} from 'toktokwallet/helper';
import {calendar_icon} from 'toktokwallet/assets';

//SELF IMPORTS
import SourceOfIncome from './SourceOfIncome';
import ModalNationality from './ModalNationality';
import {OrangeButton, CustomTextInput, CustomSelectionList, CustomDateInput} from 'toktokwallet/components';

const {COLOR, FONT_FAMILY: FONT, SIZE, FONT_SIZE} = CONSTANTS;

const screen = Dimensions.get('window');

export const VerifyFullname = () => {
  const {
    birthInfo,
    changeBirthInfo,
    changeContactInfo,
    changeIncomeInfo,
    changePersonInfo,
    changeVerifyFullNameErrors,
    contactInfo,
    incomeInfo,
    nationalityId,
    person,
    setCurrentIndex,
    setPepInfo,
    verifyFullNameErrors,
    appendPepScreens,
    resetStepScreens,
  } = useContext(VerifyContext);

  const [mobile, setMobile] = useState(contactInfo.mobile_number.replace('+63', ''));
  const alert = useAlert();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const keyboardVerticalOffset = headerHeight + getStatusBarHeight() + 10;

  const scrollviewRef = useRef();

  const [postVerifyIfPep, {loading: verifyPepLoading}] = useMutation(POST_VERIFY_IF_PEP, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    onError: error => onErrorAlert({alert, error}),
    onCompleted: ({postVerifyIfPep}) => {
      setPepInfo(state => {
        return {
          ...state,
          isPep: postVerifyIfPep,
        };
      });
      postVerifyIfPep ? appendPepScreens() : resetStepScreens();
      return setCurrentIndex(oldval => oldval + 1);
    },
  });

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
      postVerifyIfPep({
        variables: {
          input: {
            firstName: person.firstName,
            middleName: person.middleName,
            lastName: person.lastName,
            birthDate: birthInfo.birthdate,
            placeOfBirth: birthInfo.birthPlace,
            gender: person.gender,
            nationality: +nationalityId,
          },
        },
      });
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
      <AlertOverlay visible={verifyPepLoading} />
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
              <CustomTextInput
                value={person.firstName}
                onChangeText={value => {
                  changePersonInfo('firstName', value);
                  changeVerifyFullNameErrors('firstNameError', '');
                }}
                errorMessage={verifyFullNameErrors.firstNameError}
              />
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Middle Name</Text>
              <CustomTextInput
                value={person.middleName}
                onChangeText={value => {
                  changePersonInfo('middleName', value);
                  changeVerifyFullNameErrors('middleNameError', '');
                }}
                errorMessage={verifyFullNameErrors.middleNameError}
                editable={person.hasMiddleName}
              />
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
              <CustomTextInput
                value={person.lastName}
                onChangeText={value => {
                  changePersonInfo('lastName', value);
                  changeVerifyFullNameErrors('lastNameError', '');
                }}
                errorMessage={verifyFullNameErrors.lastNameError}
              />
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Gender</Text>
              <CustomSelectionList
                placeholder="Select Gender"
                onSelectedValue={({value}) => {
                  changePersonInfo('gender', value);
                  changeVerifyFullNameErrors('genderError', '');
                }}
                errorMessage={verifyFullNameErrors.genderError}
                data={[{description: 'Female'}, {description: 'Male'}]}
                selectedValue={person.gender}
              />
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Email</Text>
              <CustomTextInput
                value={contactInfo.email}
                onChangeText={value => {
                  changeContactInfo('email', value);
                  changeVerifyFullNameErrors('emailError', '');
                }}
                errorMessage={verifyFullNameErrors.emailError}
              />
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Date of Birth</Text>
              <CustomDateInput
                onSelectedValue={date => {
                  changeBirthInfo('birthdate', date);
                  changeVerifyFullNameErrors('birthdateError', '');
                }}
                selectedValue={birthInfo.birthdate}
                errorMessage={verifyFullNameErrors.birthdateError}
              />
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Place of Birth</Text>
              <CustomTextInput
                value={birthInfo.birthPlace}
                onChangeText={value => {
                  changeBirthInfo('birthPlace', value);
                  changeVerifyFullNameErrors('birthPlaceError', '');
                }}
                errorMessage={verifyFullNameErrors.birthPlaceError}
              />
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Nationality</Text>
              <ModalNationality verifyFullNameErrors={verifyFullNameErrors} />
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Occupation</Text>
              <CustomTextInput
                value={incomeInfo.occupation}
                onChangeText={value => {
                  changeIncomeInfo('occupation', value);
                  changeVerifyFullNameErrors('occupationError', '');
                }}
                maxLength={30}
                errorMessage={verifyFullNameErrors.occupationError}
              />
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Source of Income</Text>
              <SourceOfIncome
                selectedValue={incomeInfo?.source.description}
                changeIncomeInfo={changeIncomeInfo}
                changeVerifyFullNameErrors={changeVerifyFullNameErrors}
                verifyFullNameErrors={verifyFullNameErrors}
              />
            </View>
            {incomeInfo.source.id == '0' && (
              <View style={{marginTop: moderateScale(10)}}>
                <CustomTextInput
                  value={incomeInfo.otherSource}
                  onChangeText={value => {
                    changeIncomeInfo('otherSource', value);
                    changeVerifyFullNameErrors('otherSourceError', '');
                  }}
                  errorMessage={verifyFullNameErrors.otherSourceError}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <OrangeButton label="Next" onPress={NextPage} hasShadow />
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
  information: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    color: '#525252',
    marginTop: 5,
  },
});
