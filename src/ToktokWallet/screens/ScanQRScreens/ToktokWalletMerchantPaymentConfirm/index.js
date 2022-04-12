import React, {useState} from "react";
import { View , Text , StyleSheet, ScrollView, TouchableOpacity , Image} from 'react-native';
import { HeaderBack , HeaderTitle , ICON_SET, VectorIcon  } from 'src/revamp';
import { CheckIdleState, FlagSecureScreen , BuildingBottom, TransferableHeaderReminder } from 'toktokwallet/components';
import {useAlert} from 'src/hooks/useAlert';
import { useAccount } from 'toktokwallet/hooks';
import tokwaLogo from 'toktokwallet/assets/images/tokwa.png'
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS
import {
    EnterAmount,
    EnterNote,
    ProceedButton
} from "./Components";

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE , MARGIN } = CONSTANTS;

export const ToktokWalletMerchantPaymentConfirm = ({
    navigation,
    route
})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Pay QR']} />,
    })

    const { merchant , branch , terminal , qrCode } = route.params


    const alert = useAlert()
    const { tokwaAccount } = useAccount();
    const [amount,setAmount] = useState("")
    const [note,setNote] = useState("")
    const [swipeEnabled,setSwipeEnabled] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")
    const [isCertify, setCertify] = useState(true)

    return (
        <FlagSecureScreen>
            <CheckIdleState>
                <View style={styles.container}>
                    <TransferableHeaderReminder/>
                    <View style={styles.content}>
                            <ScrollView
                                contentContainerStyle={{ flexGrow: 1}}
                                style={{flex:1, backgroundColor:"white"}}
                            >
                                    <View style={styles.merchantInfo}>
                                      <View style={styles.merchantLogoView}>
                                          {
                                              merchant.logo
                                              ? <Image source={{uri: merchant.logo}} style={styles.merchantLogo} resizeMode="contain"/>
                                              : <Image source={tokwaLogo} style={styles.merchantLogo} resizeMode="contain"/>
                                          }
                                      </View>
                                      <View style={{marginTop: 10,alignItems:"center"}}>
                                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L}}>{merchant.merchantName} {branch.branchName}</Text>
                                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>{terminal.terminalName}</Text>
                                      </View>
                                    </View>
                                    <EnterAmount 
                                        amount={amount} 
                                        setAmount={setAmount} 
                                        setSwipeEnabled={setSwipeEnabled}
                                        tokwaAccount={tokwaAccount}
                                        errorMessage={errorMessage}
                                        setErrorMessage={setErrorMessage}
                                    />

                                    <EnterNote
                                        note={note}
                                        setNote={setNote}
                                    />
                                    <View style={{paddingHorizontal: 16}}> 
                                        <TouchableOpacity 
                                            onPress={()=>navigation.navigate("ToktokWalletTermsConditions")}
                                            style={{paddingLeft: 5,marginRight: 16,marginBottom: 20}}
                                        >
                                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Please read our <Text style={{color: COLOR.ORANGE,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Terms and Conditions</Text> before you proceed with your transaction.</Text>
                                        </TouchableOpacity>


                                        <ProceedButton 
                                            amount={amount} 
                                            swipeEnabled={swipeEnabled} 
                                            setSwipeEnabled={setSwipeEnabled}
                                            note={note} 
                                            errorMessage={errorMessage}
                                            setErrorMessage={setErrorMessage}
                                            isCertify={isCertify}
                                            tokwaAccount={tokwaAccount}
                                            merchant={merchant}
                                            branch={branch}
                                            terminal={terminal}
                                            qrCode={qrCode}
                                        />
                                    </View>   
                                    <BuildingBottom/>
                             </ScrollView>
                    </View>
        
                </View>
            </CheckIdleState>
        </FlagSecureScreen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        flex: 1,
    },
    merchantInfo: {
        justifyContent:"center",
        alignItems:"center",
        marginTop: 15,
    },
    merchantLogoView: {
        height: 70,
        width: 70,
        borderRadius: 65,
        borderWidth: 1,
        borderColor: COLOR.ORANGE,
        flex: 1,
        justifyContent:"center",
        alignItems:"center"
    },
    merchantLogo: {
        height: 50,
        width: 45
    }
})