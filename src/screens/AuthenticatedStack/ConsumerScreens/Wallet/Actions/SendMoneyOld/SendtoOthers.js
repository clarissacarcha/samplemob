import React from 'react'
import {Text,View,TouchableOpacity,StyleSheet} from 'react-native'
import { COLOR, DARK, FONT_BOLD, FONT_MEDIUM, FONT_REGULAR } from '../../../../../../res/constants'


const SendtoOthers = ({searchString, checkAccount})=> {

    const chooseRecipient = ()=> {
        return checkAccount(searchString)
    }

    return (
        <View style={styles.Others}>
                <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16}}>Send money to this number?</Text>
                <Text style={{marginVertical: 15, fontFamily: FONT_BOLD,fontSize: 20,color: "gray"}}>{searchString}</Text>
                <TouchableOpacity
                    onPress={chooseRecipient}
                    style={{
                    padding: 10,
                    justifyContent:"center",
                    alignItems: "center",
                    backgroundColor: DARK,
                    width: "100%",
                    borderRadius: 10,
                    }}
                >
                    <Text style={{fontFamily: FONT_REGULAR,fontSize: 12,color:COLOR}}>NEXT</Text>
                </TouchableOpacity>
        </View> 
    )
}

const styles = StyleSheet.create({
    Others: {
        justifyContent:"center",
        alignItems: "center"
      }
})

export default SendtoOthers