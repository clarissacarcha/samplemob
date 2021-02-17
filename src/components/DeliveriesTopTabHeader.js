import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {getFocusedRouteNameFromRoute, useRoute} from '@react-navigation/native';
import {DARK, ORANGE} from '../res/constants';

export const DeliveriesTopTabHeader = () => {
  const route = useRoute();

  const getDeliveriesTopTabTitle = (routeParam) => {
    const routeName = getFocusedRouteNameFromRoute(routeParam) ?? ['Ongoing', 'Deliveries'];

    switch (routeName) {
      case 'Ongoing':
        return ['Ongoing', 'Deliveries'];
      case 'Pending':
        return ['Pending', 'Deliveries'];
      case 'Completed':
        return ['Completed', 'Deliveries'];
      case 'Cancelled':
        return ['Cancelled', 'Deliveries'];
      default:
        return ['Ongoing', 'Deliveries'];
    }
  };

  const headerLabel = getDeliveriesTopTabTitle(route);

  return (
    <View style={styles.header}>
      <Text style={styles.outer}>
        {headerLabel[0]}
        <Text style={styles.inner}> {headerLabel[1]}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    fontSize: 16,
    fontFamily: 'Rubik-Medium',
    color: DARK,
  },
  inner: {
    color: ORANGE,
    fontSize: 16,
    fontFamily: 'Rubik-Medium',
  },
  header: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 14,

    backgroundColor: 'white',
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
