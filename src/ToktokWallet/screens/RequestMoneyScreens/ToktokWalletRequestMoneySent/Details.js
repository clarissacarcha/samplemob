import React , {useState} from "react";
import { View, Text, StyleSheet ,Dimensions} from 'react-native';
import { TransactionModal } from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const { width } = Dimensions.get("window")

const Details = ({
    transaction,
    visible,
    setVisible
})=> {

    const {
        name,
        phrase,
        amount,
        refNo,
        refDate,
        sourceAccount
    } = transaction

    return (
        <TransactionModal
            visible={visible}
            setVisible={setVisible}
        >
            <View>
                 <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>{name}</Text>
                 <Text style={styles.labelText}>{phrase}</Text>
                 <Text style={styles.labelText}>Mobile Number: {sourceAccount?.mobileNumber}</Text>
                 <Text style={styles.labelText}>Amount: {amount}</Text>
                 <Text style={styles.labelText}>Date & Time: {refDate}</Text>
            </View>
        </TransactionModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor:"rgba(0,0,0, 0.1)",
        justifyContent:"center",
        alignItems:"center"
    },
    labelText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
    }
})

export default Details
