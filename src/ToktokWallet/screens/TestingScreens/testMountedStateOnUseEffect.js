import React , {useEffect,useState} from 'react'
import {View , Text , StyleSheet , TouchableOpacity } from 'react-native'
import { HeaderBack, HeaderTitle , VectorIcon , ICON_SET } from 'src/revamp'
import { Separator } from 'toktokwallet/components'
import {useAccount} from 'toktokwallet/hooks'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT  } = CONSTANTS

const AccountOption = ({route,params={},title , navigation})=> (
    <>
    <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate(route,params)}>
                <View style={styles.name}>
                    <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{title}</Text>
                </View>
                <View style={styles.arrowright}>
                       <VectorIcon iconSet={ICON_SET.Feather} name="chevron-right" size={20} color={'#A6A8A9'}/> 
                </View>
    </TouchableOpacity>
    <View style={styles.divider}/>
    </>
)

export const ToktokWalletUpgradeAccount = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Upgrade Account','']}/>,
    })
    const [mounted,setMounted] = useState(false)
    const { tokwaAccount , getMyAccount} = useAccount()
    useEffect(()=>{
        getMyAccount()
        setTimeout(()=> {
            setMounted(true)
        },5000)
        return ()=> {
            setMounted(false)
        }
    },[])
    
    return (
        <>
            <Separator/>
            <View style={styles.container}>
                    <AccountOption title="Fully Verified Account" navigation={navigation} route=""/>
                    <AccountOption title="Enterprise Account" navigation={navigation} route=""/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    settingoption: {
        padding: 16,
        paddingVertical: 15,
        flexDirection: "row",
        backgroundColor:"white"
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