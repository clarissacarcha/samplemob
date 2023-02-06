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
    return decomposeLink[decomposeLink.length - 1];
  } else {
    console.log('[linking Subscription]');
  }
};
