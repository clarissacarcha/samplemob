import React, {useState, useCallback, useEffect} from 'react';
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
  DELETE_ADDRESS,
  PATCH_ADDRESS_CHANGES,
  POST_NEW_ADDRESS,
  TOKTOK_ADDRESS_CLIENT,
  GET_ADDRESS,
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
    isFromLocationAccess,
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

  const [getAddress, {loading: GALoading}] = useLazyQuery(GET_ADDRESS, {
    client: TOKTOK_ADDRESS_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: res => {
      setConfirmedLocation(res.getAddress);
      setIsDefault(res.getAddress.isDefault);
      setIsHomeSelected(res.getAddress.isHome);
      setIsOfficeSelected(res.getAddress.isOffice);
      setIsCustomSelected(res.getAddress.label ? true : false);
      setCustomLabel(res.getAddress.label);
      setLandMark(res.getAddress.landmark);
      setContactNumber(res.getAddress.contactDetails.mobile_no);
      setContactName(res.getAddress.contactDetails.fullname);
      setLocCoordinates({
        latitude: res.getAddress.place.location.latitude,
        longitude: res.getAddress.place.location.longitude,
        ...MAP_DELTA_LOW,
      });
    },
    onError: onError,
  });

  const [postNewAddress, {loading}] = useMutation(POST_NEW_ADDRESS, {
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
    postNewAddress({
      variables: {
        input: {
          isHome: isHomeSelected,
          isOffice: isOfficeSelected,
          label: customLabel ? customLabel : '',
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

  const saveEditAddress = () => {
    const placeHash = confirmedLocation?.hash ? confirmedLocation?.hash : confirmedLocation?.placeHash;
    const addressId = addressObj?.id ? addressObj?.id : addressIdFromService;
    patchAddressChanges({
      variables: {
        input: {
          id: addressId,
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
      setConfirmedLocation,
      addressObj,
      setIsEdited,
      setErrorAddressField,
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
      getAddress({
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
    </>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const ToktokAddEditLocation = connect(mapStateToProps, mapDispatchToProps)(AddEditLocation);
