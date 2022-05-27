import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native';
import { FormatDateTime } from '../../../../helpers';
import { FONT } from '../../../../../res/variables';
import { RenderRow } from './SubComponents'

export const RenderDeliveryLog = ({ data }) => {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    const { logs } = data
    if(data?.status?.status === 5){
      let row = []

      row.push({
        key:'Cancelled',
        date:data?.status?.date
      })
      
      logs.map((log) =>{
        if(log.date){
          row.push(log)
        }
      })

      setLogs(row)
    }else{
      setLogs(data?.logs)
    }

  },[data])

  return (
    <View style={{paddingVertical: 16, paddingHorizontal: 16}}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontFamily: FONT.BOLD }}>Delivery Log</Text>
        </View>
      </View>
      <View style={{ height: 2, backgroundColor: '#F7F7FA', marginVertical: 15}} />
      <FlatList
        data={logs}
        renderItem={({ item, index }) => {
          return (
            <RenderRow
              rows={logs.length}
              item={item}
              index={index}
            />
          )
        }}
      />
    </View>
  )
}
