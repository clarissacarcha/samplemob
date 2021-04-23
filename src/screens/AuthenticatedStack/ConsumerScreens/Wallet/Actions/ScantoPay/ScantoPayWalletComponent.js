import React, {useState,useCallback, useEffect} from 'react'
import {StyleSheet,View,Text,TouchableOpacity,Dimensions,Image,TouchableHighlight,Platform} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import {numberFormat} from '../../../../../../helper'
import {COLOR, DARK, FONT_MEDIUM, FONT_REGULAR} from '../../../../../../res/constants'
import FIcon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native'
import {useLazyQuery} from '@apollo/react-hooks'
import {GET_QR_CODE} from '../../../../../../graphql'
import {onError} from '../../../../../../util/ErrorUtility'
import {useSelector} from 'react-redux'
import {useAlert} from '../../../../../../hooks/useAlert';
import DocumentPicker from 'react-native-document-picker';
import RNQRGenerator from 'rn-qr-generator';
import {ReactNativeFile} from 'apollo-upload-client';
import { QRreader } from "react-native-qr-decode-image-camera";

const {height,width} = Dimensions.get('window')

const ScantoPayWalletComponent = ({navigation,route})=> {

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
                       return alertHook({message:"Recipient does not have toktok wallet"})
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
                navigation.navigate("TokTokWalletActionsScantoPayConfirmPayment", {recipientInfo: response.getQRCode, walletinfo: walletinfo})
            }
        }
    })

    const detectQRCodeInUploadedImage =async (res)=> {

        const path = res.uri

        console.log(res)


        // QRreader(path)
        // .then(data => {
        //     console.log(data)
        // })
        // .catch(err => {
        //     console.log(err)
        // });

        // const rnQRCode = new ReactNativeFile({
        //     ...image,
        //     name: 'UploadedQRCode.jpg',
        //     type: 'image/jpeg'
        // })

        // console.log(rnQRCode)

            // RNQRGenerator.detect({
            //     uri: path
            // })
            // .then(response => {
            //     const { values } = response; // Array of detected QR code values. Empty if nothing found.
            // })
            // .catch(error => console.log(error));
}


    const handleSelectFile = async () => {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
          });
          setImage(res)
          await detectQRCodeInUploadedImage(res)
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
          } else {
            throw err;
          }
        }
      };

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
    }

    const customMarker = ()=> (
        <View style={styles.customMarker}>
            <TouchableOpacity onPress={()=>navigation.goBack()} style={{top: Platform.OS === "android" ? 60 : 80, left: 0,position:"absolute"}}>
             <FIcon name="chevron-left" size={30} color={'white'} /> 
            </TouchableOpacity>
            <View style={styles.centerBox}>

                    <View
                        style={[styles.borderEdges,{
                            borderTopWidth: 5,
                            borderLeftWidth: 5,
                            top: 0,
                            left: 0,
                        }]}
                    />

                    <View
                        style={[styles.borderEdges,{
                            borderTopWidth: 5,
                            borderRightWidth: 5,
                            top: 0,
                            right: 0,
                        }]}
                    />


                    <View
                        style={[styles.borderEdges,{
                            borderBottomWidth: 5,
                            borderLeftWidth: 5,
                            bottom: 0,
                            left: 0,
                        }]}
                    />


                    <View
                        style={[styles.borderEdges,{
                            borderBottomWidth: 5,
                            borderRightWidth: 5,
                            bottom: 0,
                            right: 0,
                        }]}
                    />



                    <View style={styles.TorchView}>
                            <TouchableHighlight 
                                onPress={()=>setTorch(!torch)}
                                style={styles.torch}
                            >
                                <Image source={torch ? require('../../../../../../assets/icons/walletScanTorchOn.png') : require('../../../../../../assets/icons/walletScanTorchOff.png')} />                      
                            </TouchableHighlight>

                            <Text style={{color: "white",fontFamily: FONT_MEDIUM,fontSize: 15}}>Tap to turn {torch ? 'off' : 'on' }</Text>
                    </View>

                
            </View>

                     <View style={{marginTop: 25}}>
                        <Text style={{color: "white",fontFamily: FONT_REGULAR,fontSize: 15}}>Position the QR code within the frame.</Text>
                    </View>
{/* 
                <View style={{position:"absolute",height: 100, width: width, bottom: 40,flexDirection:"row",zIndex: 1}}>
                    <View style={{flex: 1,justifyContent:"center",alignItems:"center",zIndex: 9999}}>
                        <TouchableOpacity onPress={handleSelectFile} style={{paddingHorizontal: 20,paddingVertical: 10,backgroundColor:"white",borderRadius: 5,justifyContent:"center",alignItems:"center"}}>
                                <FIcon color={COLOR} size={20} style={{marginBottom: 5}} name="upload" />
                                <Text style={{fontFamily: FONT_REGULAR,fontSize: 10}}>Upload QR code</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                        
                    </View>
                </View>
         */}
        </View>
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
                                        backgroundColor: "rgba(0,0,0,0.5)"
                                    }}
                                    cameraStyle={{
                                        height: "100%",
                                        backgroundColor: "rgba(0,0,0,0.5)"
                                    }}
                                />
           }
            <View style={{
                height:65,
                backgroundColor: "white",
                padding: 20,
                flexDirection: "row",
                alignItems: 'center',

            }}>


                <Image style={{width: 50,height: 25}} resizeMode="contain" source={require('../../../../../../assets/icons/walletMoney.png')} />
                <Text style={{marginLeft: 10, fontSize: 16, fontFamily: FONT_MEDIUM}}>{'\u20B1'} {numberFormat(walletinfo.balance)}</Text>
                <View style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                }}>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 15,
                            backgroundColor: DARK,
                            borderRadius: 10,
                        }}
                        onPress={()=>navigation.navigate("TokTokWalletCashIn",{walletinfo: walletinfo})}
                    >
                            <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Cash In</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>

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
        backgroundColor: "rgba(255,255,255,0.2)",
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
        borderColor: "#F6841F",
    }
  });
  

export default ScantoPayWalletComponent