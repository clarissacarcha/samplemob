import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList} from 'react-native';
import {SomethingWentWrong} from '../../../../../components';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../graphql';
import {GET_TRANSACTIONS} from '../../../../../graphql/toktokwallet';
import {useQuery} from '@apollo/react-hooks';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {useNavigation} from '@react-navigation/native';
import {Separator, WalletLog} from '../Components';
import { YellowButton } from '../../../../../revamp';
import {APP_FLAVOR , ACCOUNT_TYPE} from '../../../../../res/constants';
import { CheckWalletAccountRestrictionContext } from './CheckWalletAccountRestriction';



const WalletRecentTransactions = () => {
  const navigation = useNavigation();
  const checkWallet = useContext(CheckWalletAccountRestrictionContext)

  const {data, error, loading} = useQuery(GET_TRANSACTIONS, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        pageIndex: 0,
      },
    },
    onCompleted: ({getTransactions}) => {
      //   console.log(JSON.stringify(getTransactions));
    },
  });

  const TopUpNow = ()=> {
    if(APP_FLAVOR == "D" && ACCOUNT_TYPE == 2){
        return Alert.alert("","Use the toktok customer app for toktokwallet full features.")
    }
    if(checkWallet.checkIfAllowed()){
        return navigation.navigate("ToktokWalletPaymentOptions")
    }
}

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={COLOR.YELLOW} />
      </View>
    );
  }

  if (error) {
    return <SomethingWentWrong />;
  }

  if (data.getTransactions.recentTransactions.length == 0 && APP_FLAVOR == "C" && ACCOUNT_TYPE == 1) {
    return (
      <View style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
          <Image style={{height: 219,width: 291}} source={require('../../../../../assets/toktokwallet-assets/Landing-page.png')}/>
          <View style={{width: "40%", justifyContent:'center',marginTop: 20}}>
              <YellowButton label="Cash In Now" onPress={TopUpNow}/>
          </View>
      </View>
    );
  }

  const ViewTransactions = () => {
    return navigation.navigate('ToktokWalletTransactions', {allTransactions: data.getTransactions.allTransactions});
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', marginTop: 0, paddingBottom: 0}}>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text style={styles.title}>Recent Transactions</Text>
        </View>
        <TouchableOpacity onPress={ViewTransactions} style={{flex: 1, alignItems: 'flex-end'}}>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD, color: '#FF8A48'}}>See More</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactions}>
        <FlatList
          style={{flex: 1, backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={data.getTransactions.recentTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => {
            return (
              <WalletLog
                key={`recentLog${index}`}
                item={item}
                itemsLength={data.getTransactions.recentTransactions}
                index={index}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.M,
    color: '#212529',
    fontFamily: FONT.BOLD,
  },
  transactions: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default WalletRecentTransactions;
