import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,ScrollView} from 'react-native'
import CONSTANTS from 'common/res/constants'
import {moderateScale,scale} from 'toktokwallet/helper'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const { width , height } = Dimensions.get("window")

const Header = ({data})=> {

    return (
       <View style={styles.headings}>
           {
               data.map((header)=>(
                <View style={styles.title}>
                        <Text style={styles.headerTitle}>{header}</Text>
                </View>
               ))
           }
         
       </View>
    )
}

const Column = ({data, rowindex})=> {

    return (
        <>
        {
            data.map((content)=> {

                let rowBody = []
                for (const [key, value] of Object.entries(content)) {
                    rowBody.push(value)    
                }
    
                return (
                    <View style={styles.rowCells}>
                       {
                           rowBody.map((row,index)=> {
                               let cellwidth

                               if(index == 0){
                                 cellwidth = "28%"
                               }
                               if(index == 1){
                                  cellwidth = "25%"
                               }
                               if(index == 2){
                                 cellwidth = "32%"
                               }
                               if(index == 3){
                                  cellwidth = "18%"
                               }
                               return (
                                   <View style={{width:cellwidth,justifyContent:"center",}}>
                                        {
                                            row.map((displayText)=>(
                                                <Text style={[styles.headerTitle , {fontFamily: FONT.REGULAR}]}>{displayText}</Text>
                                            ))
                                        }
                                   </View>
                                  
                               )
                           })
                       }
                           
                    </View>
                )
            })
        }
        </>
    )
}


export const CustomTable = ({headerData = [], rowsData = []})=> {

    return (
        <>
            <Header
                data={headerData}
            />
            <Column
                data={rowsData}
            />
        </>
    )
}

const styles = StyleSheet.create({
    headings: {
        flexDirection:"row",
        // borderWidth: 1,
    },
    title: {
        width: width / 4,
        justifyContent:'center',
        alignItems:"flex-start",
        flex: 1,
        paddingVertical: 5,
        backgroundColor:COLOR.YELLOW,
    },
    headerTitle: {
        fontFamily: FONT.BOLD,
        fontSize: scale(FONT_SIZE.S),
        paddingHorizontal: 5,
    },
    rowCells: {
        flex: 1,
        flexDirection:"row",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        padding: 2,
    }
})