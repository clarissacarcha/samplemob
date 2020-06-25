import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Alert,
  Dimensions,
  Switch,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT, ORANGE} from '../../../../res/constants';
import {HeaderBack, HeaderTitle, ItemDescription, SchedulePicker} from '../../../../components';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/Feather';

const width = Dimensions.get('window').width;
const itemDimension = (width - 120) / 5;

const RecipientDetails = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Recipient', 'details']} />,
  });

  const {data, setData, index, setPrice} = route.params;

  const [localData, setLocalData] = useState(data[index]);
  const [codSwitch, setCodSwitch] = useState(data[index].cashOnDelivery ? true : false);

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
  const onCashOnDeliveryChange = value => setLocalData({...localData, cashOnDelivery: value});
  const onNotesChange = value => setLocalData({...localData, notes: value});
  const onCargoChange = value => setLocalData({...localData, cargo: value});

  const onSubmit = () => {
    // alert(JSON.stringify(localData, null, 4));

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

    if (codSwitch && (!localData.cashOnDelivery || localData.cashOnDelivery == 0)) {
      Alert.alert('', `Please enter cash on delivery amount.`);
      return;
    }

    if (localData.cargo == '') {
      Alert.alert('', `Please select cargo type`);
      return;
    }

    const sendBack = [...data];
    sendBack[index] = localData;

    delete sendBack[index].latitudeDelta;
    delete sendBack[index].longitudeDelta;

    setData(sendBack);

    setPrice('0'); // This triggers Map(screen) to recalculate pricing

    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {localData.latitude != 0 && (
          <TouchableHighlight onPress={onSearchMap}>
            <View style={{height: 150}}>
              {/*---------------------------------------- MAP ----------------------------------------*/}
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
              {/*---------------------------------------- PIN ----------------------------------------*/}
              <View style={styles.floatingPin}>
                <FA5Icon name="map-marker-alt" size={24} color={COLOR} style={{marginTop: -20}} />
              </View>
            </View>
          </TouchableHighlight>
        )}
        {/*---------------------------------------- ADDRESS ----------------------------------------*/}
        <TouchableHighlight onPress={onSearchPlaces} style={{margin: 20, borderRadius: 10}}>
          <View style={styles.addressBox}>
            <FA5Icon name="map-marker-alt" size={16} color={COLOR} style={styles.iconBoxDark} />
            <View style={{justifyContent: 'center', flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>Going To</Text>
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
        <Text style={styles.label}>Recipient's Name</Text>
        <TextInput
          value={localData.name}
          onChangeText={onNameChange}
          style={styles.input}
          placeholder="Recipient's name"
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

        {/*-------------------- CASH ON DELIVERY --------------------*/}
        <View
          style={{
            margin: 20,
            marginBottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text style={{fontSize: 12, color: DARK, fontWeight: 'bold'}}>Cash On Delivery</Text>
            <Text style={{fontSize: 10, color: MEDIUM, fontWeight: 'bold'}}>
              Rider will collect cash from recipient
            </Text>
          </View>
          <Switch
            trackColor={{false: LIGHT, true: LIGHT}}
            thumbColor={codSwitch ? COLOR : MEDIUM}
            onValueChange={value => setCodSwitch(value)}
            value={codSwitch}
          />
        </View>
        {codSwitch && (
          <TextInput
            value={localData.cashOnDelivery}
            onChangeText={onCashOnDeliveryChange}
            placeholder="Amount"
            keyboardType="numeric"
            style={{
              marginHorizontal: 20,
              borderWidth: 1,
              borderColor: MEDIUM,
              borderRadius: 5,
              paddingLeft: 20,
              marginTop: 10,
            }}
          />
        )}

        {/*-------------------- NOTES --------------------*/}
        <Text style={styles.label}>Notes</Text>
        <TextInput value={localData.notes} onChangeText={onNotesChange} style={styles.input} placeholder="Notes" />

        {/*-------------------- ITEM DESCRIPTION --------------------*/}
        <ItemDescription onSelect={onCargoChange} initialData={localData.cargo} />
      </ScrollView>
      {/*---------------------------------------- BUTTON ----------------------------------------*/}
      <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Confirm</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default RecipientDetails;

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
    borderRadius: 5,
    paddingLeft: 20,
  },
  submitBox: {
    margin: 20,
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
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontWeight: 'bold',
  },
  itemType: {
    height: itemDimension,
    width: itemDimension,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
