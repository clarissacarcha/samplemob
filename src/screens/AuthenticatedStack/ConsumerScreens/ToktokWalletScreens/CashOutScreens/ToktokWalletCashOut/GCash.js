import React , {useEffect, useState} from 'react'
import {Text,Modal,View , StyleSheet,TouchableHighlight, Dimensions,Image,TouchableOpacity,StatusBar} from 'react-native'
import {GET_GCASH_ACCOUNT} from '../../../../../../graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import {useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'
import { COLORS, FONTS, SIZES } from '../../../../../../res/constants';

//SELF IMPORTS
import CashOutOption from './CashOutOption'


const {width,height} = Dimensions.get("window")

const PromptMessage = ({visible,setVisible,onRegister})=> {

    const Register = ()=> {
        setVisible(false)
        onRegister()
    }

    return (
        <>
         <StatusBar barStyle="dark-content" backgroundColor={visible ? "rgba(34, 34, 34, 0.5)" : "transparent"} />
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={()=>setVisible(false)}
            style={styles.promptMessage}
        >
            <TouchableHighlight underlayColor={"rgba(34,34,34,0.5)"} onPress={()=>setVisible(false)} style={styles.promptMessageContent}>
                    <View/>
            </TouchableHighlight>

            <View style={styles.promptContent}>
                    <Image style={{height: 90,width: 90}} resizeMode="contain" source={require('../../../../../../assets/icons/gcash.png')}/>
                    <View style={{alignItems:"center"}}>
                        <Text style={{fontFamily: FONTS.BOLD, fontSize: SIZES.M,color: COLORS.DARK}}>Register and verify</Text>
                        <Text style={{fontFamily: FONTS.BOLD, fontSize: SIZES.M,color: COLORS.DARK}}>your GCash account details.</Text>
                    </View>
                    <TouchableOpacity 
                        style={{
                            width: "100%",
                            paddingVertical: 2,
                            alignItems:"center"
                        }}
                        onPress={Register}
                    >
                        <Text style={{fontFamily: FONTS.BOLD, fontSize: SIZES.M,color: COLORS.ORANGE}}>Register</Text>
                    </TouchableOpacity>
                  
            </View>
        </Modal>
        </>
    )
}

const GCash = ({walletinfo})=> {

    const [data,setData] = useState(null)
    const [visible,setVisible] = useState(false)
    const session = useSelector(state=>state.session)
    const navigation = useNavigation()

    const [getGCashAccount, {error , loading}] = useLazyQuery(GET_GCASH_ACCOUNT, {
        fetchPolicy: 'no-cache',
        onError: (e) => console.log(e),
        onCompleted: (res) => checkAccount(res),
      });
  
    const checkAccount = (res)=> {
        setData(res.getGCashAccount)
        if(!res.getGCashAccount.record){
          return setVisible(true)
        }

        if(res.getGCashAccount.record.status == 1){
            return navigation.navigate("ToktokWalletGcashCashOut", {walletinfo , gcashAccount: res.getGCashAccount.record})
        }

        return navigation.navigate("ToktokWalletGcashRegistration")

    }

    const GCashCashOut = ()=> {
        getGCashAccount({
            variables: {
                input: {
                    personId: session.user.person.id,
                  },
            }
        })
    }

    const onRegister = ()=> {
         return navigation.navigate("ToktokWalletGcashRegistration")
    }


    return (
        <>
        <PromptMessage visible={visible} setVisible={setVisible} onRegister={onRegister}/>
        <CashOutOption 
                onPress={GCashCashOut}
                iconSize={{height: 35, width: 35}} 
                icon={require('../../../../../../assets/icons/gcash.png')} 
                title="GCash"
        />
        </>
    )
}

const styles = StyleSheet.create({
    promptMessage: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center"
    },
    promptMessageContent: {
        flex:1,
        backgroundColor:"rgba(34,34,34,0.5)",
        position:"absolute",
        height: "100%",
        width:"100%",
        zIndex: -1
    },
    promptContent: {
        height: 227,
        width: 280,
        backgroundColor:"white",
        borderRadius: 10,
        alignSelf:"center",
        marginTop: height * 0.5 - (227 / 2),
        alignItems:"center",
        justifyContent: "space-between",
        padding: 16,
    }
})

export default GCash