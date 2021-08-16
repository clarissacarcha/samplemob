import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../../Components';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import DropDownPicker from 'react-native-dropdown-picker';

import {AddressModal} from './Components';
import {Platform} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {GET_CITIES} from '../../../../../graphql/toktokmall/model/Address';
import {TOKTOK_MALL_GRAPHQL_CLIENT} from '../../../../../graphql';
import {connect} from 'react-redux';

const Component = ({navigation, route, reduxActions: {updateUserAddress}, reduxStates: {user_address}}) => {
  const [newAddressForm, setNewAddressForm] = useState({
    city: null
  });
  const [cities, setCities] = useState([]);
  const [defaultCity, setDefaultCity] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [toUpdate, setToUpdate] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [open, setOpen] = useState(false);

  const onChangeText = (name, value) => {
    setNewAddressForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [getCities, {error, loading}] = useLazyQuery(GET_CITIES, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      if (response.getCities) {
        setCities(response.getCities.map((data) => ({label: data.citymunDesc, value: data.citymunCode})));
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    getCities();
  }, []);

  useEffect(() => {
    if (route.params?.update) {
      setNewAddressForm(route.params.item);
      if (route.params?.item?.defaultAdd) {
        setClicked(true);
      }
      if (!route.params?.item?.city) {
        setNewAddressForm(prevState => ({...prevState, city: null}));
      }
      setDefaultCity(route.params?.item?.city || null)
      setToUpdate(true);
    }
  }, [route]);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['New Address', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const onPress = () => {
    if (route.params?.update) {
      updateUserAddress('update', newAddressForm);
      if (clicked) {
        updateUserAddress('changeDefault', newAddressForm.id);
      }
    } else {
      updateUserAddress('add', {id: user_address.length + 1, ...newAddressForm});
      if (clicked) {
        updateUserAddress('changeDefault', user_address.length + 1);
      }
    }
    navigation.goBack();
  };
  console.log(defaultCity)
  return (
    <>
      {confirmDeleteModal && (
        <AddressModal
          type="Confirm"
          isVisible={confirmDeleteModal}
          setIsVisible={(val) => {
            setConfirmDeleteModal(val);
            setMessageModal(true);
            setTimeout(() => {
              // setMessageModal(false)
            }, 1400);
          }}
        />
      )}
      {messageModal && (
        <AddressModal
          type="Message"
          isVisible={messageModal}
          setIsVisible={(val) => {
            setMessageModal(val);
          }}
        />
      )}
      <View style={styles.container}>
        <View style={styles.partition1}>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              value={newAddressForm.receiverName}
              placeholder={'Full Name'}
              onChangeText={(text) => {
                onChangeText('receiverName', text);
              }}
            />
          </View>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              value={newAddressForm.receiverContact}
              placeholder={'Contact Number'}
              onChangeText={(text) => {
                onChangeText('receiverContact', text);
              }}
            />
          </View>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              placeholder={'Address(House #, Street, Village)'}
              value={newAddressForm.address}
              onChangeText={(text) => {
                onChangeText('address', text);
              }}
            />
          </View>
          <DropDownPicker
            containerStyle={styles.dropdownpicker}
            style={styles.dropdownpickerStyle}
            defaultValue={defaultCity}
            open={open}
            items={cities}
            setOpen={setOpen}
            onChangeItem={(item) => {
              console.log(item)
              onChangeText('city', item);
            }}
          />
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              placeholder={'Postal code (optional)'}
              value={newAddressForm.postalCode}
              onChangeText={(text) => {
                onChangeText('postalCode', text);
              }}
            />
          </View>
          <View style={styles.textinputLastContainer}>
            <TextInput
              style={styles.textinput}
              placeholder={'Landmarks/Exact Address/ Note to rider (optional)'}
              value={newAddressForm.landmark}
              onChangeText={(text) => {
                onChangeText('landMark', text);
              }}
            />
          </View>
        </View>
        <View style={styles.partition2}>
          <Text>Set as default address</Text>
          <TouchableOpacity
            onPress={() => {
              setClicked(!clicked);
            }}>
            {clicked ? (
              <Fontisto name={'radio-btn-active'} size={20} color={'#F6841F'} />
            ) : (
              <Fontisto name={'radio-btn-passive'} size={20} color={'#F6841F'} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.partition3}>
          {toUpdate && (
            <>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => {
                  setConfirmDeleteModal(true);
                }}>
                <Text style={{color: '#F6841F'}}>Delete</Text>
              </TouchableOpacity>
              <View style={{flex: 0.2}} />
            </>
          )}
          <TouchableOpacity
            style={styles.button1}
            onPress={() => {
              onPress();
            }}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const mapStateToProps = (state) => ({
  reduxStates: {
    user_address: state.toktokMall.user_address,
  },
});

const mapDispatchToProps = (dispatch) => ({
  reduxActions: {
    updateUserAddress: (action, payload) => dispatch({type: 'TOKTOKMALL_USER_ADDRESS', action, payload}),
  },
});

export const ToktokMallAddressesForm = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F7F7FA'},
  partition1: {padding: 15, backgroundColor: 'white', marginTop: 8, flex: 1.5},
  partition2: {
    padding: 15,
    backgroundColor: 'white',
    marginTop: 4,
    flex: 0.08,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partition3: {
    padding: 15,
    backgroundColor: 'white',
    marginTop: 4,
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textinputContainer: {
    padding: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: '#F8F8F8',
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'flex-start',
  },
  textinput: {marginLeft: 10},
  dropdownpicker: {
    marginLeft: 10,
    marginLeft: 0,
    borderWidth: 0,
    height: 40,
    backgroundColor: '#F8F8F8',
    marginTop: 10,
    borderRadius: 5,
  },
  dropdownpickerStyle: {
    marginLeft: 10,
    borderWidth: 0,
    backgroundColor: '#F8F8F8',
  },
  textinputLastContainer: {
    padding: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: '#F8F8F8',
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'flex-start',
    height: 130,
  },
  button1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6841F',
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 5,
  },
  button2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#F6841F',
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 5,
  },
  buttonText: {color: 'white'},
});
