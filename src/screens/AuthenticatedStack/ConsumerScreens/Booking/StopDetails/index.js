import React, {useState} from 'react';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {View, Text, StyleSheet, TouchableHighlight, TextInput, Platform, Alert} from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import validator from 'validator';

import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';
import {BlackButton, YellowIcon} from '../../../../../components/ui';
import {LabelTextInput, ScheduledTimeInput} from '../../../../../components/forms';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT, COLOR_UNDERLAY} from '../../../../../res/constants';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign';

const StopDetails = ({navigation, route}) => {
  const {stopData, deliveryOrderType, scheduledDate, index, headerLabel} = route.params;
  const [loading, setLoading] = useState(false);
  const [stop, setStop] = useState(stopData);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={[headerLabel, 'Details']} />,
  });

  const onSearchMap = () => {
    navigation.navigate('SearchMap', {data: {...stop, ...MAP_DELTA_LOW}, setData: setStop});
  };

  const onSearchPlaces = () => {
    navigation.navigate('SearchPlaces', {data: stop, setData: setStop});
  };

  const onScheduleChange = (value) => setStop({...stop, ...value});
  const onLandmarkChange = (value) => setStop({...stop, landmark: value});
  const onNameChange = (value) => setStop({...stop, name: value});

  const onMobileChange = (value) => {
    if (value.length === 1 && value === '0') {
      setStop({...stop, mobile: ''});
      return;
    }

    if (value.length > 10) {
      setStop({...stop, mobile: stop.mobile});
      return;
    }

    setStop({...stop, mobile: value});
  };

  const onContactSelectCallback = ({name, number}) => {
    setStop({
      ...stop,
      name: name,
      mobile: number,
    });
  };

  const goToContacts = async () => {
    const checkAndRequest = Platform.select({
      android: async () => {
        const checkResult = await check(PERMISSIONS.ANDROID.READ_CONTACTS);

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
      ios: async () => {
        const checkResult = await check(PERMISSIONS.IOS.CONTACTS);

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
          const requestResult = await request(PERMISSIONS.IOS.CONTACTS);
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
        }
      },
    });

    const result = await checkAndRequest();

    if (result) {
      navigation.push('SearchContact', {onContactSelectCallback});
    }
  };

  const onSubmit = async () => {
    if (stop.latitude === null || stop.longitude === null) {
      Alert.alert('', 'Please enter location.');
      return;
    }

    if (validator.isEmpty(stop.name, {ignore_whitespace: true})) {
      Alert.alert('', "Please enter contact person's name.");
      return;
    }

    if (validator.isEmpty(stop.mobile, {ignore_whitespace: true})) {
      Alert.alert('', 'Please enter mobile number.');
      return;
    }

    if (isNaN(stop.mobile)) {
      Alert.alert('', 'Please enter a mobile number.');
      return;
    }

    if (stop.mobile.length !== 10) {
      Alert.alert('', 'Please enter a mobile number.');
      return;
    }

    delete stop.latitudeDelta;
    delete stop.longitudeDelta;

    // setData(stop);
    // navigation.pop();
    if (index === null) {
      navigation.navigate('DeliveryDetails', {updatedSenderStop: stop});
    } else {
      navigation.navigate('DeliveryDetails', {
        updatedRecipientStop: {
          recipientStop: stop,
          index,
        },
      });
    }
  };

  const onStopChange = (value) => {
    const updatedStop = {
      ...stop,
      ...value,
    };

    setStop(updatedStop);
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <InputScrollView showsVerticalScrollIndicator={false} keyboardOffset={20} contentContainerStyle={{padding: 20}}>
        {/*--------------- TEST START ---------------*/}
        {/* <Text style={{margin: 20, backgroundColor: LIGHT, borderRadius: 10, padding: 20}}>
          {JSON.stringify(
            {
              orderType: stop.orderType,
              scheduledFrom: stop.scheduledFrom,
              scheduledTo: stop.scheduledTo,
            },
            null,
            4,
          )}
        </Text> */}
        {/*--------------- TEST END ---------------*/}
        {/*--------------- MAP ---------------*/}
        {stop.latitude && (
          <TouchableHighlight onPress={onSearchMap} style={{margin: -20, marginBottom: 20}}>
            <View style={{height: 150}}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                  latitude: parseFloat(stop.latitude),
                  longitude: parseFloat(stop.longitude),
                  ...MAP_DELTA_LOW,
                }}
                scrollEnabled={false}
                rotateEnabled={false}
                zoomEnabled={false}
              />
              {/*--------------- PIN ---------------*/}
              <View style={styles.floatingPin}>
                <FA5Icon name="map-pin" size={24} color={DARK} style={{marginTop: -20}} />
              </View>
            </View>
          </TouchableHighlight>
        )}

        {/*--------------- LOCATION  ---------------*/}
        <TouchableHighlight onPress={onSearchPlaces} style={{borderRadius: 10, marginBottom: 20}} underlayColor={COLOR}>
          <View style={styles.addressButton}>
            <YellowIcon set="FontAwesome5" name="map-pin" darkIcon />
            <View style={{justifyContent: 'center', flex: 1, marginLeft: 20}}>
              <Text style={{fontFamily: 'Rubik-Medium', color: COLOR}}>Location</Text>
              {stop.formattedAddress !== '' && (
                <Text style={{color: 'white', fontSize: 10}}>{stop.formattedAddress}</Text>
              )}
            </View>
            <YellowIcon set="Feather" name="chevron-right" size={20} darkIcon />
          </View>
        </TouchableHighlight>

        {/*--------------- ORDER TYPE ---------------*/}
        <ScheduledTimeInput
          initialData={stop}
          scheduledDate={scheduledDate}
          onChangeFrom={(value) => {
            onStopChange({scheduledFrom: value});
          }}
          onChangeTo={(value) => {
            onStopChange({scheduledTo: value});
          }}
          visible={deliveryOrderType === 'SCHEDULED'}
        />

        {/*--------------- Name ---------------*/}
        <LabelTextInput
          label="Contact Person"
          value={stop.name}
          onChange={(value) => onStopChange({name: value})}
          placeholder="Contact Person's Full Name"
          marginBottom
        />

        {/*--------------- MOBILE NUMBER ---------------*/}
        <Text style={styles.label}>Mobile Number</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: MEDIUM,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'hidden',
            height: 50,
            marginBottom: 20,
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
            value={stop.mobile}
            onChangeText={(value) => onStopChange({mobile: value})}
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
              }}>
              <AntIcon name="contacts" size={28} color={COLOR} />
            </View>
          </TouchableHighlight>
        </View>

        {/*--------------- LANDMARK ---------------*/}
        <LabelTextInput
          label="Landmark"
          value={stop.landmark}
          onChange={(value) => onStopChange({landmark: value})}
          placeholder="Set landmark or specific Instructions here"
          marginBottom
        />

        {/*--------------- CONFIRM ---------------*/}
        <BlackButton onPress={onSubmit} label="Confirm" containerStyle={{margin: 0}} />
      </InputScrollView>
    </View>
  );
};

export default StopDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
  },
  addressButton: {
    minHeight: 50,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: DARK,
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
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
});
