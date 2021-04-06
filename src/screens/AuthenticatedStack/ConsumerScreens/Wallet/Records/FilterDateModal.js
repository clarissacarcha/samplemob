import React from 'react'
import {View,Text,TouchableOpacity,Modal,Dimensions} from 'react-native'
import { FONT_REGULAR , FONT_MEDIUM, DARK, COLOR } from '../../../../../res/constants'
import DatePicker from 'react-native-date-picker'

const {height,width} = Dimensions.get("window")

const FilterDateModal = ({showFilterDate,setShowFilterDate, filterDate , changeFilterDate})=> {
    
    const minDate = new Date('1900-01-01');
    const todayDate = new Date();

    return (
        <Modal
           visible={showFilterDate}
           animationType="fade"
           transparent={true}
           onRequestClose={()=>setShowFilterDate(false)}
          >

              <View style={{flex: 1 ,justifyContent: "center",alignItems: "center" ,backgroundColor: "rgba(0,0,0,0.7)"}}> 
                  <View style={{width: "90%" , height: height * 0.8 , backgroundColor: "white",padding: 10,borderRadius: 20,  shadowColor: '#000',
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
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 18}}>From</Text>
                        <DatePicker date={new Date(filterDate.from)} onDateChange={(date)=>changeFilterDate("from",date)} mode="date" maximumDate={todayDate} minimumDate={minDate} />
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 18,marginTop: 20}}>To</Text>
                        <DatePicker date={filterDate.to} onDateChange={(date)=>changeFilterDate("to",date)} mode="date" maximumDate={todayDate} minimumDate={minDate} />
                        
                        <View style={{flexDirection: "row", marginTop: 20,padding: 10}}>
                           <TouchableOpacity onPress={()=>setShowFilterDate(false)} style={{marginRight: 5, padding: 10,borderColor:"gray",borderWidth: 1, flex: 1,borderRadius: 10, alignItems: "center"}}>
                                <Text style={{color: "gray",fontFamily: FONT_REGULAR,fontSize: 12}}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setShowFilterDate(false)} style={{marginLeft: 5,padding: 10,backgroundColor: DARK, flex: 1,borderRadius: 10, alignItems: "center"}}>
                                <Text style={{color: COLOR,fontFamily: FONT_REGULAR,fontSize: 12}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                       
                        
                  </View>
              </View>

          </Modal>
        )
}

export default FilterDateModal