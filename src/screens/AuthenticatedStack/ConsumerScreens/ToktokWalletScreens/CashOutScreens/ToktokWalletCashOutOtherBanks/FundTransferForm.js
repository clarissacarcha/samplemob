import React , {useEffect} from 'react'
import {View , Text , StyleSheet , TextInput,TouchableOpacity} from 'react-native'
import { FONT, FONT_SIZE } from '../../../../../../res/variables'
import { Separator } from '../../Components'
import { YellowButton ,VectorIcon ,ICON_SET} from '../../../../../../revamp'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_BANKS} from '../../../../../../graphql/toktokwallet'
import {useLazyQuery} from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../../hooks'


const Amount = ({amount , note , dispatch})=> {
    return (
        <View style={styles.container}>
        <View style={{marginTop: 20,}}>
        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Enter Amount</Text>
        <View style={[styles.input, {justifyContent:"center"}]}>
                <TextInput
                    style={styles.input}
                    value={amount}
                    // onChangeText={(value)=>changeContactInfo("email",value)}
                    placeholder="Enter bank account number here"
                    returnKeyType="done"
                    keyboardType="number-pad"
                />
        </View>
        </View>
        <View style={{marginVertical: 20,}}>
        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Note (Optional)</Text>
        <View style={[styles.input, {justifyContent:"center"}]}>
             <TextInput
                    style={styles.input}
                    value={note}
                    maxLength={60}
                    onChangeText={(value)=>{
                        dispatch({
                            type: "SET_NOTE",
                            payload: value
                        })
                    }}
                    placeholder="Enter note here"
                />
                <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.S}}>{note.length}/60</Text>
        </View>
        </View>
    </View>
    )
}

const AccountInfo = ({accountName,accountNumber, bankDescription,selectBanks,bankAccountNumberLength , dispatch})=> {
    return (
        <View style={styles.container}>
             <View style={{marginTop: 20,}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Select Bank</Text>
                <TouchableOpacity onPress={selectBanks} style={[styles.input, {justifyContent:"flex-start",alignItems:"center", flexDirection:'row'}]}>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M , color:bankDescription == "" ? "gray": "black" }}>{bankDescription == "" ? "Select Bank" : bankDescription}</Text>
                    <View style={{flex: 1,alignItems:"flex-end"}}>
                         <VectorIcon iconSet={ICON_SET.Feather} name="chevron-right"/>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{marginTop: 20,}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
            <View style={[styles.input, {justifyContent:"center"}]}>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{accountName}</Text>
            </View>
            </View>
            <View style={{marginVertical: 20,}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
            <View style={[styles.input, {justifyContent:"center"}]}>
                <TextInput
                        style={styles.input}
                        value={accountNumber}
                        onChangeText={(value)=>dispatch({
                            type: "SET_ACCOUNT_NUMBER",
                            payload: value
                        })}
                        maxLength={bankAccountNumberLength != "" ? +bankAccountNumberLength : null}
                        placeholder={bankAccountNumberLength != "" ? `Enter your ${bankAccountNumberLength}-digit bank account number here` : `Enter your bank account number here`}
                    />
            </View>
            </View>
        </View>
    )
}

const FundTransferForm = ({state,dispatch,selectBanks})=> {

        
    const alert = useAlert()

    const [getBanks] = useLazyQuery(GET_BANKS, {
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted:({getBanks})=> {
            dispatch({
                type: "UPDATE_BANKS_LIST",
                payload: getBanks
            })
        }
    })

    useEffect(()=>{
        getBanks()
    },[])



    const onPress = ()=> {

    }

    return (
        <>
            <AccountInfo
                accountName={state.accountName}
                accountNumber={state.accountNumber}
                bank={state.bank}
                bankDescription={state.bankDescription}
                selectBanks={selectBanks}
                bankAccountNumberLength={state.bankAccountNumberLength}
                dispatch={dispatch}
            />
            <Separator/>
            <Amount
                amount={state.amount}
                note={state.note}
                dispatch={dispatch}
            />
            <View style={styles.proceedBtn}>
                <YellowButton label="Proceed" onPress={onPress}/>
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: 10,
    },
    proceedBtn: {
        height: 70,
        justifyContent: 'flex-end',
        padding: 16,
        marginTop: 20,
    }
})

export default FundTransferForm