import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../components'

const Settings = ({navigation})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['Settings','']}/>,
    })
    return (    
        <View style={styles.container}>
                 <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate("TokTokWalletCashInLogs")}>
                    <View style={styles.logo}>
                        
                    </View>
                    <View style={styles.name}>
                        <Text style={{fontSize:16}}>Cash in Logs</Text>
                        <Text style={{fontSize: 12, color: "gray"}}>View your cash in logs</Text>
                    </View>
                    <View style={styles.arrowright}>
                           <Text style={{fontSize: 16,color: "gray"}}>{'>'}</Text>
                    </View>
                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    settingoption: {
        padding: 10,
        paddingVertical: 20,
        borderWidth: 0.5,
        borderColor: "silver",
        flexDirection: "row"
    },
    logo: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    name: {
        flex: 1,
        justifyContent: "space-evenly"
    },
    arrowright: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "flex-end"
    }
})

export default Settings