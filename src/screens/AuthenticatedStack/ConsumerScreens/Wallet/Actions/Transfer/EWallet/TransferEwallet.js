import React from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity} from 'react-native'
import {HeaderBack,HeaderTitle} from '../../../../../../../components'
import { FONT_MEDIUM, FONT_REGULAR, FONT_SEMIBOLD } from '../../../../../../../res/constants'
import FIcon from 'react-native-vector-icons/Feather'

const TransferEwallet = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Transfer to Ewallet','']}/>
    })

    return(
       <View style={styles.container}>
           <View style={{marginTop: 10,borderBottomColor: "silver",borderBottomWidth: .5,paddingBottom:15,}}>
                <Text style={{fontSize: 12,fontFamily: FONT_SEMIBOLD}}>Enter Amount (PHP)</Text>
                <Text style={{fontSize: 12,fontFamily: FONT_REGULAR,color: "#909294"}}>Transferable balance: PHP 2000.00</Text>
                <TextInput 
                        style={styles.input}
                        placeholder="0"
                />
           </View>
           <View style={styles.EwalletList}>
                 <Text style={{fontSize: 12,fontFamily: FONT_SEMIBOLD}}>Send To</Text>
                 <TouchableOpacity style={styles.EWallet}>
                        <View style={styles.AddCardBox}>
                            <FIcon name={'plus'} color={'#F6841F'} size={14}/>
                        </View>
                        <View style={{justifyContent: "center",alignItems: "flex-end",flexGrow: 1}}>
                            <FIcon name={'chevron-right'} size={14}/>
                        </View>
                 </TouchableOpacity>
           </View>

       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "white"
    },
    input: {
        padding: 5,
        borderRadius: 5,
        borderColor:"gray",
        borderWidth: .5,
        marginTop: 10,
        fontFamily: FONT_REGULAR
    },
    EwalletList: {
        marginTop: 15,
    },
    EWallet: {
        paddingVertical: 10,
        borderBottomColor: "silver",
        borderBottomWidth: .5,
        flexDirection: "row"
    },
    AddCardBox: {
        height: 30,
        width: 50,
        borderRadius: 5,
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: "#F6841F",
        justifyContent: "center",
        alignItems: "center"
    }
})

export default TransferEwallet