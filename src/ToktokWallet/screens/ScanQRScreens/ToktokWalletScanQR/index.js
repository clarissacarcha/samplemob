import React, {useState,useCallback, useEffect} from 'react'
import {StyleSheet,View,Text,TouchableOpacity,Dimensions,Image,TouchableHighlight,Platform,ActivityIndicator} from 'react-native'
import { RNCamera } from 'react-native-camera';
import FIcon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native'
import {useLazyQuery} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import {GET_ACCOUNT} from 'toktokwallet/graphql'
import {onError} from 'src/util/ErrorUtility'
import {useSelector} from 'react-redux'
import {useAlert} from 'src/hooks/useAlert';
import { CheckIdleState } from 'toktokwallet/Components'
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS
import {
    Actions
} from "./Components";

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS


const {height,width} = Dimensions.get('screen')

export const ToktokWalletScanQR = ({navigation,route})=> {

    navigation.setOptions({
        header: ()=> null,
    })

    const alertHook = useAlert()
    const [torch,setTorch] = useState(false)
    const [focusCamera,setFocusCamera] = useState(false)
    const session = useSelector(state=>state.session)
    const [image, setImage] = useState(null);
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [boundaryArea,setBoundaryArea] = useState({
        height: 0,
        width: 0,
        x: 0,
        y: 0,
    })
    useFocusEffect(useCallback(()=>{
        setFocusCamera(true)
        return ()=> setFocusCamera(false)
    },[]))


    const [getAccount, {data , error ,loading}] = useLazyQuery(GET_ACCOUNT,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        onError: (err)=>{
            if(err.graphQLErrors.length > 0){
                err.graphQLErrors.map((error)=> {
                    if(error.message == "Person doesn't registered in toktokwallet") {
                        return alertHook({message:"QR code must be valid"})
                    }
                   
                })
                return
            }
            return alertHook({message:"Qr code must be valid"})
        },
        onCompleted: ({getAccount})=> {
            if(getAccount.mobileNumber === tokwaAccount.mobileNumber){
                return alertHook({message: "You cannot send money to yourself"})
            }
            setTorch(false)
            return  navigation.navigate("ToktokWalletScanQRConfirm", {recipientInfo: getAccount})
        }
    })


    const barcodeRead = (e)=> {
        const barcode = Platform.OS === "android" ? e.barcodes[0] : e
        const resultBounds = {
            height: barcode.bounds.size.height,
            width: barcode.bounds.size.width,
            x: barcode.bounds.origin.x,
            y: barcode.bounds.origin.y
        }

        const checkifOutside = checkifOutsideBox(boundaryArea , resultBounds)

        if(!checkifOutside){
            getAccount({
                variables: {
                    input: {
                        mobileNumber: barcode.data
                    }
                }
            })
            setTorch(false)
        }
    }

    const checkifOutsideBox = (boundary, result)=>{
        return result.x < boundary.x
           || (result.x + result.width) > (boundary.x + boundary.width)
           || result.y < boundary.y
           || (result.y + result.height) > (boundary.y + boundary.height)
           || result.height > boundary.height
           || result.width > boundary.width
    } 

    return (
        <CheckIdleState>
        <View style={{flex: 1}}>
            <RNCamera
                style={{
                    flex: 1,
                    justifyContent:"center",
                    alignItems:"center"
                }}
                type={RNCamera.Constants.Type.back}
                flashMode={torch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                onBarCodeRead={Platform.OS === "ios" && !loading && focusCamera ? barcodeRead : null}
                onGoogleVisionBarcodesDetected={Platform.OS === "android" && !loading && focusCamera ? barcodeRead : null}
                captureAudio={false}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
            >

            <TouchableOpacity onPress={()=>navigation.pop()} style={styles.backBtn}>
                <FIcon name="chevron-left" size={20} color={'#222222'} /> 
            </TouchableOpacity>

                <View style={styles.centerBox}
                    onLayout={(e)=>{
                        setBoundaryArea(e.nativeEvent.layout)
                    }}
                >
                        <View style={[styles.borderEdges,{borderTopWidth: 5,borderLeftWidth: 5,top: 0,left: 0,}]}/>
                        <View style={[styles.borderEdges,{borderTopWidth: 5,borderRightWidth: 5,top: 0,right: 0,}]}/>
                        <View style={[styles.borderEdges,{borderBottomWidth: 5,borderLeftWidth: 5,bottom:0,left: 0,}]}/>
                        <View style={[styles.borderEdges,{borderBottomWidth: 5,borderRightWidth: 5,bottom:0,right:0,}]}/>

                        <View>
                            {
                                loading && <ActivityIndicator color={COLOR.YELLOW} size={50}/>
                            }
                           
                        </View>


                    <View style={styles.TorchView}>
                      { image  ? <Image source={{uri: image.uri}}  style={{height: 100,width: 100}}/> : null}
                            <TouchableHighlight 
                                onPress={()=>setTorch(!torch)}
                                style={styles.torch}
                            >
                                <Image source={torch ? require('toktokwallet/assets/icons/walletScanTorchOn.png') : require('toktokwallet/assets/icons/walletScanTorchOff.png')} />                      
                            </TouchableHighlight>

                            <Text style={{color: "white",fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.L}}>Tap to turn {torch ? 'off' : 'on' }</Text>
                    </View>


                </View>
                <View style={{marginTop: 25}}>
                    <Text style={{color: "white",fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.L,color: COLOR.YELLOW}}>Position the QR code within the frame.</Text>
                </View>
                <Actions 
                    tokwaAccount={tokwaAccount}
                    onUploadSuccess={(qrCode)=>{
                        getAccount({
                            variables: {
                                input: {
                                    mobileNumber: qrCode
                                }
                            }
                        })
                }}/>

            </RNCamera>
        </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777'
    },
    textBold: {
      fontWeight: '500',
      color: '#000'
    },
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
      padding: 16
    },
    customMarker: {
        height: height,
        width: width,
        justifyContent: "center",
        alignItems: "center",
    },
    centerBox: {
        height: width * 0.7,
        width: width * 0.7,
        backgroundColor: "rgba(255,255,255,0.1)",
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    TorchView: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    torch: {
        height: 60,
        width: 60,
        borderRadius: 100,
        backgroundColor: "rgba(0,0,0,0.3)",
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    borderEdges: {
        height: 40,
        width: 40,
        position: "absolute",
        borderColor: COLOR.YELLOW,
    },
    backBtn: {
        backgroundColor:"#FFFFFF",
        top: 30, 
        left: 16,
        position:"absolute",
        zIndex: 1,
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 100,
        height: 35,
        width: 35,
    }
  });

