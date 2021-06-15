import React from 'react'
import {View , Text , StyleSheet , TextInput} from 'react-native'
import { FONT, FONT_SIZE } from '../../../../../../res/variables'
import { Separator } from '../../Components'
import { YellowButton } from '../../../../../../revamp'


const Amount = ({amount,setAmount , note ,setNote})=> {
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
        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
        <View style={[styles.input, {justifyContent:"center"}]}>
             <TextInput
                    style={styles.input}
                    value={note}
                    // onChangeText={(value)=>changeContactInfo("email",value)}
                    placeholder="Enter note here"
                />
        </View>
        </View>
    </View>
    )
}

const AccountInfo = ({accountName,setAccountName,accountNumber,setAccountNumber})=> {
    return (
        <View style={styles.container}>
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
                        // onChangeText={(value)=>changeContactInfo("email",value)}
                        placeholder="Enter bank account number here"
                    />
            </View>
            </View>
        </View>
    )
}

const FundTransferForm = ({state,dispatch})=> {

    const setAmount = ()=> {

    }

    const setNote = ()=> {

    }

    const setAccountName = ()=> {

    }

    const setAccountNumber = ()=> {

    }

    const onPress = ()=> {

    }

    return (
        <>
            <AccountInfo
                accountName={state.accountName}
                setAccountName={setAccountName}
                accountNumber={state.accountNumber}
                setAccountNumber={setAccountNumber}
            />
            <Separator/>
            <Amount
                amount={state.amount}
                setAmount={setAmount}
                note={state.note}
                setNote={setNote}
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