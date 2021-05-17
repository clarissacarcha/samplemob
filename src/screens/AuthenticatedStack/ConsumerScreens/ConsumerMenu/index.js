import React from 'react';
import {APP_FLAVOR, DARK, LIGHT, MEDIUM} from '../../../../res/constants';
import {COLOR, FONT, SIZE, FONT_SIZE} from '../../../../res/variables';
import {VectorIcon, ICON_SET} from '../../../../revamp/';

import {Image, ScrollView, StyleSheet, Text, TouchableHighlight, View, StatusBar} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import OneSignal from 'react-native-onesignal';
import ToktokWashed from '../../../../assets/images/ToktokWashed.png';

import {Header} from './Components';

const DrawerButton = ({label, onPress, restrict}) => {
  if (restrict && restrict != APP_FLAVOR) {
    return null;
  }

  return (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR.WHITE_UNDERLAY} style={styles.submitBox}>
      <View style={styles.submit}>
        <Text style={styles.headerText}>{label}</Text>
        <VectorIcon
          iconSet={ICON_SET.Entypo}
          name="chevron-thin-right"
          color={COLOR.BLACK}
          size={16}
          style={{marginRight: 2}}
        />
      </View>
    </TouchableHighlight>
  );
};

const Drawer = ({navigation}) => {
  const session = useSelector((state) => state.session);
  const constants = useSelector((state) => state.constants);
  const dispatch = useDispatch();

  let fullName = '';
  if (session.user) {
    if (APP_FLAVOR == 'C') {
      const {firstName, lastName} = session.user.person;
      fullName = `${firstName} ${lastName}`;
    }

    if (APP_FLAVOR == 'D') {
      const {firstName, lastName} = session.user.person;
      fullName = `${firstName} ${lastName}`;
    }
  }

  const onSignOut = () => {
    OneSignal.deleteTag('userId');
    dispatch({type: 'DESTROY_SESSION'});
    navigation.replace('UnauthenticatedStack', {
      screen: 'Login',
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'space-between'}}>
      <View style={{flex: 1}}>
        <Header>
          <View style={{marginTop: StatusBar.currentHeight, margin: SIZE.MARGIN}}>
            {/*--------------- AVATAR ---------------*/}
            {`${constants.awsS3BaseUrl}${constants.defaultAvatar}` != session.user.person.avatar ? (
              <View
                style={{
                  height: 80,
                  borderRadius: 5,
                  // justifyContent: 'flex-start',
                  // alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={{uri: session.user.person.avatarThumbnail}}
                  resizeMode={'cover'}
                  style={{width: 80, height: 80, backgroundColor: 'black', borderRadius: 5}}
                />
                <Text style={{marginLeft: 8, fontSize: FONT_SIZE.XL, fontFamily: FONT.BOLD}}>{fullName}</Text>
              </View>
            ) : (
              <View
                style={{
                  height: 80,
                  width: 80,
                  backgroundColor: '#333',
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={ToktokWashed}
                  resizeMode={'contain'}
                  tintColor={MEDIUM}
                  style={{width: 40, height: 40, borderRadius: 5}}
                />
              </View>
            )}
            {/*--------------- FULL NAME ---------------*/}
          </View>
        </Header>
        <View style={{height: SIZE.MARGIN / 2, backgroundColor: COLOR.LIGHT}} />

        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
            {/*--------------- MY DELIVERIES ---------------*/}
            <DrawerButton
              label="My Saved Locations"
              onPress={() => {
                navigation.push('SavedLocations');
              }}
              restrict="C"
            />

            {/*--------------- ANNOUNCEMENTS ---------------*/}
            <DrawerButton
              label="Announcements"
              onPress={() => {
                navigation.push('Announcements');
              }}
            />

            {/*--------------- TALK TO US ---------------*/}
            <DrawerButton
              label="Talk to Us"
              onPress={() => {
                navigation.push('TalkToUs');
              }}
            />

            {/*--------------- CHANGE PASSWORD ---------------*/}
            <DrawerButton
              label="Change Password"
              onPress={() => {
                navigation.push('ConsumerChangePassword');
              }}
            />

            {/*--------------- CHANGE PASSWORD ---------------*/}
            <DrawerButton label="Sign Out" onPress={onSignOut} />
          </ScrollView>
        </View>
      </View>
      {/*--------------- SIGN OUT ---------------*/}
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  submitBox: {
    marginHorizontal: SIZE.MARGIN,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.LIGHT,
  },
  submit: {
    backgroundColor: COLOR.WHITE,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: SIZE.MARGIN / 2,
  },

  headerText: {
    // fontFamily: FONT.BOLD,
  },
});
