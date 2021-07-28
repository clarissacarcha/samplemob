import { head } from 'lodash'
import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { COLOR, FONT, FONT_SIZE } from '../../../../../../../res/variables'
import { COLORS } from '../../../../../../../res/constants';

import { ScrollView } from 'react-native-gesture-handler';

const CustomTable = (props) => {

    const [rowsizes, setrowsizes] = useState([])
    const headingAllowance = 70

    const heading = () => {
        return (
            <>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    {props.heading.map((item, i) => {
                        rowsizes[i] = item.size
                        let last = props.heading.length -1 == i
                        return (
                            <>
                                <View style={{
                                    ...styles.cellhead, 
                                    width: item.size,
                                    height: headingAllowance,
                                    borderRightColor: last ? COLORS.ORANGE : "",
                                    borderRightWidth: last ? 0.4 : 0
                                }}>
                                    <Text style={{textAlign: 'center', fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M}}>{item.value}</Text>
                                </View>
                            </>
                        )
                    })}
                </View>
            </>
        )
    }

    const col = (data, rowindex) => {
        return (
            <>
                <View style={{flex: 1, flexDirection: 'row', backgroundColor: rowindex % 2 == 0 ? "#fafcff" : "#fff"}}>
                    {rowsizes.map((size, i) => {
                        let lastrow = rowindex == props.rows.length - 1
                        let lastcol = i == rowsizes.length - 1
                        if(data[i].length > 1){
                            return (
                                <>
                                    <View style={{ width: size}}>
                                            <View style={{flex: 1, flexDirection: 'column'}}>
                                                {data[i].map((val, j) => {
                                                    let bottom = j == data[i].length-1
                                                    return (
                                                        <View style={{
                                                            ...styles.cell, 
                                                            width: size || 150,
                                                            borderRightColor: lastcol ? COLORS.ORANGE : "",
                                                            borderRightWidth: lastcol ? 0.4 : 0,
                                                            borderBottomColor: lastrow && bottom ? COLORS.ORANGE : "",
                                                            borderBottomWidth: lastrow && bottom ? 0.4 : 0
                                                        }}>
                                                            <Text style={{textAlign: 'center', fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M}}>{val}</Text>
                                                        </View>
                                                    )
                                                })}                                        
                                            </View>
                                    </View>
                                </>
                            )
                        }else{
                            return (
                                <>
                                <View style={{
                                    ...styles.cell, 
                                    width: size || 150,
                                    borderRightColor: lastcol ? COLORS.ORANGE : "",
                                    borderRightWidth: lastcol ? 0.4 : 0,
                                    borderBottomColor: lastrow ? COLORS.ORANGE : "",
                                    borderBottomWidth: lastrow ? 0.4 : 0
                                }}>
                                    <Text style={{textAlign: 'center', fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M}}>{data[i]}</Text>
                                </View>
                                </>
                            )
                        }
                    })}
                </View>
            </>
        )
    }

    return (
        <>
            <ScrollView horizontal={true}>

                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 12}}>
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column'}}>
                        
                        <View style={{ flex: 1, alignSelf: 'stretch' }}>
                            
                            {heading()}

                            <ScrollView vertical={true} style={{marginTop: headingAllowance}}>
                            {props.rows.map((row, i) => {
                                return col(row, i)
                            })}
                            </ScrollView>
                            
                        </View>                        

                    </View>                    
                </View>

            </ScrollView>
        </>
    )
}

export default CustomTable

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    },
    cellhead: {
        flex: 1, 
        alignSelf: 'stretch', 
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: COLORS.ORANGE, 
        borderTopWidth: 0.4,
        borderLeftColor: COLORS.ORANGE, 
        borderLeftWidth: 0.4, 
        backgroundColor: COLORS.TRANSPARENT_YELLOW,
        padding: 8
    }, 
    cell: {
        flex: 1, 
        alignSelf: 'stretch', 
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: COLORS.ORANGE, 
        borderTopWidth: 0.25,
        borderLeftColor: COLORS.ORANGE, 
        borderLeftWidth: 0.25, 
        padding: 8
    }
})
