import React from 'react'
import {StyleSheet,View,Text,ActivityIndicator,StatusBar} from 'react-native'
import {SIZES, FONTS, COLORS} from '../../../../../res/constants'
import {useMutation} from '@apollo/react-hooks'
import {POST_TOKTOK_WALLET} from '../../../../../graphql'
import {AlertOverlay,SomethingWentWrong} from '../../../../../components'
import {onError} from '../../../../../util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'
import { YellowButton } from '../../../../../revamp'
import {HeaderImageBackground, HeadingBannerLogo , HeaderTitle} from '../Components'

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
            <ActivityIndicator size={24} color={COLORS.YELLOW} />
          </View>
        );
    }

    if (error) {
        return <SomethingWentWrong />;
    }

    const createToktokWallet = ()=> postToktokWallet()

    return (
        <>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <AlertOverlay visible={postLoading} />
        <View style={styles.container}>
                <View style={styles.headings}>
                        <HeaderImageBackground>
                                <HeaderTitle isLogo />
                        </HeaderImageBackground>
                </View>
                <View style={styles.content}>
                    <View style={{alignItems:"center"}}>
                            <Text style={{fontSize: 16,fontFamily: FONTS.BOLD}}>Go cashless with <Text style={{color: COLORS.YELLOW}}>toktok</Text><Text style={{color: COLORS.ORANGE}}>wallet</Text></Text>
                            <Text style={{fontSize: SIZES.S,marginTop: 5,fontFamily: FONTS.REGULAR}}>Enjoy a secure and convenient payment experience.</Text>
                    </View>
                </View>

                <View style={styles.proceedBtn}>
                    <YellowButton label="Create Wallet" onPress={createToktokWallet} />
                </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        backgroundColor: "white"
    },
    headings: {
        height: 92,
        backgroundColor:"black"
    }, 
    content: {
        flex: 1,
        padding: 10,
        paddingTop: 20,
        // justifyContent:"center"
    },
    proceedBtn: {
        height: 70,
        padding: 10,
        width: "100%",
    },
})

export default CreateWallet