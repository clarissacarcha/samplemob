import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import ContentLoader from 'react-native-easy-content-loader';
import {useLazyQuery} from '@apollo/react-hooks';
import {COLOR, COLORS, FONTS, NUMBERS, SIZES} from '../../../../../res/constants';
import {WhiteButton, VectorIcon, Shadow, ICON_SET} from '../../../../../revamp';
import {GET_GOOGLE_GEOCODE_REVERSE} from '../../../../../graphql';
import {GeolocationUtility} from '../../../../../util';

const SideIcons = () => {};

const SenderRecipientCard = ({
  senderStop,
  recipientStop,
  setRecipientStop,
  onSenderPress = () => {},
  onRecipientPress = () => {},
  onLocationDetected = () => {},
}) => {
  const [userStop, setUserStop] = useState(recipientStop);
  const session = useSelector((state) => state.session);

  const [getGoogleGeocodeReverse, {loading, error}] = useLazyQuery(GET_GOOGLE_GEOCODE_REVERSE, {
    fetchPolicy: 'network-only',
    onCompleted: ({getGoogleGeocodeReverse}) => {
      console.log(JSON.stringify({USER: userStop}, null, 4));
      console.log(JSON.stringify({GEOCODED: getGoogleGeocodeReverse}, null, 4));

      const updatedUserStop = [
        {
          ...userStop[0],
          name: `${session.user.person.firstName} ${session.user.person.lastName}`,
          mobile: session.user.username.replace('+63', ''),
          formattedAddress: getGoogleGeocodeReverse.formattedAddress,
          // addressBreakdown: getGoogleGeocodeReverse.addressBreakdown,
          addressBreakdownHash: getGoogleGeocodeReverse.addressBreakdownHash,
        },
      ];

      setRecipientStop(updatedUserStop);
      setUserStop(updatedUserStop);
    },
    onError: (error) => console.log({error}),
  });

  const getLocationHash = async () => {
    // console.log('FETCHING LOCATION');
    const currentLocation = await GeolocationUtility.getCurrentLocation();
    // console.log({currentLocation});

    if (currentLocation) {
      setUserStop([
        {
          ...userStop[0],
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      ]);

      onLocationDetected({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      getGoogleGeocodeReverse({
        variables: {
          input: {
            coordinates: {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            },
          },
        },
      });
    }
  };

  useEffect(() => {
    if (!recipientStop[0].formattedAddress) {
      getLocationHash();
    }
  }, []);

  return (
    <Shadow style={{marginHorizontal: NUMBERS.MARGIN_HORIZONTAL, borderRadius: NUMBERS.BORDER_RADIUS}}>
      <View
        style={{
          flexDirection: 'row',
          height: 140,
          borderRadius: NUMBERS.BORDER_RADIUS,
          backgroundColor: 'white',
        }}>
        <View style={{width: 50, alignItems: 'center', paddingVertical: 20}}>
          <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-pin" color={COLORS.YELLOW} size={22} />
          <View
            style={{
              flex: 1,
              overflow: 'hidden',
              marginVertical: 5,
            }}>
            <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
            <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
            <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
            <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
            <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
            <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
            <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
            <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
          </View>
          <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-marker-alt" color={COLORS.ORANGE} size={22} />
        </View>
        <View style={{flex: 1, justifyContent: 'center', marginRight: 10}}>
          <TouchableHighlight
            onPress={onSenderPress}
            style={{borderRadius: NUMBERS.BORDER_RADIUS, marginLeft: -10}}
            underlayColor={COLORS.LIGHT_YELLOW}>
            <View style={{height: 50, justifyContent: 'center', backgroundColor: 'white', paddingLeft: 10}}>
              {senderStop.formattedAddress ? (
                <>
                  <Text>Alvir Marquez</Text>
                  <Text numberOfLines={1}>10F Inoza Tower, 40th Street, Bonifacio Global City</Text>
                </>
              ) : (
                <Text
                  numberOfLines={1}
                  style={{
                    color: COLORS.MEDIUM,
                  }}>{`Hi ${session.user.person.firstName}, saan mo gusto magpabili?`}</Text>
              )}
            </View>
          </TouchableHighlight>
          <View
            style={{borderBottomWidth: 1, borderColor: COLORS.TRANSPARENT_GRAY, marginVertical: 10, marginLeft: -5}}
          />
          <TouchableHighlight
            // onPress={searchRecipientAddress}
            onPress={onRecipientPress}
            style={{borderRadius: NUMBERS.BORDER_RADIUS, marginLeft: -10}}
            underlayColor={COLORS.LIGHT_YELLOW}>
            <View style={{height: 50, justifyContent: 'center', backgroundColor: 'white'}}>
              {recipientStop[0].formattedAddress ? (
                <View style={{paddingLeft: 10}}>
                  <Text>{recipientStop[0].name}</Text>
                  <Text numberOfLines={1}>{recipientStop[0].formattedAddress}</Text>
                </View>
              ) : (
                <View style={{}}>
                  <ContentLoader
                    active
                    pRows={2}
                    pWidth={['40%', '100%']}
                    title={false}
                    primaryColor="rgba(256,186,28,0.2)"
                    secondaryColor="rgba(256,186,28,0.4)"
                  />
                </View>
              )}
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </Shadow>
  );
};

export default SenderRecipientCard;

const styles = StyleSheet.create({
  menuBox: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
  },
  menuIconBox: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.TRANSPARENT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  menuIcon: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
});
