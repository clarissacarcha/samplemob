import React, {useState, useEffect} from 'react';
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

const Component = ({route, navigation, reduxStates: {user_address, defaultAddress}, reduxActions: {updateUserAddress, setDefaultUserAddress}}) => {
  const [data, setData] = useState([]);
  const [defaultId, setDefaultID] = useState(0);

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

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
    // variables: {
    //   input: {
    //     userId: 1024,
    //   },
    // },
    onCompleted: async (response) => {
      // const userAdressTemp = await JSON.parse(AsyncStorage.getItem("TOKTOKMALL_USER_ADDRESS"))
      // if(userAdressTemp){
      //   updateUserAddress('set', userAdressTemp)
      // } else if (!temp && response.getCustomerAddresses) {
        updateAddress(response)
      // }
    },
    onError: (err) => console.log(err),
  });
  const updateAddress = (response) => {
    user_address.length === 0 && updateUserAddress('set', response.getCustomerAddresses);
  }

  useEffect(() => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw) || {}
      if(data.userId){
        console.log(data.userId)
        getAddresses({variables: {input: {userId: data.userId}}})
      }
    })
  }, []);
  const DeleteButton = ({onPress}) => {
		return (
		  <>
			<TouchableOpacity
			  onPress={onPress}
			  activeOpacity={1}
			  style={[styles.addressContainer,{flex: 1, marginHorizontal: 15,  width: 75, backgroundColor: '#F6841F', alignItems: 'center', justifyContent: 'center'}]}>
			  {/* <Text style={{fontSize: 14, color: '#fff'}}>Delete</Text> */}
				<CustomIcon.FoIcon name="trash" size={20} color={"white"} />
			</TouchableOpacity>
		  </>
		);
	};

  const renderAddresses = () => {
    
    return user_address.map((item) => {
      // console.log(item.fullAddress)
      return (
        <Swipeable 
					rightActionActivationDistance={30}
					rightButtonWidth={75}
					rightButtons={[<DeleteButton onPress={() => {
						setConfirmDeleteModal(true)
						
					}} />]}
				>

      {confirmDeleteModal && (
        <AddressModal
          type="Confirm"
          isVisible={confirmDeleteModal}
          setIsVisible={(val) => {
            setConfirmDeleteModal(val);
          }}
          onConfirm={() => {
            deleteAddress(item.id)
          }}
        />
      )}
        <TouchableOpacity
          style={styles.addressContainer}
          onLongPress={() => {
            navigation.navigate('ToktokMallAddressesForm', {item, update: true});
          }}
          onPress={async () => {
            console.log(item)
            updateUserAddress("changeDefault", item.id);
            setDefaultUserAddress("set", item);

            console.log(item)
            // const coords = await GeolocationUtility.getCoordinatesFromAddress(`${item.fullAddress} Philippines`)
            // if(coords){
            //   AsyncStorage.setItem("ToktokMallUserCoords", JSON.stringify(coords))
            // }

          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.addressfullName}>{item.receiverName}</Text>
            {/* {item.defaultAdd == 1 ? <Text style={styles.addressdefaultText}>Default</Text> : null} */}
            {defaultAddress && item.id == defaultAddress.id ? <Text style={styles.addressdefaultText}>Default</Text> : null}
          </View>
          <Text style={styles.addresscontact_number}>{item.receiverContact}</Text>
          <Text style={styles.addressText}>{item.fullAddress || item.address}</Text>
        </TouchableOpacity></Swipeable>
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
            setDeletedModal(true)
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

  return (
    <>
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.container}>
            {renderAddresses()}
            {user_address.length < 10 && (
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
