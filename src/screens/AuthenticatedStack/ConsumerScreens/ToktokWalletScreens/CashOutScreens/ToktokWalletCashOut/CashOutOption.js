import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image,Alert} from 'react-native'
import {FONT, FONT_SIZE} from '../../../../../../res/variables'
import {useNavigation} from '@react-navigation/native'
import FIcon from 'react-native-vector-icons/Feather';

const CashOutOption = ({item})=> {

    const navigation = useNavigation()

    let icon , navigateLink
    if(item.name.toLowerCase() == "gcash"){
        icon = require('../../../../../../assets/toktokwallet-assets/cash-out-providers/gcash.png')
        navigateLink = "ToktokWalletGcashHomePage"
    }else if(item.name.toLowerCase() == "bdo"){
        icon = require('../../../../../../assets/toktokwallet-assets/cash-out-providers/bdo.png')
        navigateLink = ""
    }else{
        navigateLink = ""
    }


    return (
     <TouchableOpacity style={styles.cashoutoption}
                onPress={()=> navigateLink != "" ? navigation.navigate(navigateLink,{
                    provider: item
                }
            ) : Alert.alert("","Temporary Unavailable")}
     >
            <View style={styles.logo}>
                <Image source={icon} style={{height: 35, width: 35}} resizeMode="contain"/>
            </View>
            <View style={styles.name}>
                <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.BOLD}}>{item.name}</Text>
                <Text style={{fontSize: FONT_SIZE.S, fontFamily: FONT.REGULAR}}>Use {item.name} to cash out</Text>
            </View>
            <View style={styles.arrowright}>
                <FIcon name="chevron-right" size={16} color={"#A6A8A9"} /> 
            </View>
    </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    cashoutoption: {
        paddingVertical: 20,
        borderBottomWidth: 0.2,
        borderColor: "silver",
        flexDirection: "row",
    },
    logo: {
        flexBasis: 45,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    name: {
        flex: 1,
        justifyContent: "center",
        alignItems:"flex-start",
    },
    arrowright: {
        justifyContent: "center",
        alignItems: "flex-end",
    }
})

export default CashOutOption