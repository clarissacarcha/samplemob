import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Picker,
  Platform,
  Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, FONT} from '../../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../../Components';
import Address from './components/Adress';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_MALL_GRAPHQL_CLIENT} from '../../../../../graphql';
import {GET_CUSTOMER_ADDRESSES} from '../../../../../graphql/toktokmall/model';
import {Loading} from '../../../../Components';
import AsyncStorage from '@react-native-community/async-storage';
import { GeolocationUtility } from '../../../../util';
import CustomIcon from "../../../../Components/Icons";
import Swipeable from 'react-native-swipeable';
import { AddressModal } from '../ToktokMallAddressesForm/Components';
import axios from 'axios';
import { EventRegister } from "react-native-event-listeners"

import CheckBox from 'react-native-check-box';

import { ApiCall } from '../../../../helpers';
import Toast from 'react-native-simple-toast';

const Component = ({route, navigation, reduxStates: {user_address, defaultAddress}, reduxActions: {updateUserAddress, setDefaultUserAddress}}) => {

  const [user, setUser] = useState({});
  const [defaultId, setDefaultID] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
  const [activeToDeleteItem, setActiveToDeleteItem] = useState({
    value: false,
    ids: []
  })
  const [singleItemDelete, setSingleItemDelete] = useState(null)

  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack={() => {
      
      if(route.params?.onGoBack){
        route.params?.onGoBack()
      }

      navigation.goBack()

    }} />,
    headerTitle: () => <HeaderTitle label={['Address', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  const [getAddresses, {error, loading}] = useLazyQuery(GET_CUSTOMER_ADDRESSES, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: async ({getCustomerAddresses}) => {
      // const userAdressTemp = await JSON.parse(AsyncStorage.getItem("TOKTOKMALL_USER_ADDRESS"))
      // if(userAdressTemp){
      //   updateUserAddress('set', userAdressTemp)
      // } else if (!temp && response.getCustomerAddresses) {
        // updateAddress(response)
      // }
      console.log(getCustomerAddresses)
      if(getCustomerAddresses){
        console.log("getCustomerAddresses", getCustomerAddresses)
        setAddresses(getCustomerAddresses)
      }
    },
    onError: (err) => {
      console.log(err)
      getAddresses({variables: {input: {userId: user.userId}}})
    },
  });

  useEffect(() => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw) || {}
      if(data.userId){
        setUser(data)
      }
    })
    EventRegister.addEventListener("refreshAddress", () => 
    getAddressData())
  }, []);

  useEffect(() => {
    if(user.userId){
      getAddressData()
    }
  },[user])

  const getAddressData = () => getAddresses({variables: {input: {userId: user.userId}}})

  const DeleteButton = ({onPress, disabled}) => {
		return (
      <>
        <TouchableOpacity
          disabled={disabled}
          onPress={onPress}
          activeOpacity={1}
          style={[
            styles.addressContainer,
            {
              flex: 1,
              marginHorizontal: 15,
              width: 75,
              backgroundColor: disabled ? '#D7D7D7' : '#F6841F',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          {/* <Text style={{fontSize: 14, color: '#fff'}}>Delete</Text> */}
          <CustomIcon.FoIcon name="trash" size={20} color={'white'} />
        </TouchableOpacity>
      </>
    );
	};

  const SetDefaultAddress = async (id) => {

    const raw = await AsyncStorage.getItem("ToktokMallUser")
    const userdata = JSON.parse(raw)

    if(!userdata || !userdata?.userId) return

    let body = {
      address_id: id,
      customer_id: userdata.userId
    };

    const req = await ApiCall("default_address", body, false, "inline")

    if(req.responseData && req.responseData.success == 1){
      init()
    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }
    
  };

  const renderAddresses = () => {
    
    return addresses.map((item) => {
      const Wrapper = activeToDeleteItem.value ? View : Swipeable
      const props = activeToDeleteItem.value
        ? {}
        : {
            rightActionActivationDistance: 25,
            onRightActionRelease: () => setActiveToDeleteItem(item.id),
            rightButtonWidth: 75,
            rightButtons: [
              <DeleteButton
                disabled={item.defaultAdd == 1}
                onPress={() => {
                  setSingleItemDelete(item.id)
                  setConfirmDeleteModal(true);
                }}
              />,
            ],
          };

      const onClickCheckbox = () => {
        if(activeToDeleteItem.ids?.includes(item.id)){
          setActiveToDeleteItem(prevState => ({...prevState, ids: prevState.ids.filter(id => id !== item.id)}))
        }else{
          setActiveToDeleteItem(prevState => ({...prevState, ids: [...prevState.ids || [], item.id]}))
        }
      }

      return (
        <Wrapper {...props}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {activeToDeleteItem.value && (
              <CheckBox
                disabled={item.defaultAdd === 1}
                isChecked={activeToDeleteItem.ids?.includes(item.id)}
                onClick={onClickCheckbox}
                checkedCheckBoxColor="#F6841F"
                uncheckedCheckBoxColor={item.defaultAdd === 1 ? '#D7D7D7' : '#F6841F'}
              />
            )}
            <TouchableOpacity
              style={[styles.addressContainer, {flexGrow: 1, marginLeft: 5}]}
              onLongPress={() => setActiveToDeleteItem((prevState) => ({...prevState, value: true}))}
              onPress={() => {
                navigation.navigate('ToktokMallAddressesForm', {item, update: true});
              }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.addressfullName}>{item.receiverName}</Text>
                {item.defaultAdd == 1 ? <Text style={styles.addressdefaultText}>Default</Text> : null}
              </View>
              <Text style={styles.addresscontact_number}>{item.receiverContact}</Text>
              <Text style={styles.addressText}>{item.fullAddress || item.address}</Text>
            </TouchableOpacity>
          </View>
        </Wrapper>
      );
    });
  };

  const deleteAddress = async (id) => {
    AsyncStorage.getItem('ToktokMallUser').then(async (raw) => {
      let data = JSON.parse(raw) || {};
      if (data.appSignature) {

        let body = {
          address_id: `${id}`
        };

        let formData = new FormData();
        formData.append('signature', data.appSignature);
        formData.append('data', JSON.stringify(body));
        updateUserAddress('remove', id);

        await axios
          .post(`http://ec2-18-176-178-106.ap-northeast-1.compute.amazonaws.com/toktokmall/delete_address`, formData)
          .then(async (response) => {
            console.log("response.data", response.data)
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  const deleteMultipleAddress = async () => {
    await activeToDeleteItem.ids.map(async id => await deleteAddress(id))
    setActiveToDeleteItem((prevState) => ({
      ...prevState,
      ids: [],
    }));
  }
  const disabledSelectAll =
    activeToDeleteItem.ids?.length !== 0 &&
    activeToDeleteItem.ids?.length === addresses.filter((address) => address.defaultAdd !== 1)?.length;

    console.log("deleteSuccessModal", deleteSuccessModal)

  return (
    <>
      <ScrollView>
        {deleteSuccessModal && (
          <AddressModal
            type="Message"
            isVisible={deleteSuccessModal}
            setIsVisible={async (val) => {
              setDeleteSuccessModal(val);
              await getAddressData();
            }}
            message={'Address Deleted!'}
          />
        )}

        {confirmDeleteModal && (
          <AddressModal
            type="Confirm"
            isVisible={confirmDeleteModal}
            setIsVisible={(val) => {
              setConfirmDeleteModal(val);
            }}
            onConfirm={async () => {
              if (activeToDeleteItem.value) {
                await deleteMultipleAddress();
              } else {
                await deleteAddress(singleItemDelete);
              }
              setTimeout(() => {
                setDeleteSuccessModal(true);
              }, 1000)
            }}
          />
        )}
        <View style={styles.body}>
          {activeToDeleteItem.value && (
            <View
              style={[
                styles.container,
                {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -5},
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  isChecked={disabledSelectAll}
                  onClick={() => {
                    if (activeToDeleteItem.ids?.length === addresses.filter((address) => address.defaultAdd !== 1)?.length) {
                      setActiveToDeleteItem((prevState) => ({
                        ...prevState,
                        ids: [],
                      }));
                    } else {
                      const test = [];
                      addresses.map((item) => item.defaultAdd !== 1 && test.push(item.id));
                      setActiveToDeleteItem((prevState) => ({
                        ...prevState,
                        ids: test,
                      }));
                    }
                  }}
                  checkedCheckBoxColor="#F6841F"
                  uncheckedCheckBoxColor="#F6841F"
                />
                <Text style={{marginLeft: 5, fontWeight: '700'}}>Select All</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveToDeleteItem((prevState) => ({...prevState, value: false}))}>
                <Text style={{color: '#F6841F'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={[
              styles.container,
              {
                height: activeToDeleteItem.value
                  ? Dimensions.get('screen').height - 200
                  : Dimensions.get('screen').height - 140,
              },
            ]}>
            {renderAddresses()}
            {addresses.length < 10 && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('ToktokMallAddressesForm');
                }}>
                <Text>Add new address</Text>
                <AntDesign name={'plus'} color={'#F6841F'} size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {activeToDeleteItem.value && (
        <View style={{position: 'absolute', bottom: 10, alignItems: 'center', width: Dimensions.get('screen').width}}>
          <TouchableOpacity
            disabled={activeToDeleteItem.ids?.length === 0}
            onPress={() => {
              setConfirmDeleteModal(true);
            }}
            style={{
              backgroundColor: activeToDeleteItem.ids?.length === 0 ? '#D7D7D7' : '#F6841F',
              paddingHorizontal: 50,
              paddingVertical: 15,
              marginBottom: 10,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white', fontWeight: '700'}}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  reduxStates: {
    user_address: state.toktokMall.user_address,
    defaultAddress: state.toktokMall.defaultAddress
  },
});

const mapDispatchToProps = (dispatch) => ({
  reduxActions: {
    updateUserAddress: (action, payload) => {
      dispatch({type: 'TOKTOKMALL_USER_ADDRESS', action, payload});
    },
    setDefaultUserAddress: (action, payload) => {
      dispatch({type: 'CREATE_DEFAULT_ADDRESS_SESSION', action, payload});
    },
  },
});

export const ToktokMallAddressesMenu = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA'},
  container: {padding: 15, backgroundColor: 'white', marginTop: 8, flex: 1},
  addressContainer: {borderRadius: 5, backgroundColor: '#F8F8F8', padding: 10, marginTop: 10, marginBottom: 10},
  defaultText: {color: '#F6841F'},
  fullName: {},
  contact_number: {color: '#9E9E9E'},
  address: {marginTop: 10, fontWeight: 'bold'},
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    height: 50,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 0.0001,
    borderWidth: 0.2,
    borderColor: '#F8F8F8',
  },
  addressContainer: {borderRadius: 5, backgroundColor: '#F8F8F8', padding: 10, marginTop: 10, marginBottom: 10},
  addressdefaultText: {color: '#F6841F'},
  addressfullName: {textTransform: 'capitalize', fontSize: 14, fontFamily: FONT.REGULAR},
  addresscontact_number: {color: '#9E9E9E'},
  addressText: {marginTop: 10, fontSize: 13, fontFamily: FONT.REGULAR, textTransform: 'capitalize'},
});
