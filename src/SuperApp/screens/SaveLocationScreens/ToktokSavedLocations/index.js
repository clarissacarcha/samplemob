import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Animated,
  Image,
} from 'react-native';
import {COLOR, ORANGE, COLORS} from '../../../../res/constants';
import {
  PREF_GET_SAVED_ADDRESS,
  PREF_GET_SAVED_ADDRESSES,
  PREF_USER_ADDRESS_DELETE,
  TOKTOK_ADDRESS_CLIENT,
} from '../../../../graphql';
import {HeaderBack, HeaderTitle} from '../../../../components';
import React, {useState, useCallback} from 'react';
import CONSTANTS from '../../../../common/res/constants';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {
  ConfirmOperationAddressModal,
  SuccesOperationAddressModal,
  InfoAddressModal,
  SavedLocationCard,
} from '.././Components';
import DeleteImg from '../../../../assets/icons/deleteIcon.png';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {ThrottledHighlight, ThrottledOpacity} from '../../../../components_section';
import {connect} from 'react-redux';
import {onError} from '../../../../util/ErrorUtility';
import {useFocusEffect} from '@react-navigation/native';
import normalize from 'react-native-normalize';

const imageWidth = Dimensions.get('window').width - 200;

const SavedLocations = ({navigation, session, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Saved', 'Address']} />,
  });
  const [showConfirmOperationAddressModal, setShowConfirmOperationAddressModal] = useState(false);
  const [showSuccessOperationModal, setShowSuccessOperationModal] = useState(false);
  const [showInfoAddressModal, setShowInfoAddressModal] = useState(false);
  const [infoModalType, setInfoModalType] = useState(false);
  const [addressId, setAddressId] = useState();
  const [isOfficeTaken, setIsOfficeTaken] = useState(true);
  const [isHomeTaken, setIsHomeTaken] = useState(true);

  const [prefUserAddressDelete] = useMutation(PREF_USER_ADDRESS_DELETE, {
    client: TOKTOK_ADDRESS_CLIENT,
    onError: onError,
    onCompleted: () => {
      prefGetSavedAddresses();
      setShowConfirmOperationAddressModal(false);
      setShowSuccessOperationModal(true);
    },
  });

  const [prefGetSavedAddresses, {data}] = useLazyQuery(PREF_GET_SAVED_ADDRESSES, {
    client: TOKTOK_ADDRESS_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: res => {
      res.prefGetSavedAddresses.find(item => item.isOffice) ? setIsOfficeTaken(true) : setIsOfficeTaken(false);
      res.prefGetSavedAddresses.find(item => item.isHome) ? setIsHomeTaken(true) : setIsHomeTaken(false);
    },
    onError: onError,
  });

  const [prefGetSavedAddress] = useLazyQuery(PREF_GET_SAVED_ADDRESS, {
    client: TOKTOK_ADDRESS_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: res => {
      navigation.push('ToktokAddEditLocation', {addressObj: res.prefGetSavedAddress, isHomeTaken, isOfficeTaken});
    },
    onError: onError,
  });

  const onPressAddress = address => {
    if (route?.params?.getAddressObj) {
      navigation.pop();
      route.params.getAddressObj(address);
    } else {
      prefGetSavedAddress({
        variables: {
          input: {
            id: address.id,
          },
        },
      });
    }
  };

  const confirmDelete = () => {
    prefUserAddressDelete({
      variables: {
        input: {
          id: addressId,
        },
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      prefGetSavedAddresses();
    }, []),
  );

  const initiateDeleteAddress = address => {
    if (address.isDefault) {
      setInfoModalType('DeleteDefault');
      setShowInfoAddressModal(true);
      return;
    }
    setShowConfirmOperationAddressModal(true);
    setAddressId(address?.id);
  };

  const toAddAddress = () => {
    if (data?.prefGetSavedAddresses.length >= 10) {
      setInfoModalType('MaxAddressReached');
      setShowInfoAddressModal(true);
      return;
    }
    navigation.push('ToktokAddEditLocation', {isHomeTaken, isOfficeTaken});
  };

  const rightSwipe = (item, progress, dragX) => {
    // const scale = dragX.interpolate({
    //   inputRange: [0, 900],
    //   outputRange: [1, 0],
    // });

    return (
      <ThrottledOpacity
        onPress={() => initiateDeleteAddress(item)}
        delay={4000}
        style={{alignItems: 'center', justifyContent: 'center'}}>
        <Animated.View style={[styles.deleteBtn]}>
          {/* <Animated.Text>Delete</Animated.Text> */}
          <Image source={DeleteImg} resizeMode={'contain'} style={{width: normalize(23), height: normalize(23)}} />
        </Animated.View>
      </ThrottledOpacity>
    );
  };

  if (false) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={COLOR} />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <InfoAddressModal
        visible={showInfoAddressModal}
        modalType={infoModalType}
        onSubmit={() => setShowInfoAddressModal(false)}
      />
      <SuccesOperationAddressModal
        visible={showSuccessOperationModal}
        onSubmit={() => setShowSuccessOperationModal(false)}
        operationType={'DELETE'}
      />

      <ConfirmOperationAddressModal
        visible={showConfirmOperationAddressModal}
        onReject={() => setShowConfirmOperationAddressModal(false)}
        onSubmit={confirmDelete}
        operationType={'DELETE'}
      />
      <FlatList
        style={{paddingTop: 16, backgroundColor: 'white'}}
        showsVerticalScrollIndicator={false}
        data={data?.prefGetSavedAddresses}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          const lastItem = index == data?.prefGetSavedAddresses.length - 1 ? true : false;
          return (
            <>
              {route?.params?.getAddressObj ? (
                <SavedLocationCard
                  lastItem={lastItem}
                  onPressAddress={onPressAddress}
                  address={item}
                  initiateDeleteAddress={initiateDeleteAddress}
                  setAddressId={setAddressId}
                />
              ) : (
                <Swipeable disabled={true} renderRightActions={() => rightSwipe(item)} overshootRight={false}>
                  <SavedLocationCard
                    lastItem={lastItem}
                    onPressAddress={onPressAddress}
                    address={item}
                    initiateDeleteAddress={initiateDeleteAddress}
                    setAddressId={setAddressId}
                  />
                </Swipeable>
              )}
            </>
          );
        }}
      />
      {!route?.params?.getAddressObj && (
        <View style={styles.submitContainer}>
          <TouchableHighlight onPress={toAddAddress} underlayColor={COLOR} style={{borderRadius: 5}}>
            <View style={styles.submit}>
              <Text style={styles.submitText}>Add Address</Text>
            </View>
          </TouchableHighlight>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  superApp: state.superApp,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const ToktokSavedLocations = connect(mapStateToProps, mapDispatchToProps)(SavedLocations);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  submitBox: {
    borderRadius: 5,
    margin: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  submit: {
    padding: 16,
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addLocText: {
    color: ORANGE,
    fontSize: 16,
  },
  addLocIcon: {
    width: 13,
    height: 13,
  },
  image: {
    height: imageWidth,
    width: imageWidth,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,

    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginVertical: 11,
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  deleteBtn: {
    alignSelf: 'center',
    backgroundColor: 'red',
    marginTop: 0,
    borderRadius: 5,
    justifyContent: 'center',
    marginRight: 16,
    marginBottom: 16,
    height: 90,
    paddingHorizontal: 16,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
