import React from 'react'
import { View , StyleSheet , Text , Alert} from 'react-native'
import { YellowButton } from 'src/revamp';
import { useThrottle } from 'src/hooks'; 
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { PATCH_DELETE_REQUEST_MONEY } from 'toktokwallet/graphql'
import { useMutation } from '@apollo/react-hooks'
import { AlertOverlay } from 'src/components'
import { TransactionUtility } from 'toktokwallet/util'
import {useAlert , usePrompt } from 'src/hooks'
import {onErrorAlert} from 'src/util/ErrorUtility'
import { useNavigation } from '@react-navigation/native';

export const CancelButton = ({requestMoneyId})=> {

    const navigation = useNavigation();
    const alert = useAlert();
    const prompt = usePrompt();

    const [patchDeleteRequestMoney , {loading}] = useMutation(PATCH_DELETE_REQUEST_MONEY, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
            navigation.pop();
            navigation.replace("ToktokWalletRequestMoneyPending")
        },
        onCompleted: ({patchDeleteRequestMoney})=> {
            Alert.alert("","Request successfully cancelled!")
            navigation.pop();
            navigation.replace("ToktokWalletRequestMoneyPending")
        }
    })

    const cancelRequest = ()=> {
        const continueDeleteRequest = ()=> {
            patchDeleteRequestMoney({
                variables: {
                    input: {
                        requestMoneyId
                    }
                }
            })
        }

        Alert.alert("", "Are you sure you want to cancel this request?", [
            {
              text: "No",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () => {
                continueDeleteRequest()
            } }
          ]);
    }

    const throttledPress = useThrottle(cancelRequest , 200)

    return (
        <>
        <AlertOverlay visible={loading}/>
        <View style={styles.container}>
            <YellowButton label="Cancel" onPress={throttledPress}/>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})