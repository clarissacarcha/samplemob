import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight, Card } from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import { AlertOverlay} from '../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables';


const ListItem = () => {
    return (
        <>
            <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 20}}>
                <View style={{flex: 0, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={require("../../../../../../assets/images/toktokwallet.png")} style={{width: 35, height: 35, resizeMode: 'cover', borderRadius: 35 / 2}} />
                </View>
                <View style={{flex: 9, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 6}}>
                    <Text style={{fontSize: 14, fontFamily: FONT.REGULAR}}>Face Mask PH</Text>
                </View>
                <TouchableOpacity style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
                    <Text style={{fontSize: 12, color: "#F6841F"}}>Unfollow</Text>
                </TouchableOpacity>
            </View>
            <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
        </>
    )
}

export const ToktokMallMyFollowing = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['Following', '']} />,
        headerRight: () => <HeaderRight hidden={true} />
    });

    return (
        <>
        <View style={styles.container}>
            <View style={{flex: 1}}>              
              
                <View style={{height: 8, backgroundColor: '#F7F7FA'}} />

                <ListItem />
                <ListItem />
                <ListItem />                
            
            </View>

        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    }
})
