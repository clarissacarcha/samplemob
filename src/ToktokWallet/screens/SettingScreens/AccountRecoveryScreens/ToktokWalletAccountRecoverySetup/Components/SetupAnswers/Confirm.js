import React, { useState } from 'react'
import { View, Text, StyleSheet , Dimensions , TextInput } from 'react-native'
import {  YellowButton } from 'src/revamp'
import { BuildingBottom , PromptModal } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_ACCOUNT_RECOVERY } from 'toktokwallet/graphql'
import { useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { useNavigation } from '@react-navigation/native'
import { AlertOverlay } from 'src/components'
import moment from 'moment'


const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS
const screen = Dimensions.get('window');

const Confirm = ({
    currentIndex,
    setCurrentIndex,
    questions,
    answers,
})=> {

    const alert = useAlert();
    const navigation = useNavigation();
    const [visible,setVisible] = useState(false)

    const [postAccountRecovery , {loading}] = useMutation(POST_ACCOUNT_RECOVERY, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ()=>{
          setVisible(true)
        },
        onError: (error)=> {
            onErrorAlert({alert,error})
        }
    })

    const onPress = ()=>{
        postAccountRecovery({
            variables: {
                input: {
                    questions: JSON.stringify(questions),
                    answers: JSON.stringify(answers)
                }
            }
        })
    }
   
    return (
        <>
            <AlertOverlay visible={loading}/>
            <PromptModal 
                    visible={visible}
                    title="Successful"
                    message="Account recovery setup submitted."
                    event="success"
                    onPress={()=>{
                        setVisible(false)
                        navigation.replace("ToktokWalletAccountRecoverySetup")
                    }}
            />
            <View style={styles.container}>
                <View style={styles.body}>
                            <Text>{JSON.stringify(questions)}</Text>
                            <Text>{JSON.stringify(answers)}</Text>
                </View>
                <View style={styles.btn}>
                        <YellowButton label="Submit" onPress={onPress}/>
                </View>
                <BuildingBottom/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    body: {
        flex: 1,
    },
    btn: {
        height: 70,
        justifyContent: "flex-end"
    },
    labelText: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.BOLD
    },
    labelSmall: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        color:"#929191"
    },
    ViewInput: {
        marginTop: 20,
    },
    input: {
        paddingHorizontal: 10,
        height: SIZE.FORM_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR
    },
})

export default Confirm