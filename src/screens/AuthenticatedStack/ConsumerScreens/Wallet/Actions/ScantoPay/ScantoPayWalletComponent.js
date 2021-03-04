import React, {useState,useCallback, useEffect} from 'react'
import {StyleSheet,View,Text,TouchableOpacity,Dimensions,Image,TouchableHighlight} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../../components'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import {numberFormat} from '../../../../../../helper'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM} from '../../../../../../res/constants'
import FIcon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native'

const {height,width} = Dimensions.get('window')

const ScantoPayWalletComponent = ({navigation,route})=> {

    navigation.setOptions({
        header: ()=> null,
    })

    const {walletId , balance} = route.params

    const [torch,setTorch] = useState(false)
    const [focusCamera,setFocusCamera] = useState(false)


    useFocusEffect(useCallback(()=>{
        setFocusCamera(true)
        return ()=> setFocusCamera(false)
    },[]))

    const onSuccess = (e)=> {
        console.log(e)
        setTorch(false)
        navigation.navigate("TokTokWalletActionsScantoPayConfirmPayment")
    }

    const customMarker = ()=> (
        <View style={styles.customMarker}>
            <TouchableOpacity onPress={()=>navigation.goBack()} style={{top: 60, left: 0,position:"absolute"}}>
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

                            <Text style={{color: "white",fontWeight: "400",fontSize: 15}}>Tap to turn {torch ? 'off' : 'on' }</Text>
                    </View>

                
            </View>

            <View style={{marginTop: 25}}>
                        <Text style={{color: "white",fontWeight: "400",fontSize: 15}}>Position the QR code within the frame.</Text>
                    </View>
        
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
               // reactivate={true}
               // reactivateTimeout={5000}
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
                alignItems: 'center'
            }}>
                <Image style={{width: 50,height: 25}} resizeMode="contain" source={require('../../../../../../assets/icons/walletMoney.png')} />
                <Text style={{marginLeft: 10, fontSize: 16, fontWeight: "400"}}>{'\u20B1'} {numberFormat(balance)}</Text>
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
                        onPress={()=>navigation.navigate("TokTokWalletCashIn",{walletId,balance})}
                    >
                            <Text style={{color: COLOR,fontSize: 12}}>Cash In</Text>
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
        backgroundColor: "rgba(0,0,0,0.2)",
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
        height: 50,
        width: 50,
        position: "absolute",
        borderColor: "#F6841F",
    }
  });
  

export default ScantoPayWalletComponent