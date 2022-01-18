import React , {useRef, useState,useEffect} from 'react'
import {View,Text,StyleSheet,ScrollView,TextInput,TouchableOpacity} from 'react-native'
import { YellowButton } from 'src/revamp'
import {DisabledButton, NumberBoxes ,BuildingBottom} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

export const NewPin = ({pinCode,setPinCode , pageIndex, setPageIndex})=> {

    const inputRef = useRef();
    const [showPin,setShowPin] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };

    const onSubmit = () => {
        let isWeakPin = true
        for(let x = 0 ; x < pinCode.length ; x++){
            if(pinCode[0] != pinCode[x]){
                isWeakPin = false
                break
            }
        }
        if(isWeakPin) {
            setShowPin(true)
            return setErrorMessage(`Your TPIN must not contain repeating digits ex. 000000`)
        }
        setPageIndex(oldstate=>oldstate+1)
     };

     useEffect(()=>{
        setErrorMessage("")
    },[pinCode])

    return (
        <View style={styles.container}>
        <View style={styles.content}>
                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 20,alignSelf:"center"}}>Enter New TPIN</Text>
                <View style={{position: 'relative',marginTop: 50,}}>
                    <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin}/>
                    <TextInput
                            caretHidden
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            if (value.length <= 6) {
                                const num = value.replace(/[^0-9]/g, '')
                                setPinCode(num);
                            }
                            }}
                            onSubmitEditing={pinCode.length == 6 ? onSubmit: null}
                        />

                        {
                            errorMessage != "" &&  <Text style={{fontFamily: FONT.REGULAR,fontSize: 12,color:COLOR.RED,alignSelf:"center"}}>{errorMessage}</Text>   
                        }


                        <TouchableOpacity
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={()=>setShowPin(!showPin)}
                        >
                                <Text style={{color: COLOR.ORANGE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{showPin ? "HIDE TPIN" : "SHOW TPIN"}</Text>
                        </TouchableOpacity>

                </View>
            </View>

            <View style={{padding: 16}}>
                {
                    pinCode.length < 6 
                    ? <DisabledButton label="Next"/>
                    : <YellowButton label="Next" onPress={onSubmit}/>
                }
            </View>
            <BuildingBottom/>
          
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        // alignItems: "center",
        padding: 16,
        flex: 1,
    },
    input: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 25,
        width: 30,
    },
})
