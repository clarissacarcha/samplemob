import React from 'react'
import {View,Text,Modal} from 'react-native'
import DatePicker from 'react-native-date-picker'
import { YellowButton } from 'src/revamp'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS


export const FilterDateModal = ({showFilterDate,setShowFilterDate, filterDate , changeFilterDate})=> {
    
    // const minDate = new Date('1900-01-01');
    const todayDate = new Date();
    const year = todayDate.getFullYear()
    const month = todayDate.getMonth()
    const day = todayDate.getDate()
    const minDate = new Date(year, month - 3 ,day)

    return (
        <Modal
           visible={showFilterDate}
           animationType="fade"
           transparent={true}
           onRequestClose={()=>setShowFilterDate(false)}
          >

              <View style={{flex: 1 ,justifyContent: "center",alignItems: "center" ,backgroundColor: "rgba(0,0,0,0.7)"}}> 
                  <View style={{width: "95%"  , backgroundColor: "white",padding: 10,  shadowColor: '#000',
                                borderRadius: 5,
                                justifyContent: "center",
                                alignItems: "center",
                                shadowOffset: {
                                width: 0,
                                height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,}}
                    >
                        {/* <Text style={{fontFamily: FONT_MEDIUM, marginVertical: 10,fontSize: 16, color:"orange"}}>Filter last 3 months transactions</Text> */}
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.XL,color: COLOR.DARK}}>Date From</Text>
                        <DatePicker date={new Date(filterDate.from)} onDateChange={(date)=>changeFilterDate("from",date)} mode="date" maximumDate={todayDate} minimumDate={minDate} />
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.XL,marginTop: 20}}>Date To</Text>
                        <DatePicker date={filterDate.to} onDateChange={(date)=>changeFilterDate("to",date)} mode="date" maximumDate={todayDate} minimumDate={minDate} />
                        
                        <View style={{marginTop: 20,width:"100%"}}>
                            <YellowButton label="Ok" onPress={()=>setShowFilterDate(false)}/>
                        </View>
                       
                        
                  </View>
              </View>

          </Modal>
        )
}

