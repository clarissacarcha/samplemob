import React from 'react';
import {View, StyleSheet, Text, Image, FlatList, ActivityIndicator} from 'react-native';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import {connect} from 'react-redux';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM, LIGHT} from '../../../../res/constants';
import NoData from '../../../../assets/images/NoData.png';
import WalletLog from './WalletLog';
import {useQuery} from '@apollo/react-hooks';
import {GET_WALLET_LOG} from '../../../../graphql';
import {useFocusEffect} from '@react-navigation/native';

const DriverWalletLog = ({navigation, route, session, createSession}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Wallet', 'History']} />,
  });

  const {data, loading, error, refetch} = useQuery(GET_WALLET_LOG, {
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

  if (data.getWallet.walletLog.length === 0) {
    return (
      <View style={styles.center}>
        <Image source={NoData} style={styles.image} resizeMode={'contain'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.getWallet.walletLog}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <WalletLog item={item} lastItem={data.getWallet.walletLog.length === index + 1 ? true : false} />
        )}
      />
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
)(DriverWalletLog);

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
  image: {
    height: 100,
  },
});
