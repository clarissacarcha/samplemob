import React , {useState} from "react";
import { View, Text, StyleSheet ,Dimensions} from 'react-native';
import { TransactionModal } from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const { width } = Dimensions.get("window")


const renderDetails = ({details})=> {
  
    if(details){
        const data = Object.entries(details)
        const RenderInfo = data.map((data,index)=> {
            if(!data[0] && !data[1]) return null
            const key = data[0]
            const value = data[1]
            console.log(key,value)
            return (
                <Text key={`externalDetails_${index}`} style={styles.labelText}>{key}: {value}</Text>
            )
        })
        return RenderInfo
    }

    return null
  
}

const Details = ({
    transaction,
    visible,
    setVisible
})=> {

    const {
        name,
        phrase,
        displayInfo,
    } = transaction


    return (
        <TransactionModal
            visible={visible}
            setVisible={setVisible}
        >
            <View>
                 <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>{name}</Text>
                 <Text style={styles.labelText}>{phrase}</Text>
                 <View style={{marginTop: 15}}>
                    {renderDetails({details: displayInfo})}
                </View>
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
