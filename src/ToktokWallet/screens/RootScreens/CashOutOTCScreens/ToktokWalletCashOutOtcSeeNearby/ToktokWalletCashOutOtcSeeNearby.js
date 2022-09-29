/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {useEffect} from 'react';

import type {PropsType} from './types';
import {Container} from './Styled';
import {WebView} from 'react-native-webview';
import {useRoute, useNavigation} from '@react-navigation/native';
import {HeaderBack, HeaderTitleRevamp, PolicyNote, CheckIdleState} from 'toktokwallet/components';
import {locationPermission} from 'toktokwallet/helper';

const ToktokWalletCashOutOtcSeeNearby = (props: PropsType): React$Node => {
  const route = useRoute();
  const navigation = useNavigation();
  const description = route.params.description;
  const otcPartner = description.replace(' ', '+');
  const [mapUrl, setMapUrl] = useState('');

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={`Nearby ${description}`} />,
  });

  useEffect(() => {
    getCurrentLocation();
  });

  const getCurrentLocation = async () => {
    const location = await locationPermission({showsReverseGeocode: false});
    if (location) {
      setMapUrl(`https://www.google.com/maps/search/${otcPartner}/@${location.latitude},${location.longitude},12z`);
    }
  };

  return (
    <CheckIdleState>
      <Container>
        <PolicyNote note1="Access to the nearby cash-out outlet map requires mobile data. Data charges may apply here. Also, ensure that your Location Services is set to High Accuracy mode." />
        <WebView
          originWhitelist={['*']}
          scalesPageToFit={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          ignoreSslError={true}
          allowUniversalAccessFromFileURLs={true}
          source={{
            uri: mapUrl !== '' ? mapUrl : `https://www.google.com/maps/search/${otcPartner}`,
          }}
        />
      </Container>
    </CheckIdleState>
  );
};

export default ToktokWalletCashOutOtcSeeNearby;
