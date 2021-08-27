import React , {useContext} from 'react'
import {View,Text,StyleSheet,Dimensions,Image,TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {VectorIcon, ICON_SET} from 'src/revamp';
import CONSTANTS from 'common/res/constants'
import { useThrottle } from 'src/hooks';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS
const {height,width} = Dimensions.get("window")


const DriverWalletMethods = ()=> {

    const navigation = useNavigation()

    const CashOut = ()=> {
        return navigation.navigate("ToktokWalletCashOutHomePage")
    }

    const onPressThrottled = useThrottle(CashOut , 2000)

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity onPress={onPressThrottled} style={styles.riderMethods}>
                    <Image source={require('toktokwallet/assets/images/send-money.png')} />
                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,marginLeft: 15,flex:1}}>Cash Out</Text>
                    <View style={styles.proceedRightArrow}>
                        <VectorIcon iconSet={ICON_SET.Entypo} name="chevron-right" size={15} color={COLOR.ORANGE}/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        width: width,
        paddingHorizontal: 16,
        marginTop: -35,
    },
    content: {
        height:"100%",
        width:"100%",
        alignSelf:"center",
        backgroundColor:"white",
        borderRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 10,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:'center',
        flexDirection: "row",
    },  
    walletMethod: {
        height: "100%",
        width: (width * 0.9) / 4,
        justifyContent:"center",
        alignItems:"center",
        zIndex: 99999
    },
    proceedRightArrow: {
        padding: 2,
        borderWidth:2,
        borderColor:COLOR.ORANGE,
        borderRadius: 200,
        justifyContent:"center",
        alignItems:'center'
    },
    riderMethods: {
        flexDirection:"row",
        flex: 1,
        padding: 16,
        alignItems:'center',
    }
})

export default DriverWalletMethods