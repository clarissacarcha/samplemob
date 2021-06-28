import React from 'react'
import {View,Text,StyleSheet,Modal,Dimensions,TouchableOpacity} from 'react-native'
import { COLOR, FONT, SIZE } from '../../../../../../res/variables'
import { YellowButton } from '../../../../../../revamp'
import {useNavigation} from '@react-navigation/native'
import { FONT_SIZE } from '../../../../../../res/constants'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import { PATCH_LINK_ACCOUNT , GET_GCASH_LINK_OTP } from '../../../../../../graphql/toktokwallet'
import { useLazyQuery , useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../../hooks/useAlert'

const {height,width} = Dimensions.get("screen")

const ModalLinkMobile = ({visible,setVisible,mobile,provider})=> {

    const navigation = useNavigation()
    const alert = useAlert()

    const openLinkPage = ()=> {
        getGcashLinkOTP({
            variables: {
                input: {
                    mobileNumber: `09${mobile}`
                }
            }
        })
    }

    const [getGcashLinkOTP, {loading: getOtpLoading}] = useLazyQuery(GET_GCASH_LINK_OTP, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getGcashLinkOTP})=>{
            setVisible(false)
            return navigation.navigate("ToktokWalletGcashLinkAccount", {mobile,provider})
        },
        onError: (error)=>{
            setVisible(false)
            onErrorAlert({alert,error})
        }
    })

    return (
        <>
        <Modal
            style={styles.container}
            transparent={true}
            visible={visible}
            onRequestClose={()=>setVisible(false)}
        >

            <View style={styles.modalContent}>
                <View style={styles.modalBody}>
                    <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M, textAlign:"center"}}>Are you sure you want to link this GCash account to your toktokwallet?</Text>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S ,textAlign:"center"}}>Linking an account leads to faster fund transfer transaction next time.</Text>
                    </View>
                    <View style={{height: SIZE.FORM_HEIGHT,justifyContent:"flex-end",flexDirection:"row"}}>
                            {/* <YellowButton onPress={openLinkPage} label="Link"/> */}
                        <TouchableOpacity 
                                style={{
                                    flex: 1,
                                    paddingVertical: 2,
                                    height: SIZE.FORM_HEIGHT,
                                    justifyContent:"center",
                                    alignItems:"center"
                                }}
                                onPress={()=>setVisible(false)}
                            >
                                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.DARK}}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                                style={{
                                    flex: 1,
                                    paddingVertical: 2,
                                    height: SIZE.FORM_HEIGHT,
                                    justifyContent:"center",
                                    alignItems:"center",
                                    backgroundColor:COLOR.YELLOW,
                                    marginTop: 5,
                                }}
                                onPress={openLinkPage}
                            >
                                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>Link Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
        </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(34, 34, 34, 0.5)"
    },
    modalBody: {
        height: 180,
        width: width * 0.8,
        backgroundColor: "white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
    }
})

export default ModalLinkMobile