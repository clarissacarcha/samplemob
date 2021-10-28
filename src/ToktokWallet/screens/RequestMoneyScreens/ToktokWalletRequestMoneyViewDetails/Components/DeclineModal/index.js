import React , {useState} from 'react'
import { View , Text ,Modal , StyleSheet , Dimensions , TouchableOpacity  , TextInput } from 'react-native'
import { useAccount } from 'toktokwallet/hooks'
import { useThrottle } from 'src/hooks'
import { numberFormat } from 'toktokwallet/helper'
import {useAlert} from 'src/hooks/useAlert'
import {onErrorAlert} from 'src/util/ErrorUtility'
import {useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { POST_DENIED_REQUEST_MONEY } from 'toktokwallet/graphql'
import { AlertOverlay } from 'src/components'
import { useNavigation } from '@react-navigation/native'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE} = CONSTANTS
const { width } = Dimensions.get("window")

export const DeclineModal = ({
    visible,
    setVisible,
    amount,
    requestMoney,
})=> {
    const person = `${requestMoney.destinationPerson.firstName} ${requestMoney.destinationPerson.lastName}`
    const closeModal = ()=> setVisible(false)
    const {tokwaAccount} = useAccount();
    const [note,setNote] = useState("")
    const alert = useAlert();
    const navigation = useNavigation();

    const [postDeniedRequestMoney , {loading}] = useMutation(POST_DENIED_REQUEST_MONEY,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postDeniedRequestMoney})=> {
            navigation.navigate("ToktokWalletRequestMoneyPending")
            navigation.replace("ToktokWalletRequestMoneyPending")
        },
        onError: (error) => onErrorAlert({alert,error})
    })

    const decline = ()=> {
        postDeniedRequestMoney({
            variables: {
                input: {
                    requestMoneyId: requestMoney.id,
                    note: note,
                }
            }
        })
    }
    const throttledDeclined = useThrottle(decline,2000);

    return (
        <Modal
            style={styles.container}
            visible={visible}
            onRequestClose={closeModal}
            transparent={true}
        >
            <AlertOverlay visible={loading}/>
            <View style={styles.body}>
                <View style={styles.content}>
                    <Text style={styles.labelTitle}>Decline Request Money</Text>
                    <Text style={styles.labelPhrase}>Are you sure you want to decline {person}'s request for {tokwaAccount.wallet.currency.code} {numberFormat(requestMoney.amount)}?</Text>
                    <View style={{width:"100%",marginVertical: 15}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Note <Text style={{fontFamily: FONT.BOLD,fontSize: 11}}>(Optional)</Text></Text>
                        <TextInput
                            style={styles.remarks}
                            multiline={true}
                            height={80}
                            numberOfLines={4}
                            placeholder="Enter note here..."
                            maxLength={60}
                            value={note}
                            onChangeText={setNote}
                        />
                        <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.S,alignSelf:"flex-start"}}>{note.length}/60</Text>
                    </View>
                    <View style={styles.actionBtns}>
                        <TouchableOpacity onPress={throttledDeclined} style={[styles.btn, {backgroundColor:COLOR.YELLOW,marginRight: 10}]}>
                            <Text style={[ styles.label ]}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={[styles.btn, {backgroundColor:"#CBCBCB",marginLeft: 10}]}>
                            <Text style={[ styles.label ]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    body: {
        flex: 1,
        backgroundColor:"rgba(0,0,0, 0.7)",
        justifyContent:"center",
        alignItems:"center",
    },
    content: {
        width: width * 0.8,
        backgroundColor:"white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
        alignItems:'center'
    },
    actionBtns: {
        height: 70,
        justifyContent:"flex-end",
        flexDirection:'row',
        alignItems:"flex-end"
    },
    btn: {
        height: SIZE.FORM_HEIGHT,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    label: {
        color: 'black',
        fontSize:FONT_SIZE.L,
        paddingHorizontal: 10,
        fontFamily: FONT.BOLD,
    },
    labelTitle: {
        fontFamily: FONT.BOLD,
        fontSize:FONT_SIZE.L,
    },
    labelPhrase: {
        fontFamily: FONT.REGULAR,
        fontSize:FONT_SIZE.M,
    },
    remarks: {
        // height: SIZE.FORM_HEIGHT,
        paddingHorizontal: 5,
        width: "100%",
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
        fontSize: FONT_SIZE.M
    }
})