import React, {useState, useCallback, useEffect} from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {BackHandler, Alert} from 'react-native';
import {connect} from 'react-redux';
import {MAP_DELTA_LOW} from '../../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import {onError} from '../../../../util/ErrorUtility';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {ScrollView} from 'react-native-gesture-handler';
import {currentLocation} from '../../../../helper';
import {useFocusEffect} from '@react-navigation/native';
import {AddressChip, AddressForm, AddressButtons} from './Sections';
import {
  PREF_USER_ADDRESS_DELETE,
  PREF_USER_ADDRESS_UPDATE,
  PREF_USER_ADDRESS_CREATE,
  TOKTOK_ADDRESS_CLIENT,
  PREF_GET_SAVED_ADDRESS,
} from '../../../../graphql';
import {
  ConfirmOperationAddressModal,
  SuccesOperationAddressModal,
  UnsaveEditModal,
  InfoAddressModal,
} from '.././Components';

const AddEditLocation = ({navigation, route, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack={handleBackPress} />,
    headerTitle: () => <HeaderTitle label={[addressObj?.id ? 'Edit' : 'Add', 'Address']} />,
  });

  const {
    addressIdFromService,
    coordsFromService = null,
    isFromLocationAccess = false,
    addressObj = null,
    isHomeTaken = false,
    isOfficeTaken = false,
  } = route.params;

  const [modalOperationType, setModalOperationType] = useState('');
  const [locCoordinates, setLocCoordinates] = useState({});
  const [isEdited, setIsEdited] = useState(false);
  const [showConfirmOperationAddressModal, setShowConfirmOperationAddressModal] = useState(false);
  const [showSuccessOperationAddressModal, setShowSuccessOperationAddressModal] = useState(false);
  const [showUnsaveEditModal, setShowUnsaveEditModal] = useState(false);
  const [showInfoAddressModal, setShowInfoAddressModal] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [errorAddressNameField, setErrorAddressNameField] = useState(false);
  const [errorAddressField, setErrorAddressField] = useState(false);

  const [confirmedLocation, setConfirmedLocation] = useState(addressObj?.id ? addressObj : {});
  const [isHomeSelected, setIsHomeSelected] = useState(addressObj?.id ? addressObj.isHome : false);
  const [isOfficeSelected, setIsOfficeSelected] = useState(addressObj?.id ? addressObj.isOffice : false);
  const [isCustomSelected, setIsCustomSelected] = useState(addressObj?.label ? true : false);
  const [customLabel, setCustomLabel] = useState(addressObj?.id ? addressObj.label : '');
  const [isDefault, setIsDefault] = useState(addressObj?.id ? addressObj.isDefault : false);
  const [landmark, setLandMark] = useState(addressObj?.id ? addressObj.landmark : '');
  const [contactNumber, setContactNumber] = useState(addressObj?.id ? addressObj.contactDetails.mobile_no : '');
  const [contactName, setContactName] = useState(addressObj?.id ? addressObj.contactDetails.fullname : '');

  const [prefUserAddressDelete] = useMutation(PREF_USER_ADDRESS_DELETE, {
    client: TOKTOK_ADDRESS_CLIENT,
    onError: onError,
    onCompleted: () => {
      setShowConfirmOperationAddressModal(false);
      setShowSuccessOperationAddressModal(true);
    },
  });

  const [prefUserAddressUpdate, {loading: PACLoading}] = useMutation(PREF_USER_ADDRESS_UPDATE, {
    client: TOKTOK_ADDRESS_CLIENT,
    onCompleted: () => {
      setShowConfirmOperationAddressModal(false);
      setShowSuccessOperationAddressModal(true);
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;

      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        console.log(graphQLErrors);
        graphQLErrors.map(({message, locations, path, code, errorFields}) => {
          if (code === 'INTERNAL_SERVER_ERROR') {
            Alert.alert('', 'Something went wrong.');
          } else if (code === 'USER_INPUT_ERROR') {
            Alert.alert('', message);
          } else if (code === 'BAD_USER_INPUT') {
            if (errorFields[0].field == 'label') {
              setErrorText(errorFields[0].message);
              setErrorAddressNameField(true);
            } else if (errorFields[0].field == 'formattedAddress') {
              setErrorText(errorFields[0].message);
              setErrorAddressField(true);
            } else {
              Alert.alert('', message);
            }
          } else if (code === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
  });

  const [prefGetSavedAddress, {loading: GALoading}] = useLazyQuery(PREF_GET_SAVED_ADDRESS, {
    client: TOKTOK_ADDRESS_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: res => {
      setConfirmedLocation(res.prefGetSavedAddress);
      setIsDefault(res.prefGetSavedAddress.isDefault);
      setIsHomeSelected(res.prefGetSavedAddress.isHome);
      setIsOfficeSelected(res.prefGetSavedAddress.isOffice);
      setIsCustomSelected(res.prefGetSavedAddress.label ? true : false);
      setCustomLabel(res.prefGetSavedAddress.label);
      setLandMark(res.prefGetSavedAddress.landmark);
      setContactNumber(res.prefGetSavedAddress.contactDetails.mobile_no);
      setContactName(res.prefGetSavedAddress.contactDetails.fullname);
      setLocCoordinates({
        latitude: res.prefGetSavedAddress.place.location.latitude,
        longitude: res.prefGetSavedAddress.place.location.longitude,
        ...MAP_DELTA_LOW,
      });
    },
    onError: onError,
  });

  const [prefUserAddressCreate, {loading}] = useMutation(PREF_USER_ADDRESS_CREATE, {
    client: TOKTOK_ADDRESS_CLIENT,
    onCompleted: () => {
      setShowSuccessOperationAddressModal(true);
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;

      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        console.log(graphQLErrors);
        graphQLErrors.map(({message, locations, path, code, errorFields}) => {
          if (code === 'INTERNAL_SERVER_ERROR') {
            Alert.alert('', 'Something went wrong.');
          } else if (code === 'USER_INPUT_ERROR') {
            Alert.alert('', message);
          } else if (code === 'BAD_USER_INPUT') {
            if (errorFields[0].field == 'label') {
              setErrorText(errorFields[0].message);
              setErrorAddressNameField(true);
            } else if (errorFields[0].field == 'formattedAddress') {
              setErrorText(errorFields[0].message);
              setErrorAddressField(true);
            } else {
              Alert.alert('', message);
            }
          } else if (code === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
  });

  const getCurrentLocation = async () => {
    const {latitude, longitude} = await currentLocation({showsReverseGeocode: false});
    setLocCoordinates({
      latitude: latitude,
      longitude: longitude,
      ...MAP_DELTA_LOW,
    });
  };

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
    if (!isHomeSelected && !isOfficeSelected && !customLabel) {
      setErrorAddressNameField(true);
      setErrorText('This is a required field');
      return;
    }

    if (!confirmedLocation?.hash) {
      setErrorAddressField(true);
      setErrorText('This is a required field');
      return;
    }

    setModalOperationType('CREATE');
    const detachedCustomLabel = customLabel ? removeEmoji(customLabel) : '';
    const detachedContactName = contactName ? removeEmoji(contactName) : '';
    prefUserAddressCreate({
      variables: {
        input: {
          isHome: isHomeSelected,
          isOffice: isOfficeSelected,
          label: customLabel ? detachedCustomLabel : '',
          isDefault: isFromLocationAccess ? true : isDefault,
          landmark: landmark,
          placeHash: confirmedLocation?.hash,
          contactDetails: {
            fullname: detachedContactName,
            mobile_no: contactNumber,
          },
        },
      },
    });
  };

  const saveEditAddress = () => {
    const detachedCustomLabel = customLabel ? removeEmoji(customLabel) : '';
    const detachedContactName = contactName ? removeEmoji(contactName) : '';
    const placeHash = confirmedLocation?.hash ? confirmedLocation?.hash : confirmedLocation?.placeHash;
    const addressId = addressObj?.id ? addressObj?.id : addressIdFromService;
    prefUserAddressUpdate({
      variables: {
        input: {
          id: addressId,
          isHome: isHomeSelected,
          isOffice: isOfficeSelected,
          label: customLabel ? (isHomeSelected || isOfficeSelected ? '' : detachedCustomLabel) : '',
          isDefault: isDefault,
          landmark: landmark,
          placeHash: placeHash,
          contactDetails: {
            fullname: detachedContactName,
            mobile_no: contactNumber,
          },
        },
      },
    });
  };

  const removeEmoji = input => {
    return input.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
  };

  const confirmDeleteAddress = () => {
    prefUserAddressDelete({
      variables: {
        input: {
          id: addressObj?.id,
        },
      },
    });
  };

  const initiateSaveEdit = () => {
    const placeHash = confirmedLocation?.hash ? confirmedLocation?.hash : confirmedLocation?.placeHash;

    if (!isHomeSelected && !isOfficeSelected && !customLabel) {
      setErrorAddressNameField(true);
      setErrorText('This is a required field');
      return;
    }

    if (!placeHash) {
      setErrorAddressField(true);
      setErrorText('This is a required field');
      return;
    }

    setShowConfirmOperationAddressModal(true), setModalOperationType('UPDATE');
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
    navigation.navigate('ToktokPinLocation', {
      locCoordinates,
      confirmedLocation,
      setConfirmedLocation,
      addressObj,
      setIsEdited,
      setErrorAddressField,
      isFromLocationAccess,
    });
  };

  const selectAddressLabel = selected => {
    setErrorAddressNameField(false);
    setErrorAddressField(false);
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

  const onSelectContact = item => {
    if (addressObj?.id) {
      setIsEdited(true);
    }
    if (item.number.charAt(0) == '0') {
      setContactNumber(item.number.substring(1));
    } else {
      setContactNumber(item.number);
    }
    setContactName(item.name);
  };

  const onPressContacts = () => {
    navigation.push('ContactsScreen', {onSelectContact});
  };

  const goBackAfterSuccessPost = () => {
    setShowSuccessOperationAddressModal(false);
    navigation.pop();
  };

  const goToHome = () => {
    setShowSuccessOperationAddressModal(false);
    navigation.pop();
    navigation.replace('ConsumerLanding');
  };

  const showCustomFunc = () => {
    if (isOfficeTaken && isHomeTaken) {
      if (addressObj && !addressObj?.label) {
        return true;
      } else {
        return false;
      }
    } else {
      if (!isOfficeTaken || !isHomeTaken) {
        return true;
      } else {
        return false;
      }
    }
  };

  const showHomeFunc = () => {
    if (!addressObj) {
      return !isHomeTaken;
    } else {
      if (isHomeTaken && addressObj?.isHome) {
        return true;
      } else if (!isHomeTaken) {
        return true;
      } else {
        return false;
      }
    }
  };

  const showOfficeFunc = () => {
    if (!addressObj) {
      return !isOfficeTaken;
    } else {
      if (isOfficeTaken && addressObj?.isOffice) {
        return true;
      } else if (!isOfficeTaken) {
        return true;
      } else {
        return false;
      }
    }
  };

  const showToggleFunc = () => {
    if (isFromLocationAccess || addressObj?.isDefault) {
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

  const onMobileChange = value => {
    if (value.length == 1 && value == '0') {
      setContactNumber('');
      return;
    }

    if (addressObj?.id) {
      setContactNumber(value), setIsEdited(true);
    } else {
      setContactNumber(value);
    }
  };

  useEffect(() => {
    if (addressIdFromService) {
      prefGetSavedAddress({
        variables: {
          input: {
            id: addressIdFromService,
          },
        },
      });
    }

    if (coordsFromService) {
      let coordinates = {
        latitude: coordsFromService?.latitude,
        longitude: coordsFromService?.longitude,
        ...MAP_DELTA_LOW,
      };
      // onSearchMap();
      navigation.navigate('ToktokPinLocation', {
        locCoordinates: coordinates,
        setConfirmedLocation,
        addressObj,
        setIsEdited,
        setErrorAddressField,
      });
    }

    if (addressObj) return;

    if (!isHomeTaken && !isOfficeTaken) {
      setIsHomeSelected(true);
      setIsCustomSelected(false);
    } else if (isHomeTaken && !isOfficeTaken) {
      setIsOfficeSelected(true);
    } else if (!isHomeTaken && isOfficeTaken) {
      setIsHomeSelected(true);
    } else {
      if (!isOfficeTaken || !isHomeTaken) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
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
        <AlertOverlay visible={loading || PACLoading || GALoading} />
        <AddressChip
          selectAddressLabel={selectAddressLabel}
          showHomeFunc={showHomeFunc}
          showOfficeFunc={showOfficeFunc}
          showCustomFunc={showCustomFunc}
          isHomeSelected={isHomeSelected}
          isOfficeSelected={isOfficeSelected}
          isCustomSelected={isCustomSelected}
        />
        <AddressForm
          addressObj={addressObj}
          errorText={errorText}
          isCustomSelected={isCustomSelected}
          setIsEdited={setIsEdited}
          customLabel={customLabel}
          setCustomLabel={setCustomLabel}
          errorAddressNameField={errorAddressNameField}
          setErrorAddressNameField={setErrorAddressNameField}
          onSearchMap={onSearchMap}
          confirmedLocation={confirmedLocation}
          errorAddressField={errorAddressField}
          landmark={landmark}
          setLandMark={setLandMark}
          showToggleFunc={showToggleFunc}
          isDefault={isDefault}
          setIsDefault={setIsDefault}
          contactName={contactName}
          setContactName={setContactName}
          contactNumber={contactNumber}
          onMobileChange={onMobileChange}
          onPressContacts={onPressContacts}
        />
      </ScrollView>
      <AddressButtons
        saveNewAddress={saveNewAddress}
        initiateSaveEdit={initiateSaveEdit}
        onAddressDelete={onAddressDelete}
        addressObj={addressObj}
        addressIdFromService={addressIdFromService}
      />
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const ToktokAddEditLocation = connect(mapStateToProps, mapDispatchToProps)(AddEditLocation);
