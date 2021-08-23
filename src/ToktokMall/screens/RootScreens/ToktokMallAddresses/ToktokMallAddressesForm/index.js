import React, {useState, useEffect} from 'react';
import {StyleSheet, Platform, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Switch} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../../Components';
import {CityAddressModal, AddressModal} from './Components';
import Toast from "react-native-simple-toast"
import ToggleSwitch from 'toggle-switch-react-native';
import CustomIcon from "../../../../Components/Icons";
import axios from "axios";

import {useLazyQuery} from '@apollo/react-hooks';
import {GET_CITIES} from '../../../../../graphql/toktokmall/model/Address';
import {TOKTOK_MALL_GRAPHQL_CLIENT} from '../../../../../graphql';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { useStateCallback } from '../../../../helpers/useStateCallback';

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
  const [newDefault, setNewDefault] = useState(false);
  const [modalProvinceVisible, setModalProvinceVisible] = useState(false)
  const [fullname, setFullName] = useState("")
  const [contact, setContact] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState('Select City')
  const [postalCode, setPostalCode] = useState("")
  const [landmark, setLandmark] = useState("")
  const [provCode, setProvCode] = useState(0)
  const [munCode, setMunCode] = useState(0)
  const [regCode, setRegCode] = useState(0)
  const [validation, setValidation] = useStateCallback({
    validated: false,
    errors: []
  })

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
    // getCities();
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

  const SaveToRedux = () => {
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
  // console.log(defaultCity)

  const onSelectCity = (data) => {
    setCity(data.city)
    setProvCode(data.provCode)
    setMunCode(data.munCode)
    setRegCode(data.regCode)
  }

  const SavePostAddress = async () => {

    AsyncStorage.getItem("ToktokMallUser").then(async (raw) => {

      let data = JSON.parse(raw) || {}
      if(data.appSignature){

        let body = {
          customer_id: data.userId,
          receiver_name: newAddressForm.receiverName,
          receiver_contact: newAddressForm.receiverContact,
          address: newAddressForm.address,
          region_id: parseInt(regCode) || 0,
          province_id: parseInt(provCode),
          municipality_id: parseInt(munCode),
          landmark: newAddressForm.landMark,
          postal_code: newAddressForm.postalCode,
          default: clicked == true ? 1 : 0
        }

        console.log({body})

        let formData = new FormData()
        formData.append("signature", data.appSignature)
        formData.append("data", JSON.stringify(body))

        await axios.post(
          `http://ec2-18-176-178-106.ap-northeast-1.compute.amazonaws.com/toktokmall/save_address`,
          formData).then((response) => {
      
            if(response.data && response.data.success == 1){
              
              setMessageModal(true)
              SaveToRedux()

            }else{
              console.log("Response", response.data) 
            }

          }).catch((error) => {
            console.log(error)
        })

        // await AxiosUtil("save_address", data.appSignature, body, (res, data) => {

        //   if(res == "success"){
        //     setMessageModal(true)
        //     SaveToRedux()
        //   }

        // })

      }

    })
  }

  const addError = (field) => {
    setValidation(prevState => ({
      ...prevState,
      errors: [
        ...prevState.errors,
        field
      ]
    }))
  }

  const removeError = (field) => {
    setValidation(prevState => ({
      ...prevState,
      errors: prevState.errors.filter((error) => error !== field)
    }))
  }
  useEffect(() => {
    if(!newAddressForm.receiverName){
      addError("receiverName")
    }
    if(newAddressForm.receiverName){
      removeError("receiverName")
    }
    if(!newAddressForm.receiverContact){
      addError("receiverContact")
    }
    if(newAddressForm.receiverContact){
      removeError("receiverContact")
    }
    if(!newAddressForm.address){
      addError("address")
    }
    if(newAddressForm.address){
      removeError("address")
    }
    if(city === "Select City"){
      addError("city")
    }
    if(city !== "Select City"){
      removeError("city")
    }
  }, [newAddressForm, city])

  const onSubmitValidation = () => {
    setValidation(prevState => ({
      ...prevState,
      validated: true
    }), (state) => {
      if(state.validated && state.errors.length === 0){
        SavePostAddress()
      }else {
        Toast.show("Please fill up the required fields!")
      }
    })
  }

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
          message={"Address Deleted!"}
        />
      )}
      {messageModal && (
        <AddressModal
          type="Message"
          isVisible={messageModal}
          setIsVisible={(val) => {
            setMessageModal(val);
          }}
          message={"Address Added!"}
        />
      )}
      <CityAddressModal 
        modalProvinceVisible={modalProvinceVisible} 
        setModalProvinceVisible={setModalProvinceVisible} 
        city={city} 
        setCity={(data) => onSelectCity(data)}
      />
      <View style={styles.container}>
        <View style={styles.partition1}>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              value={newAddressForm.receiverName}
              placeholderTextColor={validation.validated && validation.errors?.includes("receiverName")? "red": "gray"}
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
              placeholderTextColor={validation.validated && validation.errors?.includes("receiverContact")? "red": "gray"}
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
              placeholderTextColor={validation.validated && validation.errors?.includes("address")? "red": "gray"}
              onChangeText={(text) => {
                onChangeText('address', text);
              }}
            />
          </View>
          {/* <DropDownPicker
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
          /> */}
          <TouchableOpacity onPress = {() => {setModalProvinceVisible(true)}}>
            <View style = {styles.textinputContainerRow}>
              <Text style = {[styles.text, {color: validation.validated && validation.errors?.includes("city")? "red": "gray"}]}>{city}</Text>
                <CustomIcon.EIcon 
                  name = {'chevron-down'}
                  size = {20}
                  color = {'#9E9E9E'}
                />
            </View>
          </TouchableOpacity>
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
          {/* <TouchableOpacity
            onPress={() => {
              setClicked(!clicked);
            }}>
            {clicked ? (
              <Fontisto name={'radio-btn-active'} size={20} color={'#F6841F'} />
            ) : (
              <Fontisto name={'radio-btn-passive'} size={20} color={'#F6841F'} />
            )}
          </TouchableOpacity> */}
          <ToggleSwitch 
            isOn = {clicked}
            // trackColor = {{ false: '#F8F8F8', true: '#FDBA1C'}}
            size = "medium"
            onColor = "#FDBA1C"
            offColor = "#F8F8F8"
            onToggle = {() => {
              setClicked(!clicked)
            }}
          />
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
              onSubmitValidation()
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
  buttonText: {color: 'white', fontSize: 14},
  text: {color: '#9E9E9E', marginLeft: 10},
  textinputContainerRow: {backgroundColor: '#F8F8F8', marginTop: 10,  borderRadius: 5, alignItems: 'center', flexDirection: 'row', padding: 10,
    justifyContent: 'space-between', 
  },
});
