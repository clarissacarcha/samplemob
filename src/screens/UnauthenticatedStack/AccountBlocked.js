import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Linking,
  BackHandler,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {HeaderBack, HeaderTitle} from '../../components';

import {COLOR, DARK, APP_FLAVOR, MEDIUM, LIGHT} from '../../res/constants';

import FAIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const imageWidth = Dimensions.get('window').width - 40;

const AccessDenied = require('../../assets/images/AccessDenied.png');

const AccountBlocked = ({navigation, route, createSession}) => {
  const goToLogin = () => {
    navigation.navigate('UnauthenticatedStack', {
      screen: 'Login',
    });
  };

  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack={goToLogin} />,
    headerTitle: () => <HeaderTitle label={['Access', 'Denied']} />,
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
      goToLogin();
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      <ScrollView contentContainerStyle={{alignItems: 'center'}} showsVerticalScrollIndicator={false}>
        <Image
          source={AccessDenied}
          style={{height: imageWidth, width: imageWidth, marginHorizontal: 20, marginTop: 50}}
          resizeMode="contain"
        />
        <Text style={{color: MEDIUM, fontWeight: 'bold'}}>Access denied. </Text>
        <Text style={{color: MEDIUM, fontWeight: 'bold'}}>Contact us for additional information.</Text>
        <View style={{paddingHorizontal: 20, marginTop: 20, marginBottom: 20, width: '100%'}}>
          <TouchableHighlight
            onPress={() => {
              Linking.openURL(
                'mailto:support@toktok.ph?subject=Talk%20To%20Us&body=How%20can%20we%20help%20you%20ka-toktok?',
              );
            }}
            underlayColor={COLOR}
            style={styles.card}>
            <View style={styles.taskBox}>
              {/*-------------------- EMAIL US LABEL --------------------*/}
              <View style={styles.rowBox}>
                <View style={styles.row}>
                  <FAIcon name="info" size={16} color={'white'} style={styles.iconBox} />
                  <Text style={{fontSize: 14, marginLeft: 16, color: DARK, fontWeight: 'bold'}}>Email Us</Text>
                </View>
              </View>

              {/*-------------------- SUPPORT EMAIL --------------------*/}
              <View style={styles.rowBox}>
                <View style={styles.row}>
                  <MCIcon name="email" size={16} color={'white'} style={styles.iconBox} />
                  <Text style={{fontSize: 14, marginLeft: 16, color: MEDIUM, fontWeight: 'bold'}}>
                    support@toktok.ph
                  </Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </View>
  );
};

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(
  null,
  mapDispatchToProps,
)(AccountBlocked);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBox: {
    height: 40,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LIGHT,
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
  },
  taskBox: {
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
    paddingVertical: 10,
  },

  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 5,
    paddingLeft: 20,
  },
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontWeight: 'bold',
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
    marginRight: 20,
  },
});
