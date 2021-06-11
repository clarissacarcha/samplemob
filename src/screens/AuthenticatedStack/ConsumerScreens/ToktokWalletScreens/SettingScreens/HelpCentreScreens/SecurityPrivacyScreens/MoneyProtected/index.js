import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, ScrollView} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import RNFS from 'react-native-fs'
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../../../res/variables';
import { COLORS, FONTS, FONT_BOLD } from '../../../../../../../../res/constants';
import {Separator} from '../../../../Components'

const ListItem = (props) => {
    return (
        <>
            <View style={{flex: 1, flexDirection: 'row', paddingVertical: 10}}>
                <View style={{flex: 0.5, justifyContent: 'center', alignItems: "flex-start"}}>
                    <Image 
                        style={{resizeMode: 'contain', width: '100%', height: 35}}
                        source={require('../../../../../../../../assets/icons/magnifying.png')}
                    />
                </View>
                <View style={{flex: 4, paddingHorizontal: 18}}>
                    <Text style={{fontFamily: FONTS.REGULAR, fontWeight: 'bold', fontSize: 12.5}}>{props.title}</Text>
                    <Text style={{fontFamily: FONTS.REGULAR, fontSize: FONT_SIZE.S}}>{props.content}</Text>
                </View>                                    
            </View>
        </>
    )
}

const MoneyProtected = ({navigation}) => {

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['Your Money is Protected', '']} />,
    });

    return (
        <>
            <View style={styles.container}>
                <Separator />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
                        
                        <View style={{flex: 1, width: '100%', paddingVertical: 30, marginBottom: 8}}>
                            <Image 
                                style={{resizeMode: 'contain', width: '100%', height: 80}}
                                source={require('../../../../../../../../assets/images/SecurityAndPrivacy/money.png')}
                            />
                        </View>

                        <View style={{flex: 1, paddingHorizontal: 16, marginTop: 8}}>
                            
                            <Text style={{fontFamily: FONTS.BOLD, fontSize: FONT_SIZE.M}}>Your money is protected</Text>
                            <Text style={{fontFamily: FONTS.REGULAR, fontSize: FONT_SIZE.S}}>Your wallet balance is stored and protected with a trusted partner bank.</Text>
                            
                            <View style={{flex: 1, marginTop: 12, marginBottom: 10}}>
                                
                                {[{
                                    title: "Separated for your security",
                                    content: "Your toktokwallet balance is help in a dedicated customer account with BDO."
                                }, {
                                    title: "Regulated by the local monetary authority",
                                    content: "toktokwallet is regulated by Bangko Sentral ng Pilipinas (BSP)."
                                }].map((data, i) => <ListItem title={data.title} content={data.content} />)}

                            </View>

                        </View>

                    </View>
                </ScrollView>
                
            </View>
        </>
    )
}

export default MoneyProtected


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