import React from 'react';
import { 
    View, 
    Text,
    Image,
    StyleSheet
} from 'react-native';
import { shopIcon } from '../../../../../assets';

export const RenderStore = ({data}) => {
  const items = data.items;

  const renderTotalItems = () => {
    const total = items.reduce((prevTotal, newTotal) => prevTotal + newTotal.quantity, 0);
    return total <= 1 ? `${total} item` : `${total} items`;
  }
  
  return (
    <View style={styles.storeContainer}>
        <View style={styles.storeLeftContainer}>
            <Image source={shopIcon} style={styles.storeWalletImage} />
            <Text style={styles.storeShopName}>{data.shopName}</Text>
        </View>
        <View style={styles.storeItemContainer}>
            <Text style={styles.storeItemText}>{renderTotalItems()}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    storeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16
    },
    storeLeftContainer: {
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center'
    },
        storeWalletImage: {
        width: 25, 
        height: 25, 
        resizeMode: 'contain'
    },
    storeShopName: {
        fontSize: 13, 
        marginLeft: 8,
        fontWeight: "400"
    },
    storeItemContainer: {
        flex: 1, 
        alignItems: 'flex-end', 
        justifyContent: 'center'
    },
    storeItemText: {
        fontSize: 13, 
        fontWeight: "400"
    },
})