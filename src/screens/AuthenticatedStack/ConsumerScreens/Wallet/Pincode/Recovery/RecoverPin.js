import React , {useEffect,useState,useRef} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,TextInput, TouchableHighlight} from 'react-native'
import {useSelector} from 'react-redux'
import { HeaderBackClose , HeaderTitle} from '../../../../../../components'
import { COLOR, DARK, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import {GET_VERIFICATION_CODE,CHECK_VERIFICATION_CODE} from '../../../../../../graphql'
import { onError } from '../../../../../../util/ErrorUtility'

const NumberBox = ({onPress, value , showPin}) => (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10,marginHorizontal: 5,}}>
      <View style={styles.inputView}>
        <Text style={{fontSize: 25}}>{value ? showPin ? value : "*" : '_'}</Text>
      </View>
    </TouchableHighlight>
);

const NumberBoxes = ({pinCode, onNumPress, showPin}) => {

    const numberBoxes = [];
    var i;
    for (i = 0; i <= 5; i++) {
      numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]} showPin={showPin}/>);
    }
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20,alignSelf:"center",marginTop: 20}}>
            {numberBoxes}
        </View>
    );
};


const RecoverPin = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose/>,
        headerTitle: ()=> <HeaderTitle label={['','']}/>,
    })

    const session = useSelector(state=>state.session)
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();

    const [getVerificationCode , {data, error, loading}] = useLazyQuery(GET_VERIFICATION_CODE, {
        fetchPolicy: "network-only",
        onCompleted: (response)=> {
            console.log(response)
        }
    })

    const [checkVerificationCode] = useLazyQuery(CHECK_VERIFICATION_CODE,{
        fetchPolicy: "network-only",
        onError: onError,
        onCompleted: (response)=> {
            console.log(response)
            if(response.checkVerificationCode.message){
                navigation.navigate("ToktokWalletUpdatePin")
            }
        }
    })

    const confirmCode = ()=> {
        checkVerificationCode({
            variables: {
                input: {
                    code: pinCode
                }
            },
        })
    }


    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };


    useEffect(()=>{
        getVerificationCode()
        return ()=> {

        }
    },[])

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 90}  
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
        >
                <View style={{flex: 1,alignItems:"center"}}>
                    <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16,color:"gray"}}>Enter verification code sent to</Text>
                    <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16}}>{session.user.username}</Text>
                    {/* <TextInput 
                        // autoFocus={true}
                        style={styles.input}
                        placeholder="0 0 0 0 0 0"
                        keyboardType="number-pad"
                        value={code}
                        onChangeText={(value)=>{
                            setCode(value)
                        }}
                        /> */}

                        <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={true}/>
                        <TextInput
                            autoFocus={true}
                            caretHidden
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            if (value.length <= 6) {
                                const code = value.replace(/[^0-9]/,"")
                                setPinCode(code);
                            }
                            }}
                            // onSubmitEditing={onSubmit}
                        />

                </View>
                <View style={styles.bottomActions}>
                    <View style={{flex: 1,justifyContent:"center"}}>
                        <Text style={{fontFamily: FONT_REGULAR,fontSize: SIZES.M}}>Didn't receive it?</Text>
                        <TouchableOpacity onPress={getVerificationCode}>
                            <Text style={{fontFamily: FONT_MEDIUM,fontSize: SIZES.M}}>Request a new code</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1,alignItems:"flex-end",justifyContent:"center"}}>
                            <TouchableOpacity onPress={confirmCode} style={{borderRadius: 100,backgroundColor:DARK,height: 50,width: 50,justifyContent:"center",alignItems:"center"}}>
                                    <FIcon5 size={20} color={COLOR} name="chevron-right"/>
                            </TouchableOpacity>
                    </View>
                </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor:"white"
    },
    input: {
        backgroundColor:"white",
        width:"100%",
        paddingVertical: 10,
        fontFamily: FONT_MEDIUM,
        fontSize: 20,
        marginTop: 10,
        borderRadius: 10,
        textAlign:"center",
    },  
    bottomActions: {
        flexDirection: "row",
        width:"100%",
        height: 50,
    },
    inputView: {
        backgroundColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default RecoverPin