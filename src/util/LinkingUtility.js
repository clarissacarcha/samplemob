import React from 'react';
import {Linking, Platform} from 'react-native';

export const handleDynamicLinks = link => {
  const decomposeLink = link?.url.split('/');
  if (decomposeLink) {
    console.log('[dynamic link GetInitialLink]', decomposeLink[decomposeLink.length - 1]); // RETURNS ABC123
    return decomposeLink[decomposeLink.length - 1];
  } else {
    console.log('[dynamic link GetInitialLink]');
  }
};

export const handleUniversalLinks = async () => {
  let openedFromLink = await Linking.getInitialURL();
  if (openedFromLink) {
    const decomposeLink = openedFromLink.split('/');
    if (decomposeLink) {
      console.log('[native linking GetInitialURL]', decomposeLink[decomposeLink.length - 1]); // RETURNS ABC123
      return decomposeLink[decomposeLink.length - 1];
    }
  } else {
    console.log('[native linking GetInitialURL]', openedFromLink);
  }
};

export const handleSubscriptionLinking = link => {
  const decomposeLink = link?.url.split('/');
  if (decomposeLink) {
    const urlReferral = decomposeLink[decomposeLink.length - 1];
    if (Platform.OS === 'ios') {
      let finalUrl;
      const urlSplit = urlReferral.split('&');
      if (urlSplit.length > 1) {
        finalUrl = urlSplit[0];
      } else {
        urlReferral;
      }
      console.log('[linking Subscription]', finalUrl); // RETURNS ABC123
      return finalUrl;
    }
    return decomposeLink[decomposeLink.length - 1];
  } else {
    console.log('[linking Subscription]');
  }
};
