import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Separator, CheckIdleState, BuildingBottom} from 'toktokwallet/components';
import {getStatusbarHeight, numberFormat} from 'toktokwallet/helper';
import {useAccount} from 'toktokwallet/hooks';
import {YellowButton} from 'src/revamp';
import CONSTANTS from 'common/res/constants';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const ContentInfo = ({title, balance, body}) => {
  return (
    <>
      <View style={styles.divider} />
      <View style={styles.content}>
        <View style={styles.title}>
          <View style={{flex: 1}}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{...styles.titleText, color: 'black'}}>
              PHP {balance ? numberFormat(balance) : numberFormat(0)}
            </Text>
          </View>
        </View>
        <View>
          <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M, textAlign: 'justify'}}>{body}</Text>
        </View>
      </View>
    </>
  );
};

export const ToktokWalletBalanceInfo = ({navigation, route}) => {
  navigation.setOptions({
    headerShown: false,
  });

  const {tokwaAccount} = useAccount();

  return (
    <CheckIdleState>
      <View style={styles.container}>
        <View style={{padding: 16, marginTop: 20}}>
          <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L}}>ka-toktok, did you know?</Text>
        </View>
        <ContentInfo
          balance={tokwaAccount.wallet.transferableBalance}
          title="Transferable Amount"
          body="Cash Ins via online banks, debit card, OTC bank, OTC non-bank and JC Wallet can be transferred to other toktokwallet users’ accounts and/or bank accounts."
        />
        <ContentInfo
          balance={tokwaAccount.wallet.creditCardBalance}
          title="Non-Transferable Amount"
          body="Cash Ins via credit card, or foreign debit card cannot be transferred to any toktokwallet user's accounts and/or bank accounts. This toktokwallet balance can only be used as payments for goods and services."
        />
        <View style={{flex: 1, justifyContent: 'flex-end', padding: 16}}>
          <YellowButton label="Close" onPress={() => navigation.pop()} />
        </View>
        <BuildingBottom />
      </View>
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: getStatusbarHeight,
  },
  content: {
    padding: 16,
    marginVertical: 10,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLOR.YELLOW,
  },
  title: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  titleText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    color: COLOR.YELLOW,
  },
});
