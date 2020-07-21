import React from 'react';
import {View, Text, TouchableHighlight, StyleSheet, Image} from 'react-native';
import {COLOR, DARK, MEDIUM, LIGHT, APP_FLAVOR} from '../res/constants';
import FIcon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import OneSignal from 'react-native-onesignal';

const DrawerButton = ({label, onPress, restrict}) => {
  if (restrict && restrict != APP_FLAVOR) {
    return null;
  }

  return (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={styles.submitBox}>
      <View style={styles.submit}>
        <Text style={styles.headerText}>{label}</Text>
      </View>
    </TouchableHighlight>
  );
};

const Drawer = ({navigation, session, constants, destroySession}) => {
  let fullName = '';
  let avatar = '';
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
    destroySession();

    OneSignal.deleteTag('userId');

    navigation.replace('UnauthenticatedStack', {
      screen: 'Login',
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#222222', justifyContent: 'space-between'}}>
      <View>
        {/*------------------------------ DRAWER HEADER------------------------------*/}
        <View style={styles.header}>
          {/*--------------- HEADER BUTTON ---------------*/}
          <View style={styles.borderHidden}>
            <TouchableHighlight onPress={() => navigation.closeDrawer()} underlayColor={COLOR}>
              <View style={styles.closeDrawer}>
                <FIcon name="chevron-left" size={24} color={COLOR} />
              </View>
            </TouchableHighlight>
          </View>

          {/*--------------- HEADER TITLE ---------------*/}
          <Text style={styles.headerText}>
            Tara lets <Text style={{color: COLOR}}>ka-toktok</Text>
          </Text>
        </View>

        {/*------------------------------ PROFILE ------------------------------*/}
        <View style={{marginTop: 10, alignItems: 'center'}}>
          {/*--------------- AVATAR ---------------*/}
          {/* TODO: If has driver avatar, show avatar, else show placeholder */}
          {`${constants.awsS3BaseUrl}${constants.defaultAvatar}` != session.user.person.avatar ? (
            <View
              style={{
                height: 90,
                width: 90,
                backgroundColor: '#333',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: session.user.person.avatarThumbnail}}
                resizeMode={'cover'}
                style={{width: 90, height: 90, backgroundColor: 'black', borderRadius: 10}}
              />
            </View>
          ) : (
            <View
              style={{
                height: 90,
                width: 90,
                backgroundColor: '#333',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FAIcon name="user" size={70} color={MEDIUM} />
            </View>
          )}
          {/*--------------- FULL NAME ---------------*/}
          <Text style={[styles.headerText, {marginTop: 10, color: COLOR, textAlign: 'center'}]}>{fullName}</Text>

          {/*--------------- OLD EDIT PROFILE BUTTON ---------------*/}
          {/* <TouchableOpacity onPress={() => navigation.navigate('ConsumerProfile')}>
            <View style={{flexDirection: 'row', padding: 10}}>
              <Text style={[styles.headerText, {fontWeight: 'normal', fontSize: 10, marginRight: 5}]}>
                Edit Profile
              </Text>
              <FAIcon name="edit" size={14} color="white" />
            </View>
          </TouchableOpacity> */}
        </View>

        {/*--------------- PROFILE ---------------*/}
        <DrawerButton
          label="Profile"
          onPress={() => {
            const route = APP_FLAVOR == 'C' ? 'ConsumerProfile' : 'DriverProfile';
            navigation.closeDrawer();
            navigation.push(route);
          }}
        />

        {/*--------------- WALLET ---------------*/}
        {/* <DrawerButton
          label="Wallet"
          onPress={() => {
            // const route = APP_FLAVOR == 'C' ? 'CustomerProfile' : 'DriverProfile';
            const route = 'DriverWallet';
            navigation.navigate(route);
          }}
        /> */}

        {/*--------------- MY DELIVERIES ---------------*/}
        <DrawerButton
          label="My Deliveries"
          onPress={() => {
            navigation.closeDrawer();
            navigation.push('CustomerDeliveries');
          }}
          restrict="C"
        />

        {/*--------------- Notifications ---------------*/}
        <DrawerButton
          label="Notifications"
          onPress={() => {
            navigation.push('Notifications');
            navigation.closeDrawer();
          }}
        />

        {/*--------------- ANNOUNCEMENTS ---------------*/}
        <DrawerButton
          label="Announcements"
          onPress={() => {
            navigation.push('Announcements');
            navigation.closeDrawer();
          }}
        />

        {/*--------------- TALK TO US ---------------*/}
        <DrawerButton
          label="Talk to Us"
          onPress={() => {
            navigation.push('TalkToUs');
            navigation.closeDrawer();
          }}
        />
      </View>

      {/*--------------- SIGN OUT ---------------*/}
      <TouchableHighlight onPress={onSignOut} underlayColor={COLOR} style={[styles.submitBox, {marginBottom: 20}]}>
        <View style={styles.submit}>
          <Text style={styles.headerText}>Sign Out</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  submitBox: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: '#333333',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  borderHidden: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeDrawer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    backgroundColor: '#333',
    borderRadius: 10,
  },
});
