import React from 'react'
import {StyleSheet,View,Text,Image,TouchableOpacity,ActivityIndicator} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_REGULAR, FONT_MEDIUM, SIZES} from '../../../../../res/constants'
import {useMutation} from '@apollo/react-hooks'
import {POST_TOKTOK_WALLET} from '../../../../../graphql'
import {AlertOverlay,SomethingWentWrong} from '../../../../../components'
import {onError} from '../../../../../util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'
import { BlackButton } from '../../../../../revamp'

const CreateWallet = ({getWallet: getToktokWallet,session})=> {

    const navigation = useNavigation()

    const [postToktokWallet, {loading: postLoading,error}] = useMutation(POST_TOKTOK_WALLET, {
        fetchPolicy: 'no-cache',
        onError: onError,
        variables: {
          input: {
            userId: session.user.id,
          },
        },
        onCompleted: (result) => {
          getToktokWallet();
          navigation.navigate("ToktokWalletVerifySetup")
        },
    });


    if (postLoading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        );
    }

    if (error) {
        return <SomethingWentWrong />;
    }

    const createToktokWallet = ()=> postToktokWallet()

    return (
        <>
        <AlertOverlay visible={postLoading} />
        <View style={styles.container}>
                <View style={styles.content}>
                    <Image style={{height: 160,width: 160, alignSelf: "center",marginBottom: 20 , marginTop: 30}} source={require('../../../../../assets/images/toktokwallet.png')} resizeMode="contain" />
                    <View style={{alignItems:"center"}}>
                            <Text style={{fontSize: 20,fontFamily: FONT_MEDIUM}}>Go cashless with <Text style={{color: COLOR}}>toktok</Text><Text style={{color: ORANGE}}>wallet</Text></Text>
                            <Text style={{fontSize: SIZES.M,marginTop: 5,fontFamily: FONT_REGULAR}}>Enjoy a secure and convenient payment experience.</Text>
                    </View>
                </View>

                <View style={styles.proceedBtn}>
                    <BlackButton label="Create Wallet" onPress={createToktokWallet} />
                </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "white"
    },
    content: {
        flex: 1,
    },
    proceedBtn: {
        height: 40,
        width: "100%",
    }
})

export default CreateWallet