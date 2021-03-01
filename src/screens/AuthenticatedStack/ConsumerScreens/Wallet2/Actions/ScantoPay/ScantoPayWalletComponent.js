import React, {useState} from 'react'
import {StyleSheet,View,Text,TouchableOpacity,Dimensions,Image,TouchableHighlight} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../../components'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import {numberFormat} from '../../../../../../helper'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM} from '../../../../../../res/constants'

const {height,width} = Dimensions.get('window')

const ScantoPayWalletComponent = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['','']} />,
    })

    const {walletId , balance} = route.params

    const [torch,setTorch] = useState(false)

    const onSuccess = (e)=> {
        console.log(e)
    }

    const customMarker = ()=> (
        <View style={styles.customMarker}>
            <View style={styles.centerBox}>
                    <View style={styles.TorchView}>
                            <TouchableHighlight 
                                onPress={()=>setTorch(!torch)}
                                style={styles.torch}
                            >
                                <Image source={torch ? require('../../../../../../assets/icons/walletScanTorchOn.png') : require('../../../../../../assets/icons/walletScanTorchOff.png')} />                      
                            </TouchableHighlight>

                            <Text style={{color: "white",fontWeight: "400",fontSize: 18}}>Tap to turn {torch ? 'off' : 'on' }</Text>
                    </View>
            </View>
        </View>
    )

    return (
        <>
            <QRCodeScanner
                onRead={onSuccess}
                flashMode={torch ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                fadeIn={false}
                showMarker={true}
                markerStyle={{
                    borderColor: "red"
                }}
                reactivate={false}
                customMarker={customMarker}
                containerStyle={{
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}
                cameraStyle={{
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}
            />
            <View style={{
                height:80,
                backgroundColor: "white",
                padding: 20,
                flexDirection: "row",
                alignItems: 'center'
            }}>
                <Image style={{width: 50,height: 25}} resizeMode="contain" source={require('../../../../../../assets/icons/walletMoney.png')} />
                <Text style={{marginLeft: 10, fontSize: 22, fontWeight: "400"}}>{'\u20B1'} {numberFormat(balance)}</Text>
                <View style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                }}>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            backgroundColor: DARK,
                            borderRadius: 10,
                        }}
                        onPress={()=>navigation.navigate("TokTokWalletCashIn",{walletId,balance})}
                    >
                            <Text style={{color: COLOR,fontSize: 16}}>Cash In</Text>
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
    }
  });
  

export default ScantoPayWalletComponent