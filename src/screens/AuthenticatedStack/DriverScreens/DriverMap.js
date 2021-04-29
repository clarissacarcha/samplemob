import React, {useState, useEffect, createRef, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, ScrollView, Alert, Share} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {connect} from 'react-redux';
import {currentLocation} from '../../../helper';
import {GoOnlineOverlay} from '../../../components';
import {COLOR, DARK} from '../../../res/constants';

import FIcon from 'react-native-vector-icons/Feather';
import {CLIENT, ON_DISPATCH} from '../../../graphql';

const DriverMap = ({navigation, session}) => {
  const mapViewRef = useRef(null);
  const [isOnline, setIsOnline] = useState(false);
  const [sender, setSender] = useState({
    userId: '',
    stop: {
      latitude: 0,
      longitude: 0,
      formattedAddress: '#1521 Minerva Street, Parada, Santa Maria, Bulacan',
      name: 'Alvir Marquez',
      mobile: '09666573923',
      landmark: '',
    },
  });

  const getCurrentLocation = async () => {
    const location = await currentLocation({
      showsReverseGeocode: true,
    });
    setSender({
      ...sender,
      stop: {
        ...sender.stop,
        ...location,
      },
    });
  };

  const goOnline = () => {
    setIsOnline(true);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      {isOnline && <GoOnlineOverlay onDismiss={() => setIsOnline(false)} />}
      {/*---------------------------------------- MAP ----------------------------------------*/}
      {sender.stop.latitude != 0 ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapViewRef}
          style={styles.container}
          initialRegion={{
            latitude: parseFloat(sender.stop.latitude),
            longitude: parseFloat(sender.stop.longitude),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          showsUserLocation={true}
          onRegionChangeComplete={(data) => {}}
        />
      ) : (
        <View style={{...StyleSheet.absoluteFillObject, backgroundColor: COLOR}} />
      )}
      <View style={styles.footer}>
        {/*---------------------------------------- SUBMIT BUTTON ----------------------------------------*/}
        {!isOnline && (
          <TouchableHighlight onPress={goOnline} underlayColor={COLOR} style={styles.submitBox}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 20}}>Go Online</Text>
            </View>
          </TouchableHighlight>
        )}
      </View>
      {/*---------------------------------------- DRAWER BUTTON ----------------------------------------*/}
      {!isOnline && (
        <TouchableHighlight onPress={() => navigation.openDrawer()} underlayColor={COLOR} style={styles.menuBox}>
          <View style={styles.menu}>
            <FIcon name="menu" size={24} color={COLOR} />
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(DriverMap);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 20,
    borderRadius: 10,
  },
  menu: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    backgroundColor: DARK,
    borderRadius: 10,
  },
  submitBox: {
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
