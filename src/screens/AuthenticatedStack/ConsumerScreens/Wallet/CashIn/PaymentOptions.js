import React from 'react'
import {View,StyleSheet,Text,Image,FlatList,Alert,ActivityIndicator} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FIcon from 'react-native-vector-icons/Feather'
import {HeaderBackClose, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../components'
import { COLOR, FONT_LIGHT, FONT_MEDIUM, SIZES } from '../../../../../res/constants'
import {useQuery} from '@apollo/react-hooks'
import {GET_CASH_IN_METHODS} from '../../../../../graphql'

const PaymentOptions = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In','']}/>,
    })

    const {data: cashinmethods,error,loading} = useQuery(GET_CASH_IN_METHODS,{
            fetchPolicy: 'network-only',
            variables: {
                input: {
                    sourceAccountType: 9,
                    destinationAccountType: 1,
                }
            },
    })

    if (loading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        );
    }

    if(error){
        console.log(error)
    }

    const CashInMethod = ({item,index})=> {
        let image , navigateLink
        if(item.name.toLowerCase() == "paypanda"){
            image = require('../../../../../assets/images/walletcashin/paypanda.png')
            navigateLink = "ToktokWalletPayPandaForm"
        }else{
            navigateLink = ""
        }
        return (
            <TouchableOpacity 
                key={`cashin-${index}`}
                style={styles.cashinoption} onPress={()=> navigateLink != "" ? navigation.navigate(navigateLink,{
                        walletinfo: route.params.walletinfo,
                        transactionType: item
                    }
                ) : Alert.alert("Temporary Unavailable")}>
                <View style={styles.logo}>
                    <Image style={{height: 35,width: 35}} resizeMode="contain" source={image} />
                </View>
                <View style={styles.name}>
                    <Text style={{fontSize:SIZES.M,fontFamily: FONT_MEDIUM}}>{item.name}</Text>
                    <Text style={{fontSize: SIZES.S, fontFamily: FONT_LIGHT}}>Use {item.name.toLowerCase()} to cash in</Text>
                </View>
                <View style={styles.arrowright}>
                    <FIcon name={'chevron-right'} color={"#A6A8A9"}/>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
                <FlatList 
                    data={cashinmethods.getCashInMethods}
                    keyExtractor={(item)=>item.id}
                    renderItem={CashInMethod}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    cashinoption: {
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

export default PaymentOptions