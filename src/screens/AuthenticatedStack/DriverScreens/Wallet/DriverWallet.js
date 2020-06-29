import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {AlertOverlay, BottomTabHeader} from '../../../../components';
import {Shadow} from '../../../../components/widgets';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM, LIGHT} from '../../../../res/constants';
import {connect} from 'react-redux';
import {GET_WALLET, GET_WALLET_LOG} from '../../../../graphql';
import {useQuery, useLazyQuery} from '@apollo/react-hooks';
import {numberFormat} from '../../../../helper';

const imageWidth = Dimensions.get('window').width - 40;

import FAIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const DriverWallet = ({navigation, route, session, createSession}) => {
  const {firstName, lastName} = session.user.person;

  const [showHistory, setShowHistory] = useState(false);
  const [getWallet, {data = {getWallet: {}}, loading}] = useLazyQuery(GET_WALLET, {
    fetchPolicy: 'no-cache',
    variables: {
      input: {
        userId: session.user.id,
      },
    },
  });

  useEffect(() => getWallet(), []);

  return (
    <View style={styles.container}>
      <BottomTabHeader label={['', 'Wallet']} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*---------------------------------------- FORM ----------------------------------------*/}
        <View style={{marginTop: 20, alignItems: 'center'}}>
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
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,

            margin: 20,
            borderRadius: 10,
            shadowColor: '#000',

            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FAIcon name="user" style={styles.iconBox} size={16} color="white" />
            <Text style={{flex: 1, color: DARK, fontSize: 12, fontWeight: 'bold', marginHorizontal: 10}}>
              Rider Name
            </Text>
            <Text style={{fontSize: 12, color: DARK, fontWeight: 'bold'}}> {firstName + ' ' + lastName}</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <MCIcon name="credit-card-multiple" style={styles.iconBox} size={16} color="white" />
            <Text style={{flex: 1, color: DARK, fontSize: 12, fontWeight: 'bold', marginHorizontal: 10}}>
              Current Balance
            </Text>
            {!data.getWallet.balance ? (
              <ActivityIndicator size={24} color={COLOR} />
            ) : (
              <Text style={{fontSize: 12, color: DARK, fontWeight: 'bold'}}>
                {numberFormat(data.getWallet.balance)}
              </Text>
            )}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 20}}>
            <MCIcon name="credit-card-off" style={styles.iconBox} size={16} color="white" />
            <Text style={{color: DARK, fontSize: 12, fontWeight: 'bold', marginHorizontal: 10}}>To Be Deducted</Text>
            <FAIcon
              name="question-circle"
              size={20}
              color={MEDIUM}
              style={{flex: 1}}
              onPress={() =>
                Alert.alert(
                  'To Be Deducted',
                  'Total credits for ongoing deliveries. Will be be deducted from your balance upon completion of delivery.',
                )
              }
            />

            {!data.getWallet.balance ? (
              <ActivityIndicator size={24} color={COLOR} />
            ) : (
              <Text style={{fontSize: 12, color: DARK, fontWeight: 'bold'}}>
                {numberFormat(data.getWallet.toBeDeducted)}
              </Text>
            )}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MCIcon name="credit-card" style={styles.iconBox} size={16} color="white" />
            <Text style={{color: DARK, fontSize: 12, fontWeight: 'bold', marginHorizontal: 10}}>Available Balance</Text>
            <FAIcon
              name="question-circle"
              size={20}
              color={MEDIUM}
              style={{flex: 1}}
              onPress={() =>
                Alert.alert(
                  'Available Balance',
                  "Your Current Balance less To Be Deducted. You can't accept orders when your Available Balance is not enough for the order.",
                )
              }
            />
            {!data.getWallet.balance ? (
              <ActivityIndicator size={24} color={COLOR} />
            ) : (
              <Text style={{fontSize: 12, color: DARK, fontWeight: 'bold'}}>
                {numberFormat(data.getWallet.available)}
              </Text>
            )}
          </View>
        </View>
        <TouchableHighlight onPress={getWallet} underlayColor={COLOR} style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>Refresh</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => navigation.push('DriverWalletLog')}
          underlayColor={COLOR}
          style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>See History</Text>
          </View>
        </TouchableHighlight>
      </ScrollView>
      {/*---------------------------------------- BUTTON ----------------------------------------*/}
      {/* <TouchableHighlight
        onPress={() => navigation.push('DriverWalletLog')}
        underlayColor={COLOR}
        style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>See History</Text>
        </View>
      </TouchableHighlight> */}
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
    // backgroundColor: 'white',
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
    marginTop: 0,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
