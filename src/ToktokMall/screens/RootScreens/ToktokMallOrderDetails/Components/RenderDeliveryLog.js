import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Delivery Log</Text>
        </View>
      </View>
      <View style={styles.subContainer} />
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

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16, 
    paddingHorizontal: 16
  },
  h1: {
    fontSize: 13, 
    fontFamily: FONT.BOLD
  },
  subContainer: {
    height: 2, 
    backgroundColor: '#F7F7FA',
    marginVertical: 15
  }
}) 