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

const Component = ({route, navigation, reduxStates: {user_address}, reduxActions: {updateUserAddress}}) => {
  const [data, setData] = useState([]);
  const [defaultId, setDefaultID] = useState(0);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
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
          updateUserAddress('set', response.getCustomerAddresses);
      // }
    },
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      let data = JSON.parse(raw) || {}
      if(data.userId){
        console.log(data.userId)
        getAddresses({variables: {input: {userId: data.userId}}})
      }
    })
  }, []);

  const renderAddresses = () => {
    return user_address.map((item) => {
      return (
        <TouchableOpacity
          style={styles.addressContainer}
          onLongPress={() => {
            navigation.navigate('ToktokMallAddressesForm', {item, update: true});
          }}
          onPress={() => {
            updateUserAddress("changeDefault", item.id);
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.addressfullName}>{item.receiverName}</Text>
            {item.defaultAdd == 1 ? <Text style={styles.addressdefaultText}>Default</Text> : null}
          </View>
          <Text style={styles.addresscontact_number}>{item.receiverContact}</Text>
          <Text style={styles.addressText}>{item.address}</Text>
        </TouchableOpacity>
      );
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
  },
});

const mapDispatchToProps = (dispatch) => ({
  reduxActions: {
    updateUserAddress: (action, payload) => {
      dispatch({type: 'TOKTOKMALL_USER_ADDRESS', action, payload});
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
