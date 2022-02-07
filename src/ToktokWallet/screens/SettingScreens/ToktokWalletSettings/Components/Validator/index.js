import React from 'react'
import {View,Text,StyleSheet,Switch} from 'react-native'
import {AlertOverlay} from 'src/components'
import { useDispatch } from 'react-redux'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {PATCH_VALIDATOR} from 'toktokwallet/graphql'
import { useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import {useAlert} from 'src/hooks'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

const Option = ({label , toggle})=> {

    const dispatch = useDispatch();
    const alert = useAlert();

    const [patchValidator , {loading}] = useMutation(PATCH_VALIDATOR,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({patchValidator})=>{
                dispatch({
                    type: "SET_TOKTOKWALLET_VALIDATOR",
                    payload: patchValidator
                })
        },
        onError: (error)=> {
            return onErrorAlert({alert,error})
        }
    })


    const changeDefault = (value,label)=> {

        let validator = label

        if(value){
            if(label == "TPIN"){
                validator = "TPIN"
            }else{
                validator = "OTP"
            }
        }else{
            if(label == "TPIN"){
                validator = "OTP"
            }else{
                validator = "TPIN"
            }
        }

        patchValidator({
            variables: {
                input: {
                    validator: validator
                }
            }
        })
       
    }
    return (
        <>
        <AlertOverlay visible={loading}/>
        <View style={styles.settingoption}>
                    <View style={styles.name}>
                        <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{label}</Text>
                    </View>
                    <View style={styles.arrowright}>
                        <Switch
                            trackColor={{false: COLOR.LIGHT, true: COLOR.LIGHT}}
                            thumbColor={toggle ? COLOR.YELLOW : COLOR.MEDIUM}
                            onValueChange={(value)=>changeDefault(value,label)}
                            value={toggle}
                        /> 
                    </View>
        </View>
        <View style={styles.divider}/>
        </>
    )
}

export const Validator = ({validator})=> {

    if(validator == "TPIN"){
        return (
            <>
            <Option label="TPIN" toggle={true}/>
            <Option label="OTP" toggle={false}/>
            </>
        )
    }

    if(validator == "OTP"){
        return (
            <>
            <Option label="TPIN" toggle={false}/>
            <Option label="OTP" toggle={true}/>
            </>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    settingoption: {
        padding: 16,
        paddingVertical: 15,
        flexDirection: "row",
        backgroundColor:"white"
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