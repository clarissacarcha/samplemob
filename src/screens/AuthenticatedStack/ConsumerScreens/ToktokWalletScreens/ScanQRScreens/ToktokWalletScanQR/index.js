import React, {useState,useCallback, useEffect} from 'react'
import {StyleSheet,View,Text,TouchableOpacity,Dimensions,Image,TouchableHighlight,Platform,SafeAreaView} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import {COLORS, FONTS, SIZES} from '../../../../../../res/constants'
import FIcon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native'
import {useLazyQuery} from '@apollo/react-hooks'
import {GET_QR_CODE} from '../../../../../../graphql'
import {onError} from '../../../../../../util/ErrorUtility'
import {useSelector} from 'react-redux'
import {useAlert} from '../../../../../../hooks/useAlert';

//SELF IMPORTS
import WalletBalance from './WalletBalance'
import Actions from './Actions'

const {height,width} = Dimensions.get('screen')

const ToktokWalletScanQR = ({navigation,route})=> {

    navigation.setOptions({
        header: ()=> null,
    })

    const alertHook = useAlert()
    const {walletinfo} = route.params
    const [torch,setTorch] = useState(false)
    const [focusCamera,setFocusCamera] = useState(false)
    const session = useSelector(state=>state.session)
    const [image, setImage] = useState(null);


    useFocusEffect(useCallback(()=>{
        setFocusCamera(true)
        return ()=> setFocusCamera(false)
    },[]))

    const [getQRCode] = useLazyQuery(GET_QR_CODE,{
        fetchPolicy: "network-only",
        onError: (error)=>{
            if(error.graphQLErrors.length > 0){
                error.graphQLErrors.map((err)=> {
                    if(err.message == "Wallet not found"){
                       return alertHook({message:"Recipient does not have toktokwallet"})
                    }else{
                       return alertHook({message:"This QR code is invalid"})
                    }
                })
            return
            }
            onError(error)
        },
        onCompleted: (response)=> {
            if(response.getQRCode.contactNo === session.user.username){
                return alertHook({message: "You cannot send money to yourself"})
            }else{
                navigation.navigate("ToktokWalletScanQRConfirm", {recipientInfo: response.getQRCode, walletinfo: walletinfo})
            }
        }
    })

    const onSuccess = (e)=> {
        // size of center Box
        const ViewFinderHeight = width * 0.7
        const ViewFinderWidth = width * 0.7

        const boundary = {
            height: ViewFinderHeight,
            width: ViewFinderWidth,
            x: ( e.bounds.width - ViewFinderWidth ) / 2,
            y: ( e.bounds.height - ViewFinderHeight ) / 2
        }

        let rXAve = 0
        let rYAve = 0
        let x = 0
        e.bounds.origin.forEach((bound)=>{
            rXAve = rXAve + +bound.x
            rYAve = rYAve + +bound.y
            x++
        })

        rXAve = rXAve / x
        rYAve = rYAve / x

        const resultBounds = {
            height: e.bounds.height,
            width: e.bounds.width,
            x: rXAve,
            y: rYAve 
        }

        if(ifInsideBox(boundary,resultBounds)){
             getQRCode({
                variables: {
                    input: {
                        qrCode: e.data
                    }
                }
            })
            setTorch(false)
        }else{
            console.log("OUT OF BOUNDS")
        }

    }
  

    const ifInsideBox = (boundary , resultBounds)=> {
       return boundary.x < (resultBounds.x + resultBounds.width)
       && ( boundary.x + boundary.width ) > resultBounds.x
       && boundary.y < ( resultBounds.y + resultBounds.height )
       && ( boundary.y + boundary.height ) > resultBounds.y
       && resultBounds.y > boundary.y
       && resultBounds.x > boundary.x
    }

    const customMarker = ()=> (
        <SafeAreaView style={styles.customMarker}>
            {/* <TouchableOpacity onPress={()=>navigation.goBack()} style={{top: Platform.OS === "android" ? 60 : 80, left: 0,position:"absolute"}}>
             <FIcon name="chevron-left" size={30} color={'white'} /> 
            </TouchableOpacity> */}
            <TouchableOpacity onPress={()=>navigation.pop()} style={styles.backBtn}>
                <FIcon name="chevron-left" size={20} color={'#222222'} /> 
            </TouchableOpacity>
            <View style={styles.centerBox}>
                        <View style={[styles.borderEdges,{borderTopWidth: 5,borderLeftWidth: 5,top: 0,left: 0,}]}/>
                        <View style={[styles.borderEdges,{borderTopWidth: 5,borderRightWidth: 5,top: 0,right: 0,}]}/>
                        <View style={[styles.borderEdges,{borderBottomWidth: 5,borderLeftWidth: 5,bottom:0,left: 0,}]}/>
                        <View style={[styles.borderEdges,{borderBottomWidth: 5,borderRightWidth: 5,bottom:0,right:0,}]}/>

                    <View style={styles.TorchView}>
                      { image  ? <Image source={{uri: image.uri}}  style={{height: 100,width: 100}}/> : null}
                            <TouchableHighlight 
                                onPress={()=>setTorch(!torch)}
                                style={styles.torch}
                            >
                                <Image source={torch ? require('../../../../../../assets/icons/walletScanTorchOn.png') : require('../../../../../../assets/icons/walletScanTorchOff.png')} />                      
                            </TouchableHighlight>

                            <Text style={{color: "white",fontFamily: FONTS.REGULAR,fontSize: SIZES.L}}>Tap to turn {torch ? 'off' : 'on' }</Text>
                    </View>

                
            </View>

                <View style={{marginTop: 25}}>
                    <Text style={{color: "white",fontFamily: FONTS.REGULAR,fontSize: SIZES.L,color: COLORS.YELLOW}}>Position the QR code within the frame.</Text>
                </View>

    
        
        </SafeAreaView>
    )

    return (
        <>
           {
               focusCamera &&  <QRCodeScanner
                                    onRead={onSuccess}
                                    flashMode={torch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                                    fadeIn={false}
                                    showMarker={true}
                                    markerStyle={{
                                        borderColor: "red"
                                    }}
                                    reactivate={true}
                                    reactivateTimeout={1000}
                                    vibrate={false}
                                    customMarker={customMarker}
                                    containerStyle={{
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                    }}
                                    cameraStyle={{
                                        height: height,
                                        backgroundColor: "rgba(0,0,0,0.5)"
                                    }}
                                />
           }

                <Actions onUploadSuccess={(qrCode)=>{
                        getQRCode({
                            variables: {
                                input: {
                                    qrCode: qrCode
                                }
                            }
                        })
                }}/>
         
            {/* <WalletBalance navigation={navigation} walletinfo={walletinfo}/> */}
        </>
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
//backgroundColor: "rgba(0,0,0,0.2)",
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
        borderColor: COLORS.YELLOW,
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

  export default ToktokWalletScanQR
  