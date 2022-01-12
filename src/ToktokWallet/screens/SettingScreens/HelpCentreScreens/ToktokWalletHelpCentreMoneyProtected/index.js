import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, ScrollView} from 'react-native'
import {Separator,CheckIdleState} from 'toktokwallet/components'
import {HeaderBack, HeaderTitle} from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const ListItem = (props) => {
    return (
        <>
            <View style={{flex: 1, flexDirection: 'row', paddingVertical: 10}}>
                <View style={{flex: 0.5, justifyContent: 'center', alignItems: "flex-start"}}>
                    <Image 
                        style={{resizeMode: 'contain', width: '100%', height: 35}}
                        source={require('toktokwallet/assets/icons/magnifying.png')}
                    />
                </View>
                <View style={{flex: 4, paddingHorizontal: 18}}>
                    <Text style={{fontFamily: FONT.REGULAR, fontWeight: 'bold', fontSize: 12.5}}>{props.title}</Text>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>{props.content}</Text>
                </View>                                    
            </View>
        </>
    )
}

export const ToktokWalletHelpCentreMoneyProtected = ({navigation}) => {

    navigation.setOptions({
        headerLeft: () => <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: () => <HeaderTitle label={['Your Money is Protected', '']} />,
    });

    return (
        <CheckIdleState>
            <View style={styles.container}>
                <Separator />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, backgroundColor: COLOR.WHITE}}>
                        
                        <View style={{flex: 1, width: '100%', paddingVertical: 30, marginBottom: 8}}>
                            <Image 
                                style={{resizeMode: 'contain', width: '100%', height: 80}}
                                source={require('toktokwallet/assets/images/SecurityAndPrivacy/money.png')}
                            />
                        </View>

                        <View style={{flex: 1, paddingHorizontal: 16, marginTop: 8}}>
                            
                            <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>Your money is protected</Text>
                            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>Your wallet balance is stored and protected.</Text>
                            
                            <View style={{flex: 1, marginTop: 12, marginBottom: 10}}>
                                
                                {/* {[{
                                    title: "Separated for your security",
                                    content: "Your toktokwallet balance is help in a dedicated customer account with BDO."
                                }, {
                                    title: "Regulated by the local monetary authority",
                                    content: "toktokwallet is regulated by Bangko Sentral ng Pilipinas (BSP)."
                                }].map((data, i) => <ListItem title={data.title} content={data.content} />)} */}

                                {[{
                                    title: "Regulated by the local monetary authority",
                                    content: "toktokwallet is regulated by Bangko Sentral ng Pilipinas (BSP)."
                                }].map((data, i) => <ListItem title={data.title} content={data.content} />)}

                            </View>

                        </View>

                    </View>
                </ScrollView>
                
            </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    },
    textTitle: {

    },
    textContent: {
        
    }
})