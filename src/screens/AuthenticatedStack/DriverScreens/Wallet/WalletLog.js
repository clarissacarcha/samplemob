import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM, LIGHT} from '../../../../res/constants';

const WalletLog = ({item}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>{item.type}</Text>
        {item.incoming > 0 ? (
          <Text>
            Amount: <Text style={{color: MEDIUM}}>{item.incoming}</Text>
          </Text>
        ) : (
          <Text>
            Amount: <Text style={{color: COLOR}}>{item.outgoing}</Text>
          </Text>
        )}
      </View>
      <View style={styles.info}>
        <Text>{item.transactionDate}</Text>
        <Text>
          Current Balance: <Text style={{color: ORANGE}}>{item.balance}</Text>
        </Text>
      </View>
    </View>
  );
};

export default WalletLog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 14,
  },
});
