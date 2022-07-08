import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking,
  ScrollView,
  Alert,
  Dimensions,
  Image
} from 'react-native';
import EIcon from 'react-native-vector-icons/EvilIcons';
import {useQuery, useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_CITIES} from 'toktokwallet/graphql/virtual';
import {VerifyContext} from '../VerifyContextProvider';
import {YellowButton, VectorIcon, ICON_SET} from 'src/revamp';
import CONSTANTS from 'common/res/constants';
import {useHeaderHeight} from '@react-navigation/stack';
import {getStatusBarHeight} from 'react-native-status-bar-height';

//SELF IMPORTS
import ModalCity from './ModalCity';
import ModalCountry from './ModalCountry';
import ModalProvince from './ModalProvince';
import {PreviousNextButton} from 'toktokwallet/components';

//HELPER
import {moderateScale} from 'toktokwallet/helper';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const screen = Dimensions.get('window');

export const VerifyAddress = () => {
  const {
    address,
    setCurrentIndex,
    changeAddress,
    setModalCountryVisible,
    setModalProvinceVisible,
    setModalCityVisible,
    provinceCities,
    province,
    provinceId,
    city,
    setCity,
    cityId,
    setCityId,
  } = useContext(VerifyContext);

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const headerHeight = useHeaderHeight();
  const keyboardVerticalOffset = headerHeight + getStatusBarHeight() + 10;

  const scrollviewRef = useRef();
  
  const [getCityByProvinceCode, {error, loading}] = useLazyQuery(GET_CITIES, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      // console.log("Clity", response)
      setCities(response.getCities);
    },
    onError: err => {
      console.log(err);
    },
  });

  const Previous = () => {
    // if (address.line1 == '') return Alert.alert('', 'Street Address is required.');
    // if (address.line2 == '') return Alert.alert('', 'Barangay is required.');
    // if (provinceId == '') return Alert.alert('', 'Province is required.');
    // if (cityId == '') return Alert.alert('', 'City is required.');
    // if (address.postalCode == '') return Alert.alert('', 'Postal code is required.');

    setCurrentIndex(oldval => oldval - 1);
  };
  const Next = () => {
    // if (address.line1 == '') return Alert.alert('', 'Street Address is required.');
    // if (address.line2 == '') return Alert.alert('', 'Barangay is required.');
    // if (provinceId == '') return Alert.alert('', 'Province is required.');
    // if (cityId == '') return Alert.alert('', 'City is required.');
    // if (address.postalCode == '') return Alert.alert('', 'Postal code is required.');

    setCurrentIndex(oldval => oldval + 1);
  };

  const onProvinceSelect = code => {
    changeAddress('city', '');
    getCityByProvinceCode({
      variables: {
        input: {
          provCode: code,
        },
      },
    });
  };

  const ViewPrivacyPolicy = () => {
    return Linking.openURL('https://toktok.ph/privacy-policy');
  };

  useEffect(() => {
    setSelectedCity(city);
  }, [city]);

  return (
    <>
      <ModalCountry type="address" />
      <ModalProvince type="address" onSelect={onProvinceSelect} />

      {cities.length == 0 ? null : <ModalCity type="address" data={cities} />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardVerticalOffset : screen.height * 0.5}
        style={{flex: 1}}>
        <ScrollView style={{flex: 1}}
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
            <Text style={styles.information}>Please enter your permanent address.</Text>
           
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Country</Text>
              <TouchableOpacity
                onPress={() => setModalNationalityVisible(true)}
                style={[styles.input, styles.selectionContainer, styles.shadow]}>
                <Text style={{flex: 1, fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>{address.country}</Text>
                <VectorIcon
                  iconSet={ICON_SET.FontAwesome5}
                  name="chevron-down"
                  size={moderateScale(16)}
                  color={COLOR.ORANGE}
                />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                value={address.line1}
                onChangeText={value => {
                  changeAddress('line1', value);
                  // changeVerifyAdressErrors('addressError', '');
                }}
                placeholderTextColor={COLOR.DARK}
                returnKeyType="done"
              />
              {/* {!!verifyAddressErrors.streetError && (
                <Text style={styles.errorMessage}>{verifyAddressErrors.streetError}</Text>
              )} */}
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Barangay</Text>
              <TextInput
                style={styles.input}
                value={address.line2}
                onChangeText={value => {
                  changeAddress('line2', value);
                }}
                placeholderTextColor={COLOR.DARK}
                returnKeyType="done"
              />
            </View>
            
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Province</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.selectionContainer,
                  styles.shadow,
                  // {...(verifyFullNameErrors.provinceError ? styles.errorBorder : {})},
                ]}
                onPress={() => setModalProvinceVisible(true)}>
                {province == '' ? (
                  <Text style={[styles.selectionText, {color: COLOR.DARK}]}>Select Province</Text>
                ) : (
                  <Text style={styles.selectionText}>{province}</Text>
                )}
                <VectorIcon
                  iconSet={ICON_SET.FontAwesome5}
                  name="chevron-down"
                  size={moderateScale(16)}
                  color={COLOR.ORANGE}
                />
              </TouchableOpacity>
              {/* {!!verifyAddressErrors.provinceError && (
                <Text style={styles.errorMessage}>{verifyAddressErrors.provinceError}</Text>
              )} */}
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>City or Municipality</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.selectionContainer,
                  styles.shadow,
                ]}
                onPress={() => setModalCityVisible(true)}>
                {selectedCity == '' ? (
                  <Text style={[styles.selectionText, {color: COLOR.DARK}]}>Select City</Text>
                ) : (
                  <Text style={styles.selectionText}>{province}</Text>
                )}
                <VectorIcon
                  iconSet={ICON_SET.FontAwesome5}
                  name="chevron-down"
                  size={moderateScale(16)}
                  color={COLOR.ORANGE}
                />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput
                style={styles.input}
                value={address.postalCode}
                onChangeText={value => {
                  changeAddress('postalCode', value);
                }}
                placeholderTextColor={COLOR.DARK}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <PreviousNextButton label="Previous" labelTwo={"Next"} hasShadow onPressNext={Next} onPressPrevious={Previous}/>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flex: 1,
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
  mainInput: {
    flex: 1,
    padding: 16,
  },
  proceedBtn: {
    flex: 1,
    marginBottom: 26,
    marginTop: 20,
  },
  label: {
    fontFamily: FONT.BOLD,
    marginBottom: moderateScale(5),
    color: '#525252',
    fontSize: FONT_SIZE.S,
  },
  labelText: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
  },
  labelSmall: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    color: '#929191',
  },
  ViewInput: {
    marginTop: 20,
  },
  input: {
    paddingHorizontal: 10,
    height: SIZE.FORM_HEIGHT,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    marginTop: 5,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  information: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    color: '#525252',
    marginTop: 5,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  selectionText: {
    flex: 1,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
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
  errorBorder: {
    borderColor: COLOR.RED,
    borderWidth: 1,
  },
});
