import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList,Dimensions} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {useNavigation} from '@react-navigation/native';
import {Separator, WalletLog} from 'toktokwallet/components';
import { YellowButton } from 'src/revamp';
import {APP_FLAVOR , ACCOUNT_TYPE} from 'src/res/constants';
import { useAccount } from 'toktokwallet/hooks';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS
const {height,width} = Dimensions.get("window")

const WalletRecentTransactions = () => {
  const navigation = useNavigation();
  const {checkIfTpinIsSet,tokwaAccount} = useAccount();

  const TopUpNow = ()=> {
      if(APP_FLAVOR == "D" && ACCOUNT_TYPE == 2){
          return Alert.alert("","Use the toktok customer app for toktokwallet full features.")
      }

      const tpinIsSet = checkIfTpinIsSet();
      if(!tpinIsSet) return

      return navigation.navigate("ToktokWalletPaymentOptions")
  
  }

  const CashInNow = ()=> (
        <View style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
          <Image style={{height: 219,width: 291}} source={require('toktokwallet/assets/images/Landing-page.png')}/>
          <View style={{width: "40%", justifyContent:'center',marginTop: 20}}>
              <YellowButton label="Cash In Now" onPress={TopUpNow}/>
          </View>
      </View>
  )

const LoadingScreen = ()=>(
      <View style={{...styles.container, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={COLOR.YELLOW} />
      </View>
)

const RecentRecords = ()=> (
  <>
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
          data={tokwaAccount.wallet.recentTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => {
            return (
              <WalletLog
                key={`recentLog${index}`}
                item={item}
                itemsLength={tokwaAccount.wallet.recentTransactions}
                index={index}
              />
            );
          }}
        />
      </View>
  </>
)


  const ViewTransactions = () => {
    return navigation.navigate('ToktokWalletTransactions', {allTransactions: tokwaAccount.wallet.allTransactions});
  };

  return (
    <>
       <View style={styles.container}>
            {
              tokwaAccount?.wallet?.recentTransactions?.length == 0
              ? <CashInNow/>
              : <RecentRecords/>
            }
      </View>
   </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    flex: 1,
    // height: height - 280
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
