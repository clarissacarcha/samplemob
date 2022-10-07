import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Image, Pressable, BackHandler} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, DARK, MEDIUM, LIGHT, MAP_DELTA_LOW} from '../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../components';
import {DELETE_ADDRESS, PATCH_ADDRESS_CHANGES, POST_NEW_ADDRESS, TOKTOK_ADDRESS_CLIENT} from '../../../graphql';
import {onError} from '../../../util/ErrorUtility';
import {useMutation} from '@apollo/react-hooks';
import CONSTANTS from '../../../common/res/constants';
import ToggleSwitch from 'toggle-switch-react-native';

import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import ContactIcon from '../../../assets/icons/contacts.png';
import HomeIcon from '../../../assets/icons/SavedAddress/home.png';
import OfficeIcon from '../../../assets/icons/SavedAddress/office.png';
import CustomIcon from '../../../assets/icons/SavedAddress/custom.png';
import {currentLocation} from '../../../helper';
import {useFocusEffect} from '@react-navigation/native';
import {
  ConfirmOperationAddressModal,
  SuccesOperationAddressModal,
  UnsaveEditModal,
  InfoAddressModal,
} from './Components';
import {ThrottledOpacity} from '../../../components_section';

const AddLocation = ({navigation, route, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack={handleBackPress} />,
    headerTitle: () => <HeaderTitle label={[addressObj?.id ? 'Edit' : 'Add', 'Address']} />,
  });

  const {isFromLocationAccess, addressObj = null, showHome = true, showOffice = true} = route.params;

  const [locCoordinates, setLocCoordinates] = useState({});
  const [isEdited, setIsEdited] = useState(false);
  const [modalOperationType, setModalOperationType] = useState('');
  const [showConfirmOperationAddressModal, setShowConfirmOperationAddressModal] = useState(false);
  const [showSuccessOperationAddressModal, setShowSuccessOperationAddressModal] = useState(false);
  const [showUnsaveEditModal, setShowUnsaveEditModal] = useState(false);
  const [showInfoAddressModal, setShowInfoAddressModal] = useState(false);

  const [confirmedLocation, setConfirmedLocation] = useState(addressObj?.id ? addressObj : {});
  const [isHomeSelected, setIsHomeSelected] = useState(addressObj?.id ? addressObj.isHome : false);
  const [isOfficeSelected, setIsOfficeSelected] = useState(addressObj?.id ? addressObj.isOffice : false);
  const [isCustomSelected, setIsCustomSelected] = useState(addressObj?.label ? true : false);
  const [customLabel, setCustomLabel] = useState(addressObj?.id ? addressObj.label : '');
  const [isDefault, setIsDefault] = useState(addressObj?.id ? addressObj.isDefault : false);
  const [landmark, setLandMark] = useState(addressObj?.id ? addressObj.landmark : '');
  const [contactNumber, setContactNumber] = useState(addressObj?.id ? addressObj.contactDetails.mobile_no : '');
  const [contactName, setContactName] = useState(addressObj?.id ? addressObj.contactDetails.fullname : '');

  const [deleteAddress] = useMutation(DELETE_ADDRESS, {
    client: TOKTOK_ADDRESS_CLIENT,
    onError: onError,
    onCompleted: () => {
      setShowConfirmOperationAddressModal(false);
      setShowSuccessOperationAddressModal(true);
    },
  });

  const [patchAddressChanges, {loading: PACLoading}] = useMutation(PATCH_ADDRESS_CHANGES, {
    client: TOKTOK_ADDRESS_CLIENT,
    onCompleted: () => {
      setShowConfirmOperationAddressModal(false);
      setShowSuccessOperationAddressModal(true);
    },
    onError: onError,
  });

  const getCurrentLocation = async () => {
    const {latitude, longitude} = await currentLocation({showsReverseGeocode: false});
    setLocCoordinates({
      latitude: latitude,
      longitude: longitude,
      ...MAP_DELTA_LOW,
    });
  };

  const [postNewAddress, {loading}] = useMutation(POST_NEW_ADDRESS, {
    client: TOKTOK_ADDRESS_CLIENT,
    onCompleted: () => {
      setShowSuccessOperationAddressModal(true);
    },
    onError: onError,
  });

  useFocusEffect(
    useCallback(() => {
      if (addressObj?.id) {
        setLocCoordinates({
          latitude: addressObj?.place?.location?.latitude,
          longitude: addressObj?.place?.location?.longitude,
          ...MAP_DELTA_LOW,
        });
      } else {
        getCurrentLocation();
      }
    }, []),
  );

  const saveNewAddress = () => {
    setModalOperationType('CREATE');
    postNewAddress({
      variables: {
        input: {
          isHome: isHomeSelected,
          isOffice: isOfficeSelected,
          label: customLabel,
          isDefault: isFromLocationAccess ? true : isDefault,
          landmark: landmark,
          placeHash: confirmedLocation?.hash,
          contactDetails: {
            fullname: contactName,
            mobile_no: contactNumber,
          },
        },
      },
    });
  };

  // const checkAddressName = () => {
  //   if (isOfficeSelected) {
  //     setCustomLabel('');
  //   }
  // };

  const saveEditAddress = () => {
    const placeHash = confirmedLocation?.hash ? confirmedLocation?.hash : confirmedLocation?.placeHash;
    patchAddressChanges({
      variables: {
        input: {
          id: addressObj?.id,
          isHome: isHomeSelected,
          isOffice: isOfficeSelected,
          label: customLabel ? (isHomeSelected || isOfficeSelected ? '' : customLabel) : '',
          isDefault: isDefault,
          landmark: landmark,
          placeHash: placeHash,
          contactDetails: {
            fullname: contactName,
            mobile_no: contactNumber,
          },
        },
      },
    });
  };

  const confirmDeleteAddress = () => {
    deleteAddress({
      variables: {
        input: {
          id: addressObj?.id,
        },
      },
    });
  };

  const onAddressDelete = () => {
    if (addressObj?.isDefault) {
      setShowInfoAddressModal(true);
      return;
    }
    setShowConfirmOperationAddressModal(true);
    setModalOperationType('DELETE');
  };

  const onSearchMap = () => {
    navigation.navigate('PinLocation', {locCoordinates, setConfirmedLocation, addressObj, setIsEdited});
  };

  const selectAddressLabel = selected => {
    if (addressObj) {
      setIsEdited(true);
    }

    if (selected == 'Home') {
      setIsHomeSelected(true);
      setIsOfficeSelected(false);
      setIsCustomSelected(false);
    } else if (selected == 'Office') {
      setIsOfficeSelected(true);
      setIsHomeSelected(false);
      setIsCustomSelected(false);
    } else if (selected == 'Custom') {
      setIsOfficeSelected(false);
      setIsHomeSelected(false);
      setIsCustomSelected(true);
    }
  };

  const onSelectContact = number => {
    if (addressObj?.id) {
      setIsEdited(true);
    }
    setContactNumber(number);
  };

  const onPressContacts = () => {
    navigation.push('ToktokLoadContacts', {onSelectContact});
  };

  const goBackAfterSuccessPost = () => {
    setShowSuccessOperationAddressModal(false);
    navigation.pop();
  };

  const goToHome = () => {
    setShowSuccessOperationAddressModal(false);
    navigation.push('ConsumerLanding');
  };

  const showCustom = () => {
    if (!showOffice && !showHome) {
      return false;
    } else {
      return true;
    }
  };

  const handleBackPress = () => {
    if (isEdited) {
      setShowUnsaveEditModal(true);
    } else {
      navigation.pop();
    }
  };

  useEffect(() => {
    if (addressObj) return;

    if (showOffice && showHome) {
      setIsCustomSelected(false);
    } else {
      if (showOffice || showHome) {
        setIsCustomSelected(false);
      } else {
        setIsCustomSelected(true);
      }
    }
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackPress();
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, [isEdited]);

  return (
    <>
      <InfoAddressModal
        visible={showInfoAddressModal}
        modalType={'DeleteDefault'}
        onSubmit={() => setShowInfoAddressModal(false)}
      />
      <UnsaveEditModal
        visible={showUnsaveEditModal}
        onSubmit={() => {
          setShowUnsaveEditModal(false), navigation.pop();
        }}
        onReject={() => setShowUnsaveEditModal(false)}
      />
      <ConfirmOperationAddressModal
        visible={showConfirmOperationAddressModal}
        onSubmit={modalOperationType == 'UPDATE' ? saveEditAddress : confirmDeleteAddress}
        onReject={() => setShowConfirmOperationAddressModal(false)}
        operationType={modalOperationType}
      />
      <SuccesOperationAddressModal
        visible={showSuccessOperationAddressModal}
        onSubmit={isFromLocationAccess ? goToHome : goBackAfterSuccessPost}
        operationType={modalOperationType}
      />
      <ScrollView style={{flex: 1, backgroundColor: '#FFF'}}>
        <AlertOverlay visible={loading || PACLoading} />

        <View style={styles.labelContainer}>
          {showHome && (
            <TouchableOpacity onPress={() => selectAddressLabel('Home')}>
              <View style={[styles.labelBox, isHomeSelected ? styles.labelSelected : null]}>
                <Image source={HomeIcon} resizeMode={'contain'} style={styles.labelIcon} />
                <Text>Home</Text>
              </View>
            </TouchableOpacity>
          )}

          {showOffice && (
            <TouchableOpacity onPress={() => selectAddressLabel('Office')}>
              <View style={[styles.labelBox, isOfficeSelected ? styles.labelSelected : null]}>
                <Image source={OfficeIcon} resizeMode={'contain'} style={styles.labelIcon} />
                <Text>Office</Text>
              </View>
            </TouchableOpacity>
          )}

          {showCustom() && (
            <TouchableOpacity onPress={() => selectAddressLabel('Custom')}>
              <View style={[styles.labelBox, isCustomSelected ? styles.labelSelected : null]}>
                <Image source={CustomIcon} resizeMode={'contain'} style={styles.labelIcon} />
                <Text>Custom</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {isCustomSelected && (
          <>
            <Text style={styles.label}>Address Name</Text>
            <TextInput
              value={customLabel}
              onChangeText={
                addressObj?.id
                  ? value => {
                      setIsEdited(true), setCustomLabel(value);
                    }
                  : value => setCustomLabel(value)
              }
              style={styles.input}
              placeholderTextColor={LIGHT}
              returnKeyType="done"
            />
          </>
        )}

        <Text style={styles.label}>Address</Text>
        <Pressable onPress={onSearchMap}>
          <View pointerEvents="none">
            <TextInput
              numberOfLines={2}
              multiline
              value={confirmedLocation?.place?.formattedAddress}
              style={styles.input}
            />
          </View>
        </Pressable>

        <Text style={styles.label}>Landmark (optional)</Text>
        <Text style={styles.sublabel}>
          Complete address or landmark of nearby location for accurate and faster delivery.
        </Text>
        <TextInput
          value={landmark}
          onChangeText={
            addressObj?.id
              ? value => {
                  setIsEdited(true), setLandMark(value);
                }
              : value => setLandMark(value)
          }
          style={styles.input}
          multiline={true}
          placeholder="e.g. In front of sari-sari station "
          placeholderTextColor={LIGHT}
        />

        <View style={styles.lineDivider} />
        {!isFromLocationAccess && (
          <View style={styles.toggleContainer}>
            <Text>Set as default address</Text>
            {/*-------TO DO: ADD CONDITION----*/}
            <ToggleSwitch
              isOn={isDefault}
              onColor={CONSTANTS.COLOR.ORANGE}
              offColor={CONSTANTS.COLOR.MEDIUM}
              size="small"
              onToggle={
                addressObj?.id
                  ? () => {
                      setIsDefault(!isDefault), setIsEdited(true);
                    }
                  : () => setIsDefault(!isDefault)
              }
            />
          </View>
        )}
        <View style={styles.bottomlineDivider} />

        <Text style={[styles.label, {marginBottom: 0, color: 'black'}]}> Contact Details (optional)</Text>
        <View style={[styles.lineDivider, {marginHorizontal: 16, marginBottom: 0}]} />
        <Text style={styles.label}>Contact Name</Text>
        <TextInput
          value={contactName}
          onChangeText={
            addressObj?.id
              ? value => {
                  setContactName(value), setIsEdited(true);
                }
              : value => setContactName(value)
          }
          style={styles.input}
          placeholderTextColor={LIGHT}
          returnKeyType="done"
        />

        <Text style={styles.label}>Mobile Number</Text>
        <View
          style={{
            marginHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
              flex: 1,
              flexDirection: 'row',
              marginRight: 16,
              borderRadius: 10,
            }}>
            <View
              style={{
                borderRightColor: '#CCCCCC',
                borderRightWidth: 2,
                padding: 16,
                justifyContent: 'center',
              }}>
              <Text>+63</Text>
            </View>

            <TextInput
              value={contactNumber}
              onChangeText={
                addressObj?.id
                  ? value => {
                      setContactNumber(value), setIsEdited(true);
                    }
                  : value => setContactNumber(value)
              }
              maxLength={10}
              defaultValue={contactNumber ? contactNumber : ''}
              style={{padding: 16, flex: 1}}
              placeholderTextColor={LIGHT}
              returnKeyType="done"
            />
          </View>
          <TouchableOpacity onPress={() => onPressContacts()}>
            <View
              style={{backgroundColor: CONSTANTS.COLOR.ORANGE, padding: 10, borderRadius: 5, alignSelf: 'flex-end'}}>
              <Image source={ContactIcon} resizeMode={'contain'} style={{height: 35, width: 35}} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {!addressObj?.id && (
        <View style={styles.submitContainer}>
          <ThrottledOpacity delay={4000} onPress={saveNewAddress} underlayColor={COLOR} style={{borderRadius: 10}}>
            <View style={styles.submit}>
              <Text style={styles.submitText}>Save</Text>
            </View>
          </ThrottledOpacity>
        </View>
      )}

      {addressObj?.id && (
        <View style={[styles.submitContainer, styles.editAddressContainer]}>
          <ThrottledOpacity delay={4000} onPress={onAddressDelete} underlayColor={COLOR} style={{borderRadius: 10}}>
            <View style={styles.deleteButtonWraper}>
              <Text style={[styles.submitText, {color: CONSTANTS.COLOR.ORANGE}]}>Delete</Text>
            </View>
          </ThrottledOpacity>

          <ThrottledOpacity
            delay={4000}
            onPress={() => {
              setShowConfirmOperationAddressModal(true), setModalOperationType('UPDATE');
            }}
            underlayColor={COLOR}
            style={{borderRadius: 10}}>
            <View style={[styles.submit, {paddingHorizontal: '18%'}]}>
              <Text style={styles.submitText}>Save</Text>
            </View>
          </ThrottledOpacity>
        </View>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const ToktokAddLocation = connect(mapStateToProps, mapDispatchToProps)(AddLocation);

const styles = StyleSheet.create({
  labelSelected: {
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  labelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 16,
    marginBottom: 4,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  labelIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  labelContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  cardShadow: {
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    overflow: 'hidden',
  },
  submitBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginHorizontal: 16,
    backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
    borderRadius: 10,
    padding: 16,
    color: DARK,
  },
  sublabel: {
    marginBottom: 8,
    marginHorizontal: 16,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: MEDIUM,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  label: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: MEDIUM,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  map: {
    flex: 1,
  },
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  lineDivider: {
    marginVertical: 16,
    marginHorizontal: -16,
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
  },
  submitContainer: {
    paddingHorizontal: 32,
    paddingVertical: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  submitText: {
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  editAddressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButtonWraper: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '18%',
    height: 49,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    backgroundColor: CONSTANTS.COLOR.WHITE,
  },
  bottomlineDivider: {
    marginTop: 16,
    marginHorizontal: -16,
    borderBottomWidth: 8,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
  },
});
