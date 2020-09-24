import React, {useState, useEffect, useRef} from 'react';
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
  Keyboard,
} from 'react-native';
import validator from 'validator';
import {connect} from 'react-redux';
import InputScrollView from 'react-native-input-scroll-view';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {numberFormatInteger, reverseGeocode} from '../../../../helper';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT, ORANGE, COLOR_UNDERLAY} from '../../../../res/constants';
import {
  HeaderBack,
  HeaderTitle,
  ItemDescription,
  SchedulePicker,
  AlertOverlay,
  CollectPaymentFrom,
} from '../../../../components';
import {YellowIcon, BlackIcon, BlackButton} from '../../../../components/ui';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/Feather';
import {useSafeArea} from 'react-native-safe-area-context';

const width = Dimensions.get('window').width;
const itemDimension = (width - 120) / 5;

const RecipientDetails = ({navigation, route, constants}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Recipient', 'details']} />,
  });

  const scrollRef = useRef(null);

  const {data, setData, index, setPrice} = route.params;

  // const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const onCollectPaymentFromChange = value => setLocalData({...localData, collectPaymentFrom: value});
  const onNotesChange = value => setLocalData({...localData, notes: value});
  const onCargoChange = value => setLocalData({...localData, cargo: value});

  const onMobileChange = value => {
    if (value.length == 1 && value == '0') {
      setLocalData({...localData, mobile: ''});
      return;
    }

    if (value.length > 10) {
      setLocalData({...localData, mobile: localData.mobile});
      return;
    }

    setLocalData({...localData, mobile: value});
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      scrollRef.current.scrollToEnd();
    }, 50);
  };

  const onCashOnDeliveryChange = value => {
    const decimal = value.split('.')[1];

    if (value && decimal) {
      if (decimal.toString().length > 2) {
        setLocalData({...localData, cashOnDelivery: localData.cashOnDelivery}); //force no change
        return;
      }
    }

    if (parseFloat(value) >= parseFloat(constants.maxCashOnDelivery)) {
      setLocalData({...localData, cashOnDelivery: constants.maxCashOnDelivery}); //force max amount
      return;
    }

    setLocalData({...localData, cashOnDelivery: value});
  };

  const onSubmit = async () => {
    if (localData.latitude == 0 || localData.longitude == 0) {
      Alert.alert('', "Please enter recipient's location.");
      return;
    }

    if (validator.isEmpty(localData.name, {ignore_whitespace: true})) {
      Alert.alert('', "Please enter recipient's name.");
      return;
    }

    if (validator.isEmpty(localData.mobile, {ignore_whitespace: true})) {
      Alert.alert('', "Please enter recipient's mobile number.");
      return;
    }

    if (isNaN(localData.mobile)) {
      Alert.alert('', "Please enter a valid recipient's mobile number.");
      return;
    }

    if (localData.mobile.length != 10) {
      Alert.alert('', "Please enter a valid recipient's mobile number.");
      return;
    }

    if (codSwitch && (!localData.cashOnDelivery || localData.cashOnDelivery == 0)) {
      Alert.alert('', 'Please enter Cash on Delivery amount.');
      return;
    }

    if (codSwitch && isNaN(localData.cashOnDelivery)) {
      Alert.alert('', 'Please enter a valid Cash on Delivery amount.');
      return;
    }

    if (
      codSwitch &&
      (parseFloat(localData.cashOnDelivery) > parseFloat(constants.maxCashOnDelivery) ||
        parseFloat(localData.cashOnDelivery) < 1.0)
    ) {
      Alert.alert('', `Please enter a Cash on Delivery amount between 1 and ${constants.maxCashOnDelivery}.`);
      return;
    }

    if (validator.isEmpty(localData.cargo, {ignore_whitespace: true})) {
      Alert.alert('', 'Please select item description type.');
      return;
    }

    setLoading(true);
    const {addressBreakdown} = await reverseGeocode({latitude: localData.latitude, longitude: localData.longitude});
    setLoading(false);

    const sendBack = [...data];
    sendBack[index] = localData;
    sendBack[index].address = addressBreakdown;

    delete sendBack[index].latitudeDelta;
    delete sendBack[index].longitudeDelta;

    setData(sendBack);

    setPrice('0'); // This triggers Map(screen) to recalculate pricing

    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <View style={{flex: 1}}>
        <InputScrollView showsVerticalScrollIndicator={false} ref={scrollRef} keyboardOffset={20}>
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
          <TouchableHighlight onPress={onSearchPlaces} style={{margin: 20, borderRadius: 10, marginBottom: 0}}>
            <View style={styles.addressBox}>
              <BlackIcon set="FontAwesome5" name="map-pin" />

              <View style={{justifyContent: 'center', flex: 1, marginHorizontal: 20}}>
                <Text style={{fontFamily: 'Rubik-Medium'}}>Going To</Text>
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

          {/*-------------------- LANDMARK --------------------*/}
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            value={localData.landmark}
            onChangeText={onLandmarkChange}
            style={styles.input}
            placeholder="Location details (landmark, number etc)"
            placeholderTextColor={LIGHT}
            returnKeyType="next"
          />

          {/*-------------------- NAME --------------------*/}
          <Text style={styles.label}>Recipient's Name</Text>
          <TextInput
            value={localData.name}
            onChangeText={onNameChange}
            style={styles.input}
            placeholder="Recipient's name"
            placeholderTextColor={LIGHT}
            returnKeyType="next"
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
                paddingHorizontal: 20,
                backgroundColor: COLOR_UNDERLAY,
                height: 50,
                justifyContent: 'center',
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
          </View>

          {/*-------------------- COLLECT PAYMENT FROM --------------------*/}

          <Text style={styles.label}>Collect Payment From</Text>
          <CollectPaymentFrom
            initialValue={localData.collectPaymentFrom}
            onSelect={onCollectPaymentFromChange}
            isCOD={codSwitch}
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
              <Text style={{fontSize: 12, color: DARK, fontFamily: 'Rubik-Medium'}}>Cash On Delivery</Text>
              <Text style={{fontSize: 10, color: MEDIUM, fontFamily: 'Rubik-Medium'}}>
                Rider pays sender and collect cash from recipient
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
            <>
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
                  marginTop: 10,
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
                  <Text style={{color: MEDIUM}}> {`Max: ${numberFormatInteger(constants.maxCashOnDelivery)}`}</Text>
                </View>
                <TextInput
                  value={localData.cashOnDelivery}
                  onChangeText={onCashOnDeliveryChange}
                  placeholder="Amount"
                  keyboardType="numeric"
                  returnKeyType="done"
                  style={{paddingLeft: 20, flex: 1, height: 50, color: DARK}}
                  placeholderTextColor={LIGHT}
                />
              </View>
            </>
          )}

          {/*-------------------- NOTES --------------------*/}
          <Text style={styles.label}>Notes</Text>
          <TextInput
            value={localData.notes}
            onChangeText={onNotesChange}
            style={styles.input}
            placeholder="Notes to rider"
            placeholderTextColor={LIGHT}
            keyboardType="default"
          />

          {/*-------------------- ITEM DESCRIPTION --------------------*/}
          <ItemDescription onSelect={onCargoChange} initialData={localData.cargo} scrollToEnd={scrollToEnd} />
          <View style={{height: 20}} />
          {/*-------------------- BUTTON --------------------*/}
          <BlackButton onPress={onSubmit} label="Confirm" containerStyle={{marginTop: 0}} />
        </InputScrollView>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

export default connect(
  mapStateToProps,
  null,
)(RecipientDetails);

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
    height: 50,
    color: DARK,
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
    fontFamily: 'Rubik-Medium',
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
