import React , {useState,useCallback} from 'react'
import {View,Text,StyleSheet,Image,Platform,KeyboardAvoidingView,TextInput,TouchableOpacity,Alert} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import { HeaderTitle , HeaderBackClose } from '../../../../../../components'
import {GET_GCASH_ACCOUNT} from '../../../../../../graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import Loader from '../../../../CommonScreens/GCashAccount/Loader';
import {useSelector} from 'react-redux'
import { COLOR, DARK, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR, MEDIUM } from '../../../../../../res/constants';
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../../helper';
import ConfirmModal from './ConfirmModal'

const GcashEnchashment = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose/>,
        headerTitle: ()=> <HeaderTitle label={['Gcash Encashment','']}/>,
    })

    const walletinfo = route.params.walletinfo
    const session = useSelector(state=>state.session)
    const [amount,setAmount] = useState(walletinfo.balance.toString())
    const [showModal,setShowModal] = useState(false)
    const [data,setData] = useState({getGCashAccount: {record: null}})

    const changeAmount = (value)=>{
        let num = value.replace(/[^0-9]/g, '')
        setAmount(num.substring(0,1) == 0 ? num.slice(1) : num)
    }

    const confirmAmount = ()=> {
        if(amount === "") return Alert.alert("Enter Amount");
        if(amount > +walletinfo.balance){
            setAmount(walletinfo.balance.toString())
            return Alert.alert("Amount should not be greater than wallet balance")
        }
        setShowModal(true)
    }


    const [getGCashAccount, {error , loading}] = useLazyQuery(GET_GCASH_ACCOUNT, {
      fetchPolicy: 'no-cache',
      variables: {
        input: {
          personId: session.user.person.id,
        },
      },
      onError: (e) => console.log(e),
      onCompleted: (res) => setData(res),
    });

    useFocusEffect(useCallback(()=>{
        getGCashAccount()
    },[]))

    if (loading) {
        return <Loader />;
    }
    
    if (error) {
        return <Loader />;
    }


    if(!data.getGCashAccount.record){
        return (
            <View style={styles.container}>
             
                <View style={styles.gcashAccountInfo}>
                    <Image style={{height: 50,width: 50,alignSelf: "center"}} source={require('../../../../../../assets/icons/gcash.png')}/>
                    <View style={[styles.details,{flex: 1}]}>
                            <Text style={{marginHorizontal: 15,fontSize: 14,fontFamily: FONT_MEDIUM}}>Register and Verify your Gcash Account Details</Text>
                    </View>
                </View>
                <View style={styles.registerBtnView}>
                    <TouchableOpacity onPress={()=>navigation.push("GCashAccount")} style={styles.registerBtn}>
                        <Text style={styles.registerBtnText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    if(data.getGCashAccount.record.status === 0){
        return (
            <View style={styles.container}>
             
                <View style={styles.gcashAccountInfo}>
                    <Image style={{height: 50,width: 50,alignSelf: "center"}} source={require('../../../../../../assets/icons/gcash.png')}/>
                    <View style={[styles.details,{flex: 1}]}>
                            <Text style={{marginHorizontal: 15,fontSize: 14,fontFamily: FONT_MEDIUM}}>Account Verification Pending</Text>
                    </View>
                </View>
                <View style={styles.registerBtnView}>
                    <TouchableOpacity onPress={()=>navigation.push("GCashAccount")} style={styles.registerBtn}>
                        <Text style={styles.registerBtnText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    if(data.getGCashAccount.record.status === 2){
        return (
            <View style={styles.container}>
             
                <View style={styles.gcashAccountInfo}>
                    <Image style={{height: 50,width: 50,alignSelf: "center"}} source={require('../../../../../../assets/icons/gcash.png')}/>
                    <View style={[styles.details,{flex: 1}]}>
                            <Text style={{marginHorizontal: 15,fontSize: 14,fontFamily: FONT_MEDIUM}}>Previous account rejected, please update.</Text>
                    </View>
                </View>
                <View style={styles.registerBtnView}>
                    <TouchableOpacity onPress={()=>navigation.push("GCashAccount")} style={styles.registerBtn}>
                        <Text style={styles.registerBtnText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    
    

    return (
        <>
        <ConfirmModal showModal={showModal} setShowModal={setShowModal} amount={amount} walletinfo={walletinfo} session={session} navigation={navigation}/>
        <View style={styles.container}>
            <View style={styles.gcashAccountInfo}>
                <Image style={{height: 50,width: 50,alignSelf: "center"}} source={require('../../../../../../assets/icons/gcash.png')}/>
                <View style={styles.details}>
                     <Text style={{marginLeft: 15,fontSize: 14,fontFamily: FONT_MEDIUM}}>{`${data.getGCashAccount.record.firstName} ${data.getGCashAccount.record.middleName ? data.getGCashAccount.record.middleName + " " : ""}${data.getGCashAccount.record.lastName}`}</Text>
                     <Text style={{marginLeft: 15,fontSize: 12,fontFamily: FONT_REGULAR}}>{data.getGCashAccount.record.mobileNumber}</Text>
                     <Text style={{marginLeft: 15,fontSize: 10,fontFamily: FONT_LIGHT}}>Gcash Account verified <FIcon5 style={{color:"green"}} name="check"/></Text>
                </View>
            </View>

            <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.amountcontent}>
                        
                        <View style={{flexDirection: "row"}}>
                            <Text style={{fontSize: 50,fontFamily: FONT_MEDIUM}}>{'\u20B1'}</Text>
                            <TextInput 
                                    value={amount}
                                    onChangeText={value=>changeAmount(value)}
                                    keyboardType="numeric"
                                    style={styles.input}
                                    placeholder="0.00"
                                    onSubmitEditing={confirmAmount}
                                />
                        </View>
                        <Text style={{color:"gray",fontSize: 14,fontFamily: FONT_REGULAR}}>Current Balance {'\u20B1'} {numberFormat(walletinfo.balance)}</Text>
            </KeyboardAvoidingView>

            <View style={styles.cashinbutton}>
                    <TouchableOpacity onPress={confirmAmount} style={{height: "100%",width: "100%",backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Encash</Text>
                    </TouchableOpacity>
            </View>
        </View> 
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    gcashAccountInfo: {
        height: 80,
        width: "100%",
        flexDirection: "row",
        padding: 10,
        borderWidth: 0.5,
        borderColor: "silver"
    },
    details: {
        alignSelf: "center"
    },
    amountcontent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: MEDIUM,
        borderRadius: 5,
        height: 60,
        flexShrink: 1,
        width: 150,
        color: DARK,
        fontFamily: FONT_MEDIUM,
        fontSize: 30,
        marginBottom: 10,
        textAlign: "center"
    },
    cashinbutton: {
        height: 60,
        width: "100%",
        padding: 10,
    },
    registerBtnView: {
        padding: 10,
    },
    registerBtn: {
        justifyContent:"center",
        alignItems:"center",
        height: 20,
        width: "100%",
        backgroundColor:DARK,
        paddingVertical: 18,
        borderRadius: 5,
    },
    registerBtnText: {
        color: COLOR,
        fontFamily: FONT_REGULAR
    }
})

export default GcashEnchashment

