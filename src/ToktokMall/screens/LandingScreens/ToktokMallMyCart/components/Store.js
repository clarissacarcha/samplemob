import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CheckBox from 'react-native-check-box';

export const Store = ({data, state = false, onSelect, onPress}) => {

    const [selected, setSelected] = useState(state)

    return (
        <>
            <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <CheckBox
                            isChecked={selected}
                            checkedCheckBoxColor="#F6841F"
                            uncheckedCheckBoxColor="#F6841F"
                            onClick={() => {
                                setSelected(!selected)
                                onSelect()
                            }}
                        />
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                       <Image source={require("../../../../assets/icons/store.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} />
                    </View>
                    <TouchableOpacity onPress={onPress} style={{flex: 9, justifyContent: 'center', flexDirection: 'row'}}>                        
                        <View style={{flex: 12, justifyContent: 'center'}}>
                            <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>{data.store}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
        </>
    )
}