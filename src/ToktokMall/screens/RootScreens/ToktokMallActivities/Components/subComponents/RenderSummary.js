import React from 'react';
import { 
    View, 
    Text,
    Image,
    StyleSheet
} from 'react-native';
import { Price  } from '../../../../../helpers';

const walletIcon = require('../../../../../assets/images/tokwaicon.png');
const paypandalogo = require('../../../../../assets/icons/paypandalogo.png')

export const RenderSummary = ({data}) => {
  return (
    <View style={styles.summaryContainer}>
        <View style={styles.summarySubContainer}>
          {data.paymentMethod == "TOKTOKWALLET" ?
            <Image source={walletIcon} style={styles.summaryWalletIcon} />
            :
            <Image source={paypandalogo} style={[styles.summaryWalletIcon, {width: 80}]} />
          }
        </View>
        <View style={{...styles.summarySubContainer, alignItems: 'flex-end'}}>
            <Text style={styles.summaryTotalText}>Total: <Text style={{fontSize: 13, color: "#F6841F", fontWeight: '600'}}><Price amount={data.totalAmount} /></Text></Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    alignItems: 'center', 
  },
  summarySubContainer: {
    flex: 1,
  },
  summaryWalletIcon: {
    width: 100, 
    height: 20, 
    resizeMode: 'contain'
  },
  summaryTotalText: {
    fontSize: 13, 
    color: "#F6841F", 
    fontWeight: '600'
  }
})