import React from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity, Dimensions} from 'react-native'
import { YellowButton } from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS


const {width,height} = Dimensions.get("window")

const renderExternalDetails = (externalDetails)=> {

    try {

        if(!externalDetails) return null
        let data = JSON.parse(externalDetails)
        data = Object.entries(data)
        if(!data) return null

        return (
            <>
            {
                data.map((data,index)=> {
                    if(!data[0] && !data[1]) return null
                    const key = data[0]
                    const value = data[1]
                    return (
                        <>
                        <Text key={`externalDetails_${index}`} style={styles.labelText}>{key}: {value}</Text>
                        </>
                    )
                })
            }
            </>
        )
    }catch(error){
        return null;
    }
}

const renderCashOutDisplayInformations = (cashOutDisplayInformations) => {

    if(cashOutDisplayInformations?.accountInfo){
        return (
            <>
            <Text style={styles.labelText}>Account Name: {cashOutDisplayInformations.accountInfo.accountName}</Text>
            <Text style={styles.labelText}>Account Number: {cashOutDisplayInformations.accountInfo.accountNumber}</Text>
            <Text style={styles.labelText}>Bank: {cashOutDisplayInformations?.accountInfo?.bank?.name}</Text>
            </>
        )
    }

    if(cashOutDisplayInformations?.gcashInfo){
        return (
            <>
            <Text style={styles.labelText}>Account Name: {cashOutDisplayInformations.gcashInfo.accountName}</Text>
            <Text style={styles.labelText}>Account Number: {cashOutDisplayInformations.gcashInfo.accountNumber}</Text>
            </>
        )
    }

    if(cashOutDisplayInformations?.bdoInfo){
        return (
            <>
           <Text style={styles.labelText}>Account Name: {cashOutDisplayInformations.bdoInfo.accountName}</Text>
            <Text style={styles.labelText}>Account Number: {cashOutDisplayInformations.bdoInfo.accountNumber}</Text>
            </>
        )
    }
  
}

export const TransactionDetails = ({
    visible,
    setVisible,
    transactionInfo,
    cashOutDisplayInformations,
    cashInMobileNumber
})=> {

    const {
        refNo,
        refDate,
        label,
        phrase,
        amount,
        status,
        displayNumber,
        externalReferenceNumber,
        deliveryId,
        externalDetails
    } = transactionInfo

    return (
        <>
            <Modal
                visible={visible}
                setVisible={setVisible}
                transparent={true}
                onRequestClose={()=>setVisible(false)}
                style={styles.container}
            >
                <View style={styles.content}>
                    <View style={{
                        width: width * 0.9,
                        backgroundColor:"white",
                        borderRadius: 5,
                        padding: 16,
                    }}>
                       <View>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>{label}</Text>
                            <Text style={styles.labelText}>{phrase}</Text>
                            {displayNumber != "" && <Text style={styles.labelText}>{displayNumber}</Text>}
                            { status && <Text style={styles.labelText}>Status: {status}</Text>}
                            {/* { deliveryId && <Text style={styles.labelText}>Delivery ID: {deliveryId}</Text>} */}
                            { renderExternalDetails(externalDetails) }
                            { cashInMobileNumber && <Text style={styles.labelText}>Account Number: {cashInMobileNumber}</Text>}
                            { renderCashOutDisplayInformations(cashOutDisplayInformations)}
                            <View style={{marginTop: 10}}>
                                <Text style={styles.labelText}>Amount: {amount}</Text>
                                <Text style={styles.labelText}>Ref No: {refNo}</Text>
                                <Text style={styles.labelText}>Date & Time: {refDate}</Text>
                            </View>
                       </View>
                       <View style={{justifyContent:"flex-end", width: "50%",alignSelf:"center",marginTop: 16}}>
                            <YellowButton label="Ok" onPress={()=>setVisible(false)}/>
                        </View>
                    </View>
                </View>

            </Modal>
        </>
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
