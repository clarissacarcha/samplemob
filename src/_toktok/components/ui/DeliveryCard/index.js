/**
 * Component used to display a delivery record in my deliveries, orders placed, delivery scheduled and the like
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLOR, FONT, SIZE} from '../../../../res/variables';
import {VectorIcon, ICON_SET} from '../../../../revamp';
import {ThrottledHighlight} from '../../../../components_section';

const DotDotDot = () => (
  <View
    style={{
      flex: 1,
      overflow: 'hidden',
      marginVertical: 1,
    }}>
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
  </View>
);

export const DeliveryCard = ({delivery, onPress}) => {
  return (
    <ThrottledHighlight onPress={onPress} underlayColor={COLOR.WHITE_UNDERLAY}>
      <View style={styles.touchableChild}>
        <View style={styles.headerRow}>
          <Text>{delivery.createdAt}</Text>
          <Text style={styles.viewText}>View</Text>
        </View>
        <View style={styles.bodyRow}>
          <View style={styles.iconColumn}>
            <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-pin" color={COLOR.YELLOW} size={16} />
            <DotDotDot />
            <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-marker-alt" color={COLOR.ORANGE} size={16} />
          </View>
          <View style={styles.stopsColumn}>
            <View style={styles.stopColumn}>
              <Text numberOfLines={1} style={styles.stopNameText}>
                {delivery.senderStop.name}
              </Text>
              <Text numberOfLines={1} style={styles.stopAddressText}>
                {delivery.senderStop.formattedAddress}
              </Text>
            </View>
            <View style={styles.stopColumn}>
              <Text numberOfLines={1} style={styles.stopNameText}>
                {delivery.recipientStop.name}
              </Text>
              <Text numberOfLines={1} style={styles.stopAddressText}>
                {delivery.recipientStop.formattedAddress}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ThrottledHighlight>
  );
};

const styles = StyleSheet.create({
  touchableChild: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: SIZE.MARGIN,
  },
  headerRow: {
    height: 50,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: COLOR.LIGHT,
  },
  bodyRow: {
    flexDirection: 'row',
  },
  iconColumn: {
    width: 16,
    height: 100,
    alignItems: 'center',
    paddingVertical: SIZE.MARGIN,
    marginRight: SIZE.MARGIN,
  },
  stopsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  stopColumn: {
    height: 50,
    justifyContent: 'center',
  },

  viewText: {
    fontFamily: FONT.BOLD,
    color: COLOR.ORANGE,
  },
  stopNameText: {
    fontFamily: FONT.BOLD,
  },
  stopAddressText: {
    marginTop: -2,
    color: COLOR.DARK,
  },
});
