import React from 'react';
import {APP_FLAVOR, MEDIUM, APP_VERSION} from '../../../../../res/constants';
import {COLOR, FONT, SIZE, FONT_SIZE} from '../../../../../res/variables';
import {VectorIcon, ICON_SET} from '../../../../../revamp/';
import {AUTH_CLIENT, END_USER_SESSION} from '../../../../../graphql';
import {onError} from '../../../../../util/ErrorUtility';
import {AlertOverlay} from '../../../../../components';
import {useMutation} from '@apollo/react-hooks';
import CONSTANTS from '../../../../../common/res/constants';
import {Image, ScrollView, StyleSheet, Text, TouchableHighlight, View, StatusBar, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import RNFS from 'react-native-fs';

import OneSignal from 'react-native-onesignal';
import ToktokWashed from '../../../../../assets/images/ToktokWashed.png';
import RightArrow from '../../../../../assets/icons/profileMenu-arrow-rightIcon.png';

import {Header} from './Components';
import { ToktokMallSession } from '../../../../../ToktokMall/util/session';

const DrawerButton = ({label, onPress, restrict}) => {
  if (restrict && restrict != APP_FLAVOR) {
    return null;
  }

  return (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR.WHITE_UNDERLAY} style={styles.submitBox}>
      <View style={styles.submit}>
        <Text style={styles.headerText}>{label}</Text>
        {/* <VectorIcon
          iconSet={ICON_SET.Entypo}
          name="chevron-thin-right"
          color={COLOR.BLACK}
          size={16}
          style={{marginRight: 2}}
        /> */}
        <Image source={RightArrow} style={{color: 'red', height: 12, width: 15}} resizeMode={'contain'} />
      </View>
    </TouchableHighlight>
  );
};

export const ToktokLandingMenu = ({navigation}) => {
  const session = useSelector(state => state.session);
  const constants = useSelector(state => state.constants);
  const dispatch = useDispatch();
  const userName = session.user.username;
  const [endUserSession, {loading}] = useMutation(END_USER_SESSION, {
    client: AUTH_CLIENT,
    onError: onError,
    onCompleted: ({endUserSession}) => {
      onSignOut();
    },
  });

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
    // End User Session

    if (RNFS.CachesDirectoryPath) RNFS.unlink(RNFS.CachesDirectoryPath);
    OneSignal.deleteTag('userId');
    dispatch({type: 'DESTROY_SESSION'});
    ToktokMallSession.destroy();
    navigation.replace('UnauthenticatedStack', {
      screen: 'Login',
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'space-between'}}>
      <AlertOverlay visible={loading} />
      <View style={{flex: 1}}>
        <Header>
          <View style={{margin: SIZE.MARGIN}}>
            {/*--------------- AVATAR ---------------*/}
            {`${constants.awsS3BaseUrl}${constants.defaultAvatar}` != session.user.person.avatar ? (
              <View
                style={{
                  height: 80,
                  borderRadius: 5,
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <Image
                  source={{uri: session.user.person.avatarThumbnail}}
                  resizeMode={'cover'}
                  style={{width: 80, height: 80, backgroundColor: 'black', borderRadius: 50}}
                />
                <Text style={{fontSize: FONT_SIZE.XL, fontFamily: FONT.BOLD, paddingTop: 5}}>{fullName}</Text>
                <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR, paddingTop: 3}}>
                  {session.user.username}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('ToktokProfile');
                  }}>
                  <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR, color: COLOR.ORANGE, paddingTop: 5}}>
                    View Profile
                  </Text>
                </TouchableOpacity>
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
          <Text style={{paddingLeft: 20, paddingTop: 20, paddingBottom: 15, fontFamily: FONT.BOLD}}> Account</Text>
          <ScrollView>
            {/*--------------- MY DELIVERIES ---------------*/}
            {/* <DrawerButton
              label="Saved Addresses"
              onPress={() => {
                navigation.push('ToktokSavedLocations');
              }}
              restrict="C"
            /> */}
            {/*--------------- CHANGE PASSWORD ---------------*/}
            <DrawerButton
              label="Change Password"
              onPress={() => {
                navigation.push('EnterPassword', {userName});
              }}
            />

            {/*--------------- ANNOUNCEMENTS ---------------*/}
            <DrawerButton
              label="Announcements"
              onPress={() => {
                navigation.push('ToktokAnnouncements');
              }}
            />
            {/*--------------- TALK TO US ---------------*/}
            <Text
              style={{
                paddingLeft: 20,
                paddingTop: 20,
                borderTopWidth: 5,
                borderTopColor: '#F8F8F8',
                paddingBottom: 15,
                fontFamily: FONT.BOLD,
              }}>
              Help Centre
            </Text>

            <DrawerButton
              label="Contact Us"
              onPress={() => {
                navigation.push('TalkToUs');
              }}
            />

            {/*--------------- CHANGE PASSWORD ---------------*/}
            <View
              style={{
                borderTopWidth: 5,
                borderTopColor: '#F8F8F8',
                fontFamily: FONT.BOLD,
              }}></View>
            <DrawerButton label="Log Out" onPress={endUserSession} />
          </ScrollView>
        </View>
      </View>
      {/*--------------- SIGN OUT ---------------*/}
      <View>
        <Text style={styles.appVersionStyle}>{APP_VERSION}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  submitBox: {
    marginHorizontal: 13,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.LIGHT,
  },
  submit: {
    backgroundColor: COLOR.WHITE,
    // height: 50,
    paddingVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: SIZE.MARGIN / 2,
  },

  headerText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    lineHeight: FONT_SIZE.L,
  },
  appVersionStyle: {
    paddingLeft: 16,
    paddingBottom: 12,
    color: CONSTANTS.COLOR.GRAY,
  },
});
