/**
 * Displayed in Selected Delivery Details
 * Used to display driver information
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Linking,
  TouchableHighlight,
  Image,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLOR, DARK, MEDIUM, ORANGE, LIGHT, COLOR_UNDERLAY} from '../res/constants';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

const imageWidth = Dimensions.get('window').width - 40;

const AvatarOverlay = ({avatar, visible, onPress}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" style={{position: 'relative'}}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 9}} />
      </TouchableWithoutFeedback>
      <View style={{...StyleSheet.absoluteFillObject, justifyContent: 'center'}}>
        <Image
          source={{uri: avatar}}
          style={{height: imageWidth, width: imageWidth, borderRadius: 10, marginHorizontal: 20, zIndex: 9999}}
        />
      </View>
    </Modal>
  );
};

export const DriverCard = ({driver}) => {
  const labels = ['Rider', 'Info'];

  const [showLargeAvatar, setShowLargeAvatar] = useState(false);
  const {firstName, lastName} = driver.user.person;
  const mobileNumber = driver.user.username;

  const icons = [
    <FA5Icon name="map-pin" size={16} color={DARK} style={styles.iconBox} />,
    <FA5Icon name="map-marker-alt" size={16} color={DARK} style={styles.iconBox} />,
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardShadow}>
        {/*------------------- RIDER INFO LABEL-------------------*/}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: MEDIUM,
          }}>
          <Fontisto name="motorcycle" size={18} color={DARK} style={styles.iconBox} />
          <Text style={{marginLeft: 10, color: DARK, fontWeight: 'bold'}}>
            {labels[0]} <Text style={{color: ORANGE}}>{labels[1]}</Text>
          </Text>
        </View>

        <View style={{flexDirection: 'row', padding: 20}}>
          {/*------------------- AVATAR -------------------*/}

          {driver.user.person.avatarThumbnail ? (
            <>
              <AvatarOverlay
                avatar={driver.user.person.avatar}
                visible={showLargeAvatar}
                onPress={() => setShowLargeAvatar(false)}
              />
              <TouchableHighlight
                onPress={() => setShowLargeAvatar(true)}
                underlayColor={COLOR}
                style={{marginRight: 10, borderRadius: 10}}>
                <Image
                  source={{uri: driver.user.person.avatarThumbnail}}
                  style={{height: 60, width: 60, borderRadius: 10}}
                />
              </TouchableHighlight>
            </>
          ) : (
            <View
              style={{
                height: 60,
                width: 60,
                borderRadius: 10,
                backgroundColor: MEDIUM,
                marginRight: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FAIcon name="user" size={50} color={LIGHT} />
            </View>
          )}

          {/*------------------- NAME -------------------*/}
          <View style={{flex: 1, marginRight: 10}}>
            <Text style={{fontWeight: 'bold'}}>{`${firstName} ${lastName}`}</Text>
            <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 12}}>{driver.user.username}</Text>
          </View>

          {/*------------------- DIALER BUTTON -------------------*/}
          <MIcon
            name="call"
            size={24}
            color={COLOR}
            style={[styles.actionIconBox, {marginRight: 20}]}
            onPress={() => {
              const link = Platform.OS === 'android' ? `tel:${mobileNumber}` : `telprompt:${mobileNumber}`;
              Linking.openURL(link);
            }}
          />

          {/*------------------- SMS BUTTON -------------------*/}
          <MIcon
            name="sms"
            size={22}
            color={COLOR}
            style={styles.actionIconBox}
            onPress={() => {
              Linking.openURL(`sms:${mobileNumber}`);
            }}
          />
        </View>

        {/* ------------------- AVATAR -------------------
        <View style={{flexDirection: 'row', padding: 20}}>
          <Text>{driver.user.person.avatar}</Text>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 20,
  },
  cardShadow: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIconBox: {
    backgroundColor: DARK,
    height: 30,
    width: 30,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
