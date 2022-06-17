import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList,Dimensions} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {useNavigation} from '@react-navigation/native';
import {Separator, WalletLog} from 'toktokwallet/components';
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp';
import { useAccount } from 'toktokwallet/hooks';

//SELF IMPORTS
import Log from './Log';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS
const {height,width} = Dimensions.get("window")

const WalletRecentTransactions = () => {
  const navigation = useNavigation();
  const {checkIfTpinIsSet,tokwaAccount} = useAccount();

  const TopUpNow = ()=> {

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
        {
          tokwaAccount?.wallet?.allTransactions?.length > 5 &&
          <TouchableOpacity onPress={ViewTransactions} style={{flex: 1, justifyContent: 'flex-end' , flexDirection:"row"}}>
            <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR, color: '#FF8A48'}}>See All</Text>
            <VectorIcon 
              iconSet={ICON_SET.Entypo}
              name="chevron-thin-right"
              size={10}
              color={COLOR.ORANGE}
              style={{
                alignSelf:"center",
                marginLeft: 10
              }}
            />
          </TouchableOpacity>
        }
       
      </View>

      <View style={styles.transactions}>
        {
          tokwaAccount?.wallet?.recentTransactions?.map((item,index)=>(
            <Log
              key={`recentLog${index}`}
              transaction={item}
              itemsLength={tokwaAccount?.wallet?.recentTransactions}
              index={index}
            />
          ))
        }
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

