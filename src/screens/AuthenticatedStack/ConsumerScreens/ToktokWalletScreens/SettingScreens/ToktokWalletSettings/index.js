import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image} from 'react-native'
import {HeaderBackClose, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../../components'
import FIcon from 'react-native-vector-icons/Feather';
import {FONT,FONT_SIZE,COLOR} from '../../../../../../res/variables';
import {Separator} from '../../Components';
import { HeaderBack } from '../../../../../../revamp';

const ToktokWalletSettings = ({navigation , route })=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Settings','']}/>,
    })

    const SettingOption = ({route,params={},title})=> (
        <>
        <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate(route,params)}>
                    <View style={styles.name}>
                        <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{title}</Text>
                    </View>
                    <View style={styles.arrowright}>
                           {/* <Text style={{fontSize: 16,color: "gray"}}>{'>'}</Text> */}
                           <FIcon name="chevron-right" size={20} color={'#A6A8A9'}/> 
                    </View>
        </TouchableOpacity>
        <View style={styles.divider}/>
        </>
    )

    return (    
        <>
        <Separator />
        <View style={styles.container}>
            <SettingOption route="ToktokWalletCreatePin" title="Change Pin"/>
            <SettingOption route="ToktokWalletCreatePin" title="Cash In Logs"/>
            <SettingOption route="ToktokWalletCreatePin" title="Cash Out Logs"/>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    settingoption: {
        padding: 16,
        paddingVertical: 15,
        flexDirection: "row"
    },
    logo: {
        flexBasis: 45,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    name: {
        flex: 1,
        justifyContent: "space-evenly"
    },
    arrowright: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "flex-end"
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})

export default ToktokWalletSettings