import React from 'react';
import {View, StyleSheet, Text, Image, FlatList, ActivityIndicator, Dimensions} from 'react-native';
import {HeaderBack, HeaderTitle} from '../../../../components';
import {connect} from 'react-redux';
import {COLOR, DARK, ORANGE, MEDIUM, LIGHT} from '../../../../res/constants';
import NoData from '../../../../assets/images/NoData.png';
import {useQuery} from '@apollo/react-hooks';
import {GET_WALLET_LOGS} from '../../../../graphql';
import {numberFormat} from '../../../../helper';

const imageWidth = Dimensions.get('window').width - 200;

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

const WalletLog = ({item, lastItem}) => (
  <View
    style={{
      backgroundColor: 'white',
      padding: 20,
      margin: 20,
      marginBottom: lastItem ? 20 : 0,
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
      <EIcon
        name={item.incoming != 0 ? 'arrow-bold-down' : 'arrow-bold-up'}
        style={styles.iconBox}
        size={18}
        color="white"
      />
      <View style={{flex: 1}}>
        <Text style={{color: DARK, fontSize: 12, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>{item.type}</Text>
        <Text style={{color: MEDIUM, fontSize: 10, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
          {item.transactionDate}
        </Text>
      </View>
      {!(item.incoming == 0 && item.outgoing == 0) && (
        <EIcon name={item.incoming != 0 ? 'plus' : 'minus'} size={14} color={item.incoming != 0 ? 'green' : 'red'} />
      )}

      {!(item.incoming == 0 && item.outgoing == 0) ? (
        <Text style={{color: item.incoming != 0 ? 'green' : 'red', fontSize: 14, fontFamily: 'Rubik-Medium'}}>
          {item.incoming != 0 ? numberFormat(item.incoming) : numberFormat(item.outgoing)}
        </Text>
      ) : (
        <Text style={{color: MEDIUM, fontSize: 14, fontFamily: 'Rubik-Medium'}}>0.00</Text>
      )}
    </View>
  </View>
);

const DriverWalletLog = ({navigation, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Wallet', 'History']} />,
  });

  const {data, loading, error, refetch} = useQuery(GET_WALLET_LOGS, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        walletId: session.user.wallet.id,
      },
    },
  });

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

  if (data.getWalletLogs.length === 0) {
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
        data={data.getWalletLogs}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <WalletLog item={item} lastItem={data.getWalletLogs.length === index + 1 ? true : false} />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 5,
    paddingLeft: 20,
  },
  image: {
    height: imageWidth,
    width: imageWidth,
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
