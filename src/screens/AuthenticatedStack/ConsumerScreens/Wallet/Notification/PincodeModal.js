import React , {useState,useRef , useEffect} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,TextInput,TouchableHighlight,Image} from 'react-native'
import { COLOR, DARK, FONT_MEDIUM } from '../../../../../res/constants';
import {GET_VERIFY_TOKTOK_WALLET_PIN} from '../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import {onError} from '../../../../../util/ErrorUtility'

const NumberBox = ({onPress,value}) => (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10,marginHorizontal: 5,}}>
      <View style={styles.inputView}>
        <Text style={{fontSize: 25}}>{value ? "*" : "_"}</Text>
      </View>
    </TouchableHighlight>
);

const NumberBoxes = ({pinCode, onNumPress}) => {

    const numberBoxes = [];
    var i;
    for (i = 0; i <= 3; i++) {
      numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]}/>);
    }
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
            {numberBoxes}
        </View>
    );
 };

const PincodeModal = ({showpinModal,setShowPinModal , onConfirm})=> {

    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const [getVerifyToktokWalletPIN, {data,error,loading}] = useLazyQuery(GET_VERIFY_TOKTOK_WALLET_PIN,{
        fetchPolicy: 'network-only',
        onError: onError,
        onCompleted: (response)=> {
            onConfirm()
            setTimeout(()=>{
                setPinCode("")
            },2000)
        }
    })

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };
    
    const onSubmit = () => {
       getVerifyToktokWalletPIN({
            variables: {
                input: {
                    pincode: pinCode
                }
            },
       })
    };

    useEffect(()=>{
        if(pinCode.length == 4){
            getVerifyToktokWalletPIN({
                variables: {
                    input: {
                        pincode: pinCode
                    }
                },
           })
        }
    },[pinCode])


    return (
        <Modal
            visible={showpinModal}
            onRequestClose={()=>{
                setShowPinModal(false)
                setPinCode("")
            }}
            transparent={false}
            animationType="fade"
            style={styles.container}
        >

            <View style={styles.content}>
                <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                    <Image style={{height: 100,width: 100}} source={require('../../../../../assets/icons/walletVerify.png')}/>
                    <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM,marginTop: 20,}}>Enter your PIN</Text>
                    <View style={{position: 'relative',marginTop: 50,}}>
                        <NumberBoxes pinCode={pinCode} onNumPress={onNumPress}/>
                        <TextInput
                            caretHidden
                            autoFocus={true}
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            if (value.length <= 4) {
                                setPinCode(value);
                            }
                            }}
                            //onSubmitEditing={onSubmit}
                        />
                    </View>
               </View>

{/*             
                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setShowPinModal(false)
                    }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: "transparent" ,borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_MEDIUM}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onSubmit} style={{height: "100%",flex: 1,marginLeft: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Next</Text>
                    </TouchableOpacity>
                </View> */}

            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        justifyContent:"center",
        alignItems: "center",
        padding: 20,
        flex: 1,
    },
    inputView: {
        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        paddingHorizontal: 20,
        fontSize: 25,
        color: DARK,
        width: 30,
    },
    proceedBtn: {
        height: 40,
        width: "100%",
        flexDirection: "row",
        marginTop: 100,
    },
})

export default PincodeModal