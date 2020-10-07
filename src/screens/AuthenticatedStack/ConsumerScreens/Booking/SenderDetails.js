import React, {useState} from 'react';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {View, Text, StyleSheet, TouchableHighlight, TextInput, Platform, Alert} from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import validator from 'validator';

import {reverseGeocode} from '../../../../helper';
import {HeaderBack, HeaderTitle, SchedulePicker, AlertOverlay} from '../../../../components';
import {BlackIcon, BlackButton} from '../../../../components/ui';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT, COLOR_UNDERLAY} from '../../../../res/constants';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign';

const SenderDetails = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Sender', 'Details']} />,
  });

  const {data, setData, setPrice} = route.params;
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState(data);

  const onSearchMap = () => {
    navigation.navigate('SearchMap', {data: {...localData, ...MAP_DELTA_LOW}, setData: setLocalData});
  };

  const onSearchPlaces = () => {
    navigation.navigate('SearchPlaces', {data: localData, setData: setLocalData});
  };

  const onScheduleChange = (value) => setLocalData({...localData, ...value});
  const onLandmarkChange = (value) => setLocalData({...localData, landmark: value});
  const onNameChange = (value) => setLocalData({...localData, name: value});
  // const onMobileChange = value => setLocalData({...localData, mobile: value});

  const onMobileChange = (value) => {
    if (value.length === 1 && value === '0') {
      setLocalData({...localData, mobile: ''});
      return;
    }

    if (value.length > 10) {
      setLocalData({...localData, mobile: localData.mobile});
      return;
    }

    setLocalData({...localData, mobile: value});
  };

  const onContactSelectCallback = ({name, number}) => {
    setLocalData({
      ...localData,
      name: name,
      mobile: number,
    });
  };

  const goToContacts = async () => {
    const checkAndRequest = Platform.select({
      android: async () => {
        const checkResult = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
        console.log({checkResult});

        if (checkResult === RESULTS.GRANTED) {
          return true;
        }

        if (checkResult === RESULTS.BLOCKED) {
          Alert.alert(
            '',
            "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
          );
          return false;
        }

        if (checkResult === RESULTS.UNAVAILABLE) {
          Alert.alert('', 'Access to contacts is unavailable.');
          return false;
        }

        if (checkResult === RESULTS.DENIED) {
          const requestResult = await request(PERMISSIONS.ANDROID.READ_CONTACTS);

          if (requestResult === RESULTS.GRANTED) {
            return true;
          }

          if (requestResult === RESULTS.BLOCKED) {
            Alert.alert(
              '',
              "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
            );
            return false;
          }

          if (requestResult === RESULTS.DENIED) {
            Alert.alert('', "Sorry, we can't access your contacts without sufficient permission.");
            return false;
          }
        }
      },
    });

    const result = await checkAndRequest();

    if (result) {
      navigation.push('SearchContact', {onContactSelectCallback});
    }
  };

  const onSubmit = async () => {
    if (localData.latitude == 0 || localData.longitude == 0) {
      Alert.alert('', "Please enter sender's location.");
      return;
    }

    if (validator.isEmpty(localData.name, {ignore_whitespace: true})) {
      Alert.alert('', "Please enter sender's name.");
      return;
    }

    if (validator.isEmpty(localData.mobile, {ignore_whitespace: true})) {
      Alert.alert('', "Please enter sender's mobile number.");
      return;
    }

    if (isNaN(localData.mobile)) {
      Alert.alert('', "Please enter a valid sender's mobile number.");
      return;
    }

    if (localData.mobile.length != 10) {
      Alert.alert('', "Please enter a valid sender's mobile number.");
      return;
    }

    setLoading(true);
    const {addressBreakdown} = await reverseGeocode({latitude: localData.latitude, longitude: localData.longitude});
    setLoading(false);

    localData.address = addressBreakdown;

    delete localData.latitudeDelta;
    delete localData.longitudeDelta;

    setPrice('0'); // This triggers Map(screen) to recalculate pricing

    setData(localData);
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <View style={{flex: 1}}>
        <InputScrollView showsVerticalScrollIndicator={false} keyboardOffset={20}>
          {/*---------------------------------------- MAP ----------------------------------------*/}
          <TouchableHighlight onPress={onSearchMap}>
            <View style={{height: 150}}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                  latitude: parseFloat(localData.latitude),
                  longitude: parseFloat(localData.longitude),
                  ...MAP_DELTA_LOW,
                }}
                scrollEnabled={false}
                rotateEnabled={false}
                zoomEnabled={false}
              />
              {/*-------------------- PIN --------------------*/}
              <View style={styles.floatingPin}>
                <FA5Icon name="map-pin" size={24} color={DARK} style={{marginTop: -20}} />
              </View>
            </View>
          </TouchableHighlight>
          {/*-------------------- YOUR LOCATION BUTTON --------------------*/}
          <TouchableHighlight onPress={onSearchPlaces} style={{marginHorizontal: 20, borderRadius: 10, marginTop: 20}}>
            <View style={styles.addressButton}>
              <BlackIcon set="FontAwesome5" name="map-pin" />
              <View style={{justifyContent: 'center', flex: 1, marginLeft: 20}}>
                <Text style={{fontFamily: 'Rubik-Medium'}}>Your Location</Text>
                <Text style={{color: 'white', fontSize: 10}} numberOfLines={1}>
                  {localData.formattedAddress}
                </Text>
              </View>
              <BlackIcon set="Feather" name="chevron-right" size={20} />
            </View>
          </TouchableHighlight>

          {/*-------------------- ORDER TYPE --------------------*/}
          <Text style={styles.label}>Order Type</Text>
          <SchedulePicker onScheduleChange={onScheduleChange} initialData={localData} />

          {/*-------------------- TEST START --------------------*/}
          {/* <Text style={{margin: 20, backgroundColor: LIGHT, borderRadius: 10, padding: 20}}>
          {JSON.stringify(
            {
              orderType: localData.orderType,
              scheduledFrom: localData.scheduledFrom,
              scheduledTo: localData.scheduledTo,
            },
            null,
            4,
          )}
        </Text> */}
          {/*-------------------- TEST END --------------------*/}

          {/*-------------------- LANDMARK --------------------*/}
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            value={localData.landmark}
            onChangeText={onLandmarkChange}
            style={styles.input}
            placeholder="Location details (landmark, number, etc...)"
            returnKeyType="next"
            placeholderTextColor={LIGHT}
          />

          {/*-------------------- NAME --------------------*/}
          <Text style={styles.label}>Sender's name</Text>
          <TextInput
            value={localData.name}
            onChangeText={onNameChange}
            style={styles.input}
            placeholder="Sender's name"
            returnKeyType="next"
            placeholderTextColor={LIGHT}
          />

          {/*-------------------- MOBILE NUMBER --------------------*/}
          <Text style={styles.label}>Mobile Number</Text>
          <View
            style={{
              marginHorizontal: 20,
              borderWidth: 1,
              borderColor: MEDIUM,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              overflow: 'hidden',
              height: 50,
            }}>
            <View
              style={{
                width: 60,
                backgroundColor: COLOR_UNDERLAY,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: MEDIUM,
                borderRightWidth: 1,
              }}>
              <Text style={{color: MEDIUM}}>+63</Text>
            </View>
            <TextInput
              value={localData.mobile}
              onChangeText={onMobileChange}
              placeholder="Mobile Number"
              keyboardType="numeric"
              returnKeyType="done"
              style={{paddingLeft: 20, flex: 1, color: DARK, height: 50}}
              placeholderTextColor={LIGHT}
            />
            <TouchableHighlight onPress={goToContacts} underlayColor={COLOR}>
              <View
                style={{
                  backgroundColor: DARK,
                  width: 60,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // borderColor: MEDIUM,
                  // borderLeftWidth: 1,
                }}>
                <AntIcon name="contacts" size={28} color={COLOR} />
              </View>
            </TouchableHighlight>
          </View>
          {/* <Text style={styles.label}>Mobile Number</Text>
          <View
            style={{
              marginHorizontal: 20,
              borderWidth: 1,
              borderColor: MEDIUM,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              overflow: 'hidden',
              height: 50,
            }}>
            <View
              style={{
                paddingHorizontal: 20,
                backgroundColor: COLOR_UNDERLAY,
                height: 50,
                justifyContent: 'center',
                borderColor: MEDIUM,
                borderRightWidth: 1,
              }}>
              <Text style={{color: DARK}}>+63</Text>
            </View>
            <TextInput
              value={localData.mobile}
              onChangeText={onMobileChange}
              placeholder="Mobile Number"
              keyboardType="numeric"
              returnKeyType="done"
              style={{paddingLeft: 20, flex: 1, color: DARK, height: 50}}
              placeholderTextColor={LIGHT}
            />
          </View> */}
          <View style={{height: 20}} />
          {/*-------------------- CONFIRM --------------------*/}
          <BlackButton onPress={onSubmit} label="Confirm" containerStyle={{marginTop: 0}} />
        </InputScrollView>
      </View>
    </View>
  );
};

export default SenderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
  },
  addressButton: {
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: COLOR,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    height: 50,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
    color: DARK,
    fontSize: 14,
  },
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainerStyle: {
    height: 30,
    flex: 1,
  },
  pickerStyle: {
    backgroundColor: 'white',
    borderColor: MEDIUM,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 9,
  },
  pickerDropDown: {
    backgroundColor: 'white',
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: MEDIUM,
    zIndex: 9,
  },

  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
});
