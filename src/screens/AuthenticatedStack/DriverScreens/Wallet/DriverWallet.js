/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableHighlight, ActivityIndicator} from 'react-native';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM, LIGHT} from '../../../../res/constants';
import {connect} from 'react-redux';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {GET_WALLET} from '../../../../graphql';
import {useQuery} from '@apollo/react-hooks';
import {useFocusEffect} from '@react-navigation/native';

const DriverWallet = ({navigation, route, session, createSession}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['', 'Wallet']} />,
  });

  const [firstName, setFirstName] = useState(session.user.person.firstName);
  const [lastName, setLastName] = useState(session.user.person.lastName);

  const {data, loading, error, refetch} = useQuery(GET_WALLET, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        tokUsersId: session.user.id,
      },
    },
  });

  useFocusEffect(() => {
    refetch();
  }, [session.user.id]);

  const renderBalance = () => {
    if (loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={24} color={COLOR} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>SOMETHING WENT WRONG</Text>
        </View>
      );
    }

    return (
      <View style={{flex: 1}}>
        <Text style={styles.label}>Balance</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>
          {data.getWallet.balance}
        </Text>

        <Text style={styles.label}>Floating</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>
          {data.getWallet.balance}
        </Text>
      </View>
    );
  };

  const seeHistory = () => {
    navigation.navigate('DriverWalletLog');
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*---------------------------------------- FORM ----------------------------------------*/}
        <View style={{marginTop: 20, alignItems: 'center'}}>
          {/*--------------- AVATAR ---------------*/}
          {/* TODO: If has driver avatar, show avatar, else show placeholder */}
          {true ? (
            <View
              style={{
                height: 120,
                width: 120,
                backgroundColor: MEDIUM,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}>
              <Image
                source={{uri: session.user.person.avatar}}
                resizeMode={'contain'}
                style={{width: 120, height: 120, borderRadius: 10}}
              />
            </View>
          ) : (
            <View
              style={{
                height: 120,
                width: 120,
                backgroundColor: MEDIUM,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}>
              <FAIcon name="user" size={90} color={LIGHT} />
            </View>
          )}
        </View>
        <Text style={styles.label}>Rider Name</Text>
        <Text style={[styles.input, {height: 50, textAlignVertical: 'center', color: MEDIUM}]}>
          {firstName + ' ' + lastName}
        </Text>

        {renderBalance()}

        {/* <Text style={styles.label}>Email Address</Text>
        <TextInput
          value={emailAddress}
          onChangeText={value => setEmailAddress(value)}
          style={styles.input}
          placeholder="Email Address"
        /> */}
      </ScrollView>
      {/*---------------------------------------- BUTTON ----------------------------------------*/}
      <TouchableHighlight onPress={seeHistory} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>See History</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverWallet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
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
  submitBox: {
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
