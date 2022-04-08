import React,{ useState } from 'react'
import {View, Text, FlatList} from 'react-native';
import { FormatDateTime} from '../../../../helpers';
import { FONT } from '../../../../../res/variables';
import CustomIcon from "../../../../Components/Icons";

export const RenderHistory = ({data}) => {
  
    const statuses = [
        {state: "Order Confirmed", value: data.dateOrdered},
        {state: "Preparing Order", value: data.dateOrderProcessed},
        {state: "Order is ready to be picked up", value: data.dateReadyPickup},
        {state: "Booking order is confirmed", value: data.dateBookingConfirmed},
        {state: "Order is ready to be delivered", value: data.dateFulfilled},
        {state: "Order delivered", value: data.dateShipped}
      ]
    
      const RenderRow = ({rows, item, index, active, value}) => {
    
        const stateColor = active ? "#F6841F" : "#CCCCCC"
        
        const smallDots = (number,color) => (
          <View style={{alignItems: 'center'}}>
            {[...Array(number)].map((index) => 
                <CustomIcon.FA5Icon key = {index} name="stop" size={2} color={color} style={{marginVertical: 1, marginHorizontal: 2}} />
              )}
          </View>
        )
    
        return (
          <>
            <View style={{flexDirection: 'row',alignItems:'center'}}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>          
                {index !== 0 ? smallDots(3,'#ccc') : smallDots(4,'#fff')}
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <CustomIcon.MCIcon name="circle" size={9} color={stateColor} style={{}} />
                </View>
                <View style={{alignItems: 'center'}}>
                  {index < rows - 1 ? smallDots(2,'#ccc') : smallDots(3,'#fff')}
                </View>
              </View>
              <View style={{flex: 3, justifyContent: 'center'}}>
                <Text style={{fontSize: 13, color: active ? "#F6841F" : "#929191", fontFamily: active ? FONT.BOLD : FONT.REGULAR }}>
                  {item.state}
                </Text>
              </View>
              <View style={{flex: 2, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'flex-end'}}>
                <Text style={{fontSize: 12, color: "#929191"}}>{value}</Text>
              </View>
            </View>
          </>
        )
      }
    
      return (
        <>
          <View style={{flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 16}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>Delivery Log</Text>
            </View>
          </View>
          <View style={{ height: 2, backgroundColor: '#F7F7FA', marginHorizontal:16}} />
          <FlatList 
            data={statuses.reverse()}
            renderItem={({item, index}) => {
    
              let value = ""
    
              if(item.value == "Invalid date" || item.value == undefined){
                value = ""
              }else{
                value = `${FormatDateTime(item.value)}`
              }
    
              return (
                <RenderRow 
                  rows={statuses.length} 
                  item={item} 
                  index={index} 
                  active={value != ""}
                  value={value}
                />
              )
    
            }}
          />
        </>
      )    
}
