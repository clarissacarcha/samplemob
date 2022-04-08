import React from 'react'
import { View, Text, FlatList } from 'react-native';
import { FormatDateTime } from '../../../../helpers';
import { FONT } from '../../../../../res/variables';
import { RenderRow } from './SubComponents'

export const RenderDeliveryLog = ({ data }) => {

  const statuses = [
    { state: "Order Confirmed", value: data.dateOrdered },
    { state: "Preparing Order", value: data.dateOrderProcessed },
    { state: "Order is ready to be picked up", value: data.dateReadyPickup },
    { state: "Booking order is confirmed", value: data.dateBookingConfirmed },
    { state: "Order is ready to be delivered", value: data.dateFulfilled },
    { state: "Order delivered", value: data.dateShipped }
  ]

  return (
    <View style={{paddingVertical: 16, paddingHorizontal: 16}}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontFamily: FONT.BOLD }}>Delivery Log</Text>
        </View>
      </View>
      <View style={{ height: 2, backgroundColor: '#F7F7FA', marginVertical: 15}} />
      <FlatList
        data={statuses.reverse()}
        renderItem={({ item, index }) => {

          let value = ""

          if (item.value == "Invalid date" || item.value == undefined) {
            value = ""
          } else {
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
    </View>
  )
}
