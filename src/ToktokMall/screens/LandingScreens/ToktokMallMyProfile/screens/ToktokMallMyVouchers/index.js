import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight, Card } from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import { AlertOverlay} from '../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables';

import {Tab, ListItem} from './Components';


export const ToktokMallMyVouchers = ({navigation})=> {

    const [activeTabIndex, setActiveTabIndex] = useState(0)

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['My Vouchers', '']} />,
        headerRight: () => <HeaderRight hidden={true} />
    });
    

    return (
        <>
        <View style={styles.container}>
            <View style={{flex: 1}}>      

                <Tab 
                    index={activeTabIndex}
                    onChangeTab={(index) => {
                        setActiveTabIndex(index)
                    }}
                />

                {activeTabIndex == 0 && 
                <View>
                    <ListItem status="active" />  
                    <ListItem status="active" />  
                    <ListItem status="active" />     
                </View>}

                {activeTabIndex == 1 && 
                <View>
                    <ListItem status="expired" />
                    <ListItem status="expired" />
                    <ListItem status="expired" />
                </View>}


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
