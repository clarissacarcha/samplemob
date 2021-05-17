import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {View, Text, Image, StyleSheet, ScrollView, TouchableHighlight, ActivityIndicator, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BottomTabHeader, AlertOverlay} from '../../../../components';
import {COLOR, DARK, MEDIUM, LIGHT} from '../../../../res/constants';
import {GET_WALLET, GET_TOKTOK_WALLET, POST_TOKTOK_WALLET, TOKTOK_WALLET_ENCASH} from '../../../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {numberFormat} from '../../../../helper';
import {onError} from '../../../../util/ErrorUtility';

import FAIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ENIcon from 'react-native-vector-icons/Entypo';

const ToktokWalletCardButton = ({session}) => {
  const [initialLoading, setInitialLoading] = useState(true);

  const [getToktokWallet, {data = {getToktokWallet: {record: {}}}, loading}] = useLazyQuery(GET_TOKTOK_WALLET, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        userId: session.user.id,
      },
    },
    onCompleted: () => {
      setInitialLoading(false);
    },
  });

  const [postToktokWallet, {loading: postLoading}] = useMutation(POST_TOKTOK_WALLET, {
    fetchPolicy: 'no-cache',
    onError: onError,
    variables: {
      input: {
        userId: session.user.id,
      },
    },
    onCompleted: (result) => {
      getToktokWallet();
    },
  });

  const [toktokWalletEncash, {loading: encashLoading}] = useMutation(TOKTOK_WALLET_ENCASH, {
    fetchPolicy: 'no-cache',
    onError: onError,
    variables: {
      input: {
        userId: session.user.id,
      },
    },
    onCompleted: (result) => {
      getToktokWallet();
    },
  });

  const navigation = useNavigation();

  const onPost = () => {
    postToktokWallet();
  };

  useEffect(() => {
    getToktokWallet();
  }, []);

  if (initialLoading) {
    return null;
  }

  if (loading && data.getToktokWallet.record === null) {
    return null;
  }

  if (!data.getToktokWallet.record) {
    return (
      <>
        <AlertOverlay visible={postLoading || encashLoading} />
        <View style={{height: 20}} />
        <TouchableHighlight onPress={onPost} underlayColor={COLOR} style={[styles.submitBox, {margin: 20}]}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>Create My Toktok Wallet</Text>
          </View>
        </TouchableHighlight>
      </>
    );
  }

  return (
    <>
      <View style={styles.card}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 50,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginHorizontal: -20,
            paddingHorizontal: 20,
          }}>
          <ENIcon name="wallet" style={styles.iconBox} size={16} color="white" />
          <Text style={{flex: 1, color: DARK, fontSize: 14, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
            Toktok Wallet
          </Text>
        </View>

        {/* <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <FAIcon name="user" style={styles.iconBox} size={16} color="white" />
            <Text style={{flex: 1, color: DARK, fontSize: 12, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
              Rider ID
            </Text>
            <Text style={{fontSize: 12, color: DARK, fontFamily: 'Rubik-Medium'}}> {session.user.userId}</Text>
          </View> */}

        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <MCIcon name="credit-card-multiple" style={styles.iconBox} size={16} color="white" />
          <Text style={{flex: 1, color: DARK, fontSize: 12, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
            Available Balance
          </Text>
          {loading ? (
            <ActivityIndicator size={24} color={COLOR} />
          ) : (
            <Text style={{fontSize: 12, color: DARK, fontFamily: 'Rubik-Medium'}}>
              {numberFormat(data.getToktokWallet.record.balance)}
            </Text>
          )}
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 20}}>
          <MCIcon name="credit-card-off" style={styles.iconBox} size={16} color="white" />
          <Text style={{color: DARK, fontSize: 12, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
            Pending Encashment
          </Text>
          {/* <FAIcon
            name="question-circle"
            size={20}
            color={MEDIUM}
            style={{flex: 1}}
            onPress={() =>
              Alert.alert(
                'To Be Deducted',
                'Total credits for ongoing deliveries. Will be deducted from your credits upon completion of delivery.',
              )
            }
          /> */}
          <View style={{flex: 1}} />

          {loading ? (
            <ActivityIndicator size={24} color={COLOR} />
          ) : (
            <Text style={{fontSize: 12, color: DARK, fontFamily: 'Rubik-Medium'}}>
              {numberFormat(data.getToktokWallet.record.pendingEncashment)}
            </Text>
          )}
        </View>
      </View>
      <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
        <TouchableHighlight onPress={getToktokWallet} underlayColor={COLOR} style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>Refresh</Text>
          </View>
        </TouchableHighlight>
        <View style={{width: 20}} />
        <TouchableHighlight
          onPress={() => navigation.push('ToktokWalletHistory', {toktokWalletId: data.getToktokWallet.record.id})}
          underlayColor={COLOR}
          style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>See History</Text>
          </View>
        </TouchableHighlight>
      </View>
      <View style={{height: 20}} />
      <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
        <TouchableHighlight onPress={toktokWalletEncash} underlayColor={COLOR} style={styles.submitBox}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>Encash Available Balance</Text>
          </View>
        </TouchableHighlight>
      </View>
      <View style={{height: 20}} />
    </>
  );
};

const DriverWallet = ({navigation, session, constants}) => {
  const [getWallet, {data = {getWallet: {}}, loading}] = useLazyQuery(GET_WALLET, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        userId: session.user.id,
      },
    },
  });

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <View style={styles.container}>
      <BottomTabHeader label={['Rider', 'Wallet']} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*---------------------------------------- FORM ----------------------------------------*/}
        <View style={{alignItems: 'center', marginTop: 20}}>
          {`${constants.awsS3BaseUrl}${constants.defaultAvatar}` != session.user.person.avatar ? (
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
                source={{uri: session.user.person.avatarThumbnail}}
                resizeMode={'cover'}
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
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 50,
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginHorizontal: -20,
              paddingHorizontal: 20,
            }}>
            <ENIcon name="wallet" style={styles.iconBox} size={16} color="white" />
            <Text style={{flex: 1, color: DARK, fontSize: 14, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
              Rider Wallet
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <FAIcon name="user" style={styles.iconBox} size={16} color="white" />
            <Text style={{flex: 1, color: DARK, fontSize: 12, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
              Rider ID
            </Text>
            <Text style={{fontSize: 12, color: DARK, fontFamily: 'Rubik-Medium'}}> {session.user.userId}</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <MCIcon name="credit-card-multiple" style={styles.iconBox} size={16} color="white" />
            <Text style={{flex: 1, color: DARK, fontSize: 12, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
              Rider Credits
            </Text>
            {loading ? (
              <ActivityIndicator size={24} color={COLOR} />
            ) : (
              <Text style={{fontSize: 12, color: DARK, fontFamily: 'Rubik-Medium'}}>
                {numberFormat(data.getWallet.balance)}
              </Text>
            )}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 20}}>
            <MCIcon name="credit-card-off" style={styles.iconBox} size={16} color="white" />
            <Text style={{color: DARK, fontSize: 12, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
              To Be Deducted
            </Text>
            <FAIcon
              name="question-circle"
              size={20}
              color={MEDIUM}
              style={{flex: 1}}
              onPress={() =>
                Alert.alert(
                  'To Be Deducted',
                  'Total credits for ongoing deliveries. Will be deducted from your credits upon completion of delivery.',
                )
              }
            />

            {loading ? (
              <ActivityIndicator size={24} color={COLOR} />
            ) : (
              <Text style={{fontSize: 12, color: DARK, fontFamily: 'Rubik-Medium'}}>
                {numberFormat(data.getWallet.toBeDeducted)}
              </Text>
            )}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <MCIcon name="credit-card" style={styles.iconBox} size={16} color="white" />
            <Text style={{color: DARK, fontSize: 12, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
              Available Credits
            </Text>
            <FAIcon
              name="question-circle"
              size={20}
              color={MEDIUM}
              style={{flex: 1}}
              onPress={() =>
                Alert.alert(
                  'Available Credits',
                  "Credits used to accept orders. Your Rider Credits less To Be deducted. You can't accept orders with credit cost higher than your Available Credits.",
                )
              }
            />
            {loading ? (
              <ActivityIndicator size={24} color={COLOR} />
            ) : (
              <Text style={{fontSize: 12, color: DARK, fontFamily: 'Rubik-Medium'}}>
                {numberFormat(data.getWallet.available)}
              </Text>
            )}
          </View>
        </View>
        <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
          <TouchableHighlight onPress={getWallet} underlayColor={COLOR} style={styles.submitBox}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 20}}>Refresh</Text>
            </View>
          </TouchableHighlight>
          <View style={{width: 20}} />
          <TouchableHighlight
            onPress={() => navigation.push('DriverWalletLog')}
            underlayColor={COLOR}
            style={styles.submitBox}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 20}}>See History</Text>
            </View>
          </TouchableHighlight>
        </View>
        {/*---------------------------------------- TOKTOK WALLET ----------------------------------------*/}
        {/* <ToktokWalletCardButton session={session} /> */}
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

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = (dispatch) => ({
  createSession: (payload) => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(DriverWallet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  card: {
    backgroundColor: 'white',
    paddingHorizontal: 20,

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
  },
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  submitBox: {
    flex: 1,
    borderRadius: 10,
    marginTop: 0,
  },
  submit: {
    flex: 1,
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
