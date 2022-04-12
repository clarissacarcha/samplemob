import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { FONT } from '../../../../../res/variables';

export const RenderBuyAgain = ({ data, onPressBuy}) => {
  
  return data?.status?.status === 4 ||  data?.status?.status === 5?
    <View style={styles.container}> 
        <TouchableOpacity style={styles.buyAgainButton} onPress={() => onPressBuy()} >
            <Text style={styles.buyAgainText}>Buy Again</Text>
        </TouchableOpacity>
    </View>
  : <></>
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth:.50,
        borderTopColor:'rgba(0, 0, 0, 0.25)',
        paddingVertical: 15,
        paddingHorizontal: 32,

    },
    buyAgainButton: {
      height: 40,
      backgroundColor: "#F6841F",
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center'
    },
    buyAgainText: {
      color: "#fff", 
      fontSize: 13,
      fontWeight: "600",
      fontFamily: FONT.BOLD,
      lineHeight:16
    },
  }) 