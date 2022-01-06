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
               data.map((header,index)=>{
                   let width = "25%";
                   switch(index){
                       case 0:
                            width = "25%"
                            break
                       case 1:
                            width = "28%"
                            break
                       case 2:
                            width = "32%"
                            break
                       default:
                            width = "18%"
                            break
                   }
                   return (
                    <View style={[styles.title , {width}]}>
                            <Text style={styles.headerTitle}>{header}</Text>
                    </View>
                   )
               })
           }
         
       </View>
    )
}

const Column = ({data, rowindex})=> {

    return (
        <>
        {
            data.map((content,rowIndex)=> {

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
                                 cellwidth = "22%"
                               }
                               if(index == 1){
                                  cellwidth = "24%"
                               }
                               if(index == 2){
                                 cellwidth = "30%"
                               }
                               if(index == 3){
                                  cellwidth = "24%"
                               }
                               return (
                                   <View style={{
                                                width:cellwidth,
                                                justifyContent:"center",
                                                backgroundColor: rowIndex == 0 ? COLOR.YELLOW : rowIndex%2 == 0 ? "#FEF7E6" : "white",
                                                paddingVertical: 5
                                            }}>
                                        {
                                            row.map((displayText)=>(
                                                <Text style={[
                                                    styles.headerTitle , 
                                                    {
                                                        fontFamily: rowIndex == 0 ? FONT.BOLD : FONT.REGULAR,
                                                        fontSize: rowIndex == 0 ? moderateScale(FONT_SIZE.S) : moderateScale(FONT_SIZE.S)
                                                    }
                                                ]}>
                                                    {displayText
                                                }</Text>
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
        <ScrollView
            style={styles.container}
        >
            <Column
                data={rowsData}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        marginTop: 16,
        paddingHorizontal: 10
    },
    headings: {
        flexDirection:"row",
        // borderWidth: 1,
    },
    title: {
        width: width / 4,
        justifyContent:'center',
        alignItems:"center",
        flex: 1,
        paddingVertical: 5,
        backgroundColor:COLOR.YELLOW,
    },
    headerTitle: {
        fontFamily: FONT.BOLD,
        fontSize: scale(FONT_SIZE.S),
        paddingHorizontal: 5,
        textAlign:"center"
    },
    rowCells: {
        flex: 1,
        flexDirection:"row",
        paddingVertical: 2,
    }
})