import React , {useState, useEffect} from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image,Dimensions} from 'react-native'
import {HeaderBack, HeaderTitle} from '../../../../../../components'
import FIcon from 'react-native-vector-icons/Feather';
import { FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../../res/constants';
import { numberFormat } from '../../../../../../helper';
import Separator from '../../Components/Separator';

const {height,width} = Dimensions.get("window")

export default ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Cash Out','']}/>,
    })

    const [percentage,setPercentage] = useState(100)

    useEffect(()=>{
        setPercentage(()=>{
            const rawPercentage = (( route.params.walletinfo.balance - route.params.walletinfo.balance ) / route.params.walletinfo.balance ) * 100
            return 100 - rawPercentage
        })
    },[])

    const SettingOption = ({route,icon,title,iconSize , params={}})=> (
        <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate(route, params)}>
                    <View style={styles.logo}>
                         <Image source={icon} style={{height: iconSize.height, width: iconSize.width}} resizeMode="contain"/>
                    </View>
                    <View style={styles.name}>
                        {/* <Text style={{fontSize:SIZES.M,fontFamily: FONT_MEDIUM}}>{title}</Text> */}
                        <Text style={{fontSize:SIZES.M,fontFamily: FONT_MEDIUM}}>{title}</Text>
                        <Text style={{fontSize: SIZES.S, fontFamily: FONT_LIGHT}}>Use {title} to cash out</Text>
                    </View>
                    <View style={styles.arrowright}>
                           {/* <Text style={{fontSize: 16,color: "gray"}}>{'>'}</Text> */}
                           <FIcon name="chevron-right" size={16} color={"#A6A8A9"} /> 
                    </View>
        </TouchableOpacity>
    )

    return (
     <>
     <Separator/>
      <View style={styles.container}>
          {/* <View style={styles.transferDetails}>
                <Text style={{fontSize: SIZES.L,fontFamily: FONT_MEDIUM}}>Current Balance</Text>
                <Text style={{fontSize: 20,color:"#F6841F",marginVertical: 5,fontFamily: FONT_MEDIUM}}>PHP {numberFormat(route.params.walletinfo.balance)}</Text>
          </View> */}
          <View style={styles.transferOptions}>
                <SettingOption 
                    route="ToktokWalletGcashCashOut" 
                    params={{walletinfo: route.params.walletinfo}} 
                    iconSize={{height: 40, width: 40}} 
                    icon={require('../../../../../../assets/icons/gcash.png')} 
                    title="GCash"
                />
          </View>
      </View>
      </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    transferDetails: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor:"silver",
        justifyContent:"center",
        alignItems:"center"
    },
    transferOptions: {
        flex: 1,
        paddingHorizontal: 15,
    },
    settingoption: {
        padding: 10,
        paddingVertical: 20,
        borderBottomWidth: 0.2,
        borderColor: "silver",
        flexDirection: "row"
    },
    logo: {
        flexBasis: 50,
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