import React from 'react';
import {View, Text, StyleSheet, Platform, Linking} from 'react-native';
import {COLOR, FONT, SIZE} from '../../../../../../../res/variables';
import {VectorIcon, ICON_SET} from '../../../../../../../revamp';
import {ThrottledOpacity} from '../../../../../../../components_section';

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
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
    <View style={{height: 2, width: 2, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
  </View>
);

const CallButton = ({mobileNumber}) => {
  return (
    <ThrottledOpacity
      onPress={() => {
        const link = Platform.OS === 'android' ? `tel:${mobileNumber}` : `telprompt:${mobileNumber}`;
        Linking.openURL(link);
      }}
      style={styles.linkButton}>
      <VectorIcon iconSet={ICON_SET.Feather} name="phone" color={COLOR.YELLOW} size={18} />
    </ThrottledOpacity>
  );
};

const SmsButton = ({mobileNumber}) => {
  return (
    <ThrottledOpacity
      onPress={() => {
        Linking.openURL(`sms:${mobileNumber}`);
      }}
      style={styles.linkButton}>
      <VectorIcon iconSet={ICON_SET.MaterialCommunity} name="message-outline" color={COLOR.YELLOW} size={18} />
    </ThrottledOpacity>
  );
};

const StopInformation = ({stop}) => {
  return (
    <View style={styles.stopRow}>
      <View style={{flex: 1}}>
        <Text numberOfLines={1} style={styles.stopNameText}>
          {stop.name}
        </Text>
        <Text numberOfLines={1} style={styles.stopAddressText}>
          {stop.formattedAddress}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: SIZE.MARGIN}}>
        <SmsButton mobileNumber={stop.mobile} />
        <View style={{width: 4}} />
        <CallButton mobileNumber={stop.mobile} />
      </View>
    </View>
  );
};

export const SenderRecipientSection = ({delivery}) => {
  return (
    <>
      <View style={styles.bodyRow}>
        <View style={styles.iconColumn}>
          <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-pin" color={COLOR.YELLOW} size={16} />
          <DotDotDot />
          <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-marker-alt" color={COLOR.ORANGE} size={16} />
        </View>
        <View style={styles.stopsColumn}>
          <StopInformation stop={delivery.senderStop} />
          <View style={{height: 1, backgroundColor: COLOR.LIGHT}} />
          <StopInformation stop={delivery.recipientStop} />
        </View>
      </View>
      <View style={{height: 8, backgroundColor: COLOR.LIGHT}} />
    </>
  );
};

const styles = StyleSheet.create({
  touchableChild: {
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
    marginHorizontal: SIZE.MARGIN,
    height: 100,
    marginVertical: SIZE.MARGIN,
  },
  iconColumn: {
    width: 16,
    alignItems: 'center',
    paddingVertical: SIZE.MARGIN,
    marginRight: SIZE.MARGIN,
  },
  stopsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  stopRow: {
    minHeight: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateText: {
    fontFamily: FONT.BOLD,
  },
  viewText: {
    fontFamily: FONT.BOLD,
    color: COLOR.ORANGE,
  },
  stopNameText: {
    fontFamily: FONT.BOLD,
  },
  stopAddressText: {
    color: COLOR.DARK,
  },
  linkButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZE.BORDER_RADIUS,
    borderColor: COLOR.YELLOW,
    borderWidth: 1,
  },
});
