import React from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {COLOR, DARK, MEDIUM, LIGHT, APP_FLAVOR} from '../res/constants';
import FIcon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import {TouchableOpacity} from 'react-native-gesture-handler';

const Drawer = ({navigation, session, destroySession}) => {
  let fullName = '';
  if (session.user) {
    if (APP_FLAVOR == 'C') {
      const {firstName, lastName} = session.user.person;
      fullName = `${firstName} ${lastName}`;
    }

    if (APP_FLAVOR == 'D') {
      fullName = 'Driver Name';
    }
  }

  const onSignOut = () => {
    destroySession();
    navigation.navigate('UnauthenticatedStack', {
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

          {/*--------------- FULL NAME ---------------*/}
          <Text style={[styles.headerText, {marginTop: 10, color: COLOR, textAlign: 'center'}]}>{fullName}</Text>

          {/*--------------- OLD EDIT PROFILE BUTTON ---------------*/}
          {/* <TouchableOpacity onPress={() => navigation.navigate('CustomerProfile')}>
            <View style={{flexDirection: 'row', padding: 10}}>
              <Text style={[styles.headerText, {fontWeight: 'normal', fontSize: 10, marginRight: 5}]}>
                Edit Profile
              </Text>
              <FAIcon name="edit" size={14} color="white" />
            </View>
          </TouchableOpacity> */}
        </View>

        {/*------------------------------ MENU BUTTONS ------------------------------*/}
        {/*--------------- PROFILE ---------------*/}
        <TouchableHighlight
          onPress={() => navigation.navigate('CustomerProfile')}
          underlayColor={COLOR}
          style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={styles.headerText}>Profile</Text>
          </View>
        </TouchableHighlight>

        {/*--------------- MY DELIVERIES ---------------*/}
        <TouchableHighlight
          onPress={() => {
            const route = APP_FLAVOR == 'C' ? 'CustomerDeliveries' : 'DriverDeliveriesTab';
            navigation.push(route);
            navigation.closeDrawer();
          }}
          underlayColor={COLOR}
          style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={styles.headerText}>My Deliveries</Text>
          </View>
        </TouchableHighlight>

        {/*--------------- ANNOUNCEMENTS---------------*/}
        <TouchableHighlight
          onPress={() => navigation.navigate('Announcements')}
          underlayColor={COLOR}
          style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={styles.headerText}>Announcements</Text>
          </View>
        </TouchableHighlight>

        {/*--------------- TALK TO US ---------------*/}
        <TouchableHighlight
          onPress={() => navigation.navigate('TalkToUs')}
          underlayColor={COLOR}
          style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={styles.headerText}>Talk To Us</Text>
          </View>
        </TouchableHighlight>
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
