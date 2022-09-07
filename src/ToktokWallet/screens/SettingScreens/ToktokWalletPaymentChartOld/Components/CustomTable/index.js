import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS
export const CustomTable = (props) => {

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
                                    borderRightColor: last ? COLOR.ORANGE : "",
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
                                                            borderRightColor: lastcol ? COLOR.ORANGE : "",
                                                            borderRightWidth: lastcol ? 0.4 : 0,
                                                            borderBottomColor: lastrow && bottom ? COLOR.ORANGE : "",
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
                                    borderRightColor: lastcol ? COLOR.ORANGE : "",
                                    borderRightWidth: lastcol ? 0.4 : 0,
                                    borderBottomColor: lastrow ? COLOR.ORANGE : "",
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
        borderTopColor: COLOR.ORANGE, 
        borderTopWidth: 0.4,
        borderLeftColor: COLOR.ORANGE, 
        borderLeftWidth: 0.4, 
        backgroundColor: COLOR.TRANSPARENT_YELLOW,
        padding: 8
    }, 
    cell: {
        flex: 1, 
        alignSelf: 'stretch', 
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: COLOR.ORANGE, 
        borderTopWidth: 0.25,
        borderLeftColor: COLOR.ORANGE, 
        borderLeftWidth: 0.25, 
        padding: 8
    }
})
