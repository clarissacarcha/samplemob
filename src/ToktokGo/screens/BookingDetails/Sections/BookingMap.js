import React, { useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import CONSTANTS from '../../../../common/res/constants';

import PinIcon from "../../../../assets/images/pinIcon.png"
import LocationIcon from "../../../../assets/images/locationIcon.png"

const INITIAL_REGION = {
    latitude: 11.22309004847093,
    latitudeDelta: 19.887065883877668,
    longitude: 121.97818368673325,
    longitudeDelta: 10.145791545510278,
  };



export const BookingMap = ({delivery}) => {
    const SECOND_LOCATION = {latitude: delivery.senderStop.latitude, longitude: delivery.senderStop.latitude}
    const mapRef = useRef()
    
    return (
        <View style={styles.contentCard}>
        <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={{width: '100%', height: 200}} initialRegion={INITIAL_REGION}>
            <Marker
                key={(key) => {1}}
                coordinate={{
                    latitude: delivery.senderStop.latitude,
                    longitude: delivery.senderStop.longitude,
                }}>
              <Image source={LocationIcon} resizeMode={'contain'} style={{height:36,width:36}}/>
            </Marker>

            <Marker
                key={(key) => {1}}
                coordinate={{
                    latitude: delivery.recipientStop.latitude,
                    longitude: delivery.recipientStop.longitude,
                }}>
              <Image source={PinIcon} resizeMode={'contain'} style={{height:36,width:36}}/>
            </Marker>
          </MapView>
          </View>
    )
}

const styles = StyleSheet.create({
    bold: {
        fontFamily: CONSTANTS.FONT_FAMILY.BOLD
    },
    cancelledText: {
        textAlign: 'center',
        color: CONSTANTS.COLOR.DARK
    },
    contentCard: {
        paddingHorizontal: 16,
        alignItems: 'center',
    }
});