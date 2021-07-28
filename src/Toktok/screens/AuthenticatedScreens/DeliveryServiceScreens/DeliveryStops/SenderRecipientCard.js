import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import ContentLoader from 'react-native-easy-content-loader';
import {useLazyQuery} from '@apollo/react-hooks';
import {COLORS, FONTS, NUMBERS, SIZES} from '../../../../../res/constants';
import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../res/variables';
import {WhiteButton, VectorIcon, Shadow, ICON_SET} from '../../../../../revamp';
import {GET_GOOGLE_GEOCODE_REVERSE} from '../../../../../graphql';
import {GeolocationUtility, GoogleUtility} from '../../../../../util';

const SenderRecipientCard = ({
  senderStop,
  recipientStop,
  setSenderStop,
  onSenderPress = () => {},
  onRecipientPress = () => {},
  onLocationDetected = () => {},
  hasAddressFromSearch = false,
}) => {
  const [userStop, setUserStop] = useState(senderStop);
  const session = useSelector((state) => state.session);

  const [getGoogleGeocodeReverse, {loading, error}] = useLazyQuery(GET_GOOGLE_GEOCODE_REVERSE, {
    fetchPolicy: 'network-only',
    onCompleted: ({getGoogleGeocodeReverse}) => {
      console.log(JSON.stringify({USER: userStop}, null, 4));
      console.log(JSON.stringify({GEOCODED: getGoogleGeocodeReverse}, null, 4));

      const updatedUserStop = {
        ...userStop,
        name: `${session.user.person.firstName} ${session.user.person.lastName}`,
        mobile: session.user.username.replace('+63', ''),
        formattedAddress: getGoogleGeocodeReverse.formattedAddress,
        addressBreakdownHash: getGoogleGeocodeReverse.addressBreakdownHash,
        // addressBreakdown: getGoogleGeocodeReverse.addressBreakdown,
      };
      setSenderStop(updatedUserStop);
      setUserStop(updatedUserStop);
    },
    onError: (error) => console.log({error}),
  });

  const getLocationHash = async () => {
    const currentLocation = await GeolocationUtility.getCurrentLocation();

    if (currentLocation) {
      setUserStop({
        ...userStop,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

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
    // if (!senderStop.formattedAddress) {
    //   console.log('___________________');

    // }
    if (!hasAddressFromSearch) {
      getLocationHash();
    }
  }, []);

  return (
    <Shadow style={{marginHorizontal: SIZE.MARGIN, borderRadius: SIZE.BORDER_RADIUS}}>
      <View
        style={{
          flexDirection: 'row',
          height: 140,
          borderRadius: NUMBERS.BORDER_RADIUS,
          backgroundColor: 'white',
        }}>
        <View style={{width: 50, alignItems: 'center', paddingVertical: 20}}>
          <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-pin" color={COLOR.YELLOW} size={22} />
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
          <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-marker-alt" color={COLOR.ORANGE} size={22} />
        </View>
        <View style={{flex: 1, justifyContent: 'center', marginRight: 8}}>
          <TouchableHighlight
            onPress={onSenderPress}
            style={{borderRadius: NUMBERS.BORDER_RADIUS, marginLeft: -8}}
            underlayColor={COLORS.LIGHT_YELLOW}>
            <View style={{height: 50, justifyContent: 'center', backgroundColor: 'white'}}>
              {senderStop.formattedAddress ? (
                <View style={{paddingLeft: 10}}>
                  <Text numberOfLines={1} style={{fontFamily: FONT.BOLD}}>
                    {senderStop.name}
                  </Text>
                  <Text numberOfLines={1} style={{color: COLOR.DARK}}>
                    {senderStop.formattedAddress}
                  </Text>
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
          <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT, marginVertical: 8, marginLeft: -5}} />
          <TouchableHighlight
            // onPress={searchRecipientAddress}
            onPress={onRecipientPress}
            style={{borderRadius: NUMBERS.BORDER_RADIUS, marginLeft: -8}}
            underlayColor={COLORS.LIGHT_YELLOW}>
            <View style={{height: 50, justifyContent: 'center', backgroundColor: 'white', paddingLeft: 8}}>
              {recipientStop[0].formattedAddress ? (
                <>
                  <Text numberOfLines={1} style={{fontFamily: FONT.BOLD}}>
                    {recipientStop[0].name}
                  </Text>
                  <Text numberOfLines={1} style={{color: COLOR.DARK}}>
                    {recipientStop[0].formattedAddress}
                  </Text>
                </>
              ) : (
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FONT.BOLD,
                  }}>
                  {`May ipapadala? Ipa-toktok mo na yan!`}
                </Text>
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

  menuIcon: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
});
