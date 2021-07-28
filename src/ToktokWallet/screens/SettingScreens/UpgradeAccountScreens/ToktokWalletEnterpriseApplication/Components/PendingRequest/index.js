import React from 'react';
import { View , Text , StyleSheet , Image} from 'react-native';
import SuccessIcon from 'toktokwallet/assets/images/success.png';
import CONSTANTS from 'common/res/constants';

const { SHADOW , COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

export const PendingRequest = ({enterpriseRequest})=> {

    return (
       <View style={styles.container}>
           <View style={styles.messageBox}>
               <View style={{justifyContent:"center",alignItems:"center"}}>
                    <Image source={SuccessIcon} style={{height:50,width:50}}/>
              </View>
              <View style={{flex: 1,marginLeft: 15}}>
                  <Text style={styles.messageText}>
                    Your business documents have been submitted. These documents are for review and approval.
                  </Text>
              </View>
           </View>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding:16,
    },
    messageBox: {
        padding: 16,
        borderRadius: 5,
        backgroundColor:"white",
        ...SHADOW,
        flexDirection:"row",
        padding: 16,
        paddingVertical: 30,     
    },
    messageText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        textAlign:"left"
    }
})