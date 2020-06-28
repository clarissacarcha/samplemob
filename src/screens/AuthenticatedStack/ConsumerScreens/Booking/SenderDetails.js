import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, TextInput, Dimensions, Alert} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {reverseGeocode} from '../../../../helper';
import {HeaderBack, HeaderTitle, SchedulePicker, AlertOverlay} from '../../../../components';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT, ORANGE} from '../../../../res/constants';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/Feather';

const SenderDetails = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Sender', 'details']} />,
  });

  const {data, setData, setPrice} = route.params;
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState(data);

  console.log(JSON.stringify({data}, null, 4));
  console.log(JSON.stringify({localData}, null, 4));

  const onSearchMap = () => {
    navigation.navigate('SearchMap', {data: {...localData, ...MAP_DELTA_LOW}, setData: setLocalData});
  };

  const onSearchPlaces = () => {
    navigation.navigate('SearchPlaces', {data: localData, setData: setLocalData});
  };

  const onScheduleChange = value => setLocalData({...localData, ...value});
  const onLandmarkChange = value => setLocalData({...localData, landmark: value});
  const onNameChange = value => setLocalData({...localData, name: value});
  const onMobileChange = value => setLocalData({...localData, mobile: value});

  const onSubmit = async () => {
    if (localData.latitude == 0 || localData.longitude == 0) {
      Alert.alert('', `Please enter recipient's location.`);
      return;
    }

    if (localData.name == '') {
      Alert.alert('', `Please enter recipient's name.`);
      return;
    }

    if (localData.mobile == '') {
      Alert.alert('', `Please enter recipient's mobile number.`);
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
      <ScrollView showsVerticalScrollIndicator={false}>
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
          <View style={styles.addressBox}>
            <FA5Icon name="map-pin" size={16} color={COLOR} style={styles.iconBoxDark} />
            <View style={{justifyContent: 'center', flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>Your Location</Text>
              <Text style={{color: 'white', fontSize: 10}} numberOfLines={1}>
                {localData.formattedAddress}
              </Text>
            </View>
            <FIcon
              name="chevron-right"
              size={18}
              color={COLOR}
              style={{
                height: 20,
                width: 20,
                backgroundColor: DARK,
                borderRadius: 10,
                textAlignVertical: 'center',
                textAlign: 'center',
                marginLeft: 10,
              }}
            />
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
          placeholder="Location details (landmark, number etc)"
          multiline
        />

        {/*-------------------- NAME --------------------*/}
        <Text style={styles.label}>Sender's name</Text>
        <TextInput
          value={localData.name}
          onChangeText={onNameChange}
          style={styles.input}
          placeholder="Sender's name"
        />

        {/*-------------------- MOBILE NUMBER --------------------*/}
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          value={localData.mobile}
          onChangeText={onMobileChange}
          style={styles.input}
          placeholder="Mobile number"
          keyboardType="number-pad"
        />
      </ScrollView>
      {/*-------------------- CONFIRM BUTTON --------------------*/}
      <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Confirm</Text>
        </View>
      </TouchableHighlight>
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
  addressBox: {
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: COLOR,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
  },
  submitBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 20,
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
    fontWeight: 'bold',
  },
});
