import React,{ useState } from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native';
import { Price } from '../../../../helpers';
import { FONT, COLOR } from '../../../../../res/variables';
import { origin, destination} from './../../../../assets';
import AIcons from 'react-native-vector-icons/dist/AntDesign';
import { RenderDot } from './SubComponents';

export const RenderSummary = ({data}) => {
    const grandTotal = parseFloat(data?.payments?.shippingFee) + parseFloat(data?.totalAmount)
  
    const [bolean,setBolean] = useState(false);
    
    return (
      <>
        <View style={{flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 13}}>Shipping Fee:</Text>
            <Text style={{fontSize: 13, paddingTop: 8}}>
              Order Total (
                {data?.orders?.totalItems}{' '}
                {data?.orders?.totalItems > 1 ? "items" : "item"}
              ): 
            </Text>
          </View>
          <View styl={{flex: 1}}>
            <Text style={{fontSize: 13, textAlign:'right', paddingBottom: 8}}><Price amount={data?.payments?.shippingFee} /></Text>
            <Text style={{color: "#F6841F", fontSize: 13, fontFamily: FONT.BOLD}}><Price amount={data?.totalAmount} /></Text>
          </View>
        </View>
  
        <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
  
        <View style={{ flexDirection: 'row', flex: 1,}}>
          <View style={{marginHorizontal:10,marginVertical:23}}>
            <Image
              style={{ height: 20, width: 12, resizeMode: 'contain' }}
              source={origin}
            />
            <View>
              <RenderDot number={7} color={'#ccc'}/>
            </View>
            <Image
              style={{ height: 20, width: 12, resizeMode: 'contain' }}
              source={destination}
            />
          </View>
  
          <View style={{ flex: 1, justifyContent: 'center', marginVertical:16}}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '100' }} numberOfLines={2}>{data?.location?.destination?.name}</Text>
              </View>
            </View>
            <View>
            <View style={{ flexDirection: 'row', paddingTop: 3 }}>
                <View style={{ flex: 1.5 }}>
                  <Text style={{ color: "#525252", fontSize: 11 }}>{data?.location?.destination?.address}</Text>
                </View>
                <View style={{ flex: 0.2 }}></View>
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'center',paddingTop:16}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 13, fontWeight: '100'}} numberOfLines={2}>
                    {data?.location?.origin?.name}
                  </Text>
                </View>
              </View>
  
              <View style={{flexDirection: 'row', paddingTop: 3}}>
                <View style={{flex: 1.5}}>
                  <Text style={{color: "#525252", fontSize: 11}}>
                    {data?.location?.origin?.address}
                  </Text>
                </View>
                <View style={{flex: 0.2}}></View>
              </View>
            </View> 
            </View>
        </View>
  
        <View style={{ height: 2, backgroundColor: '#F7F7FA', marginHorizontal:16}} />
  
        {bolean && 
          <View style={{flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 16}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 13}}>Shipping Total:</Text>
              <Text style={{fontSize: 13,paddingTop:8}}>Merchandise Subtotal: </Text>
            </View>
            <View styl={{flex: 1}}>
              <Text style={{fontSize: 13, textAlign:'right'}}><Price amount={data?.payments?.shippingFee} /></Text>
              <Text style={{fontSize: 13, paddingTop:8}}><Price amount={data?.payments.subTotal} /></Text>
            </View>
          </View>
        }

        <TouchableOpacity onPress={()=>setBolean(!bolean)}>
          <View style={{flexDirection: 'row', alignItems:'center', paddingVertical: 10, paddingHorizontal: 15}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 13, fontFamily: FONT.BOLD, color: "#F6841F"}}>Total</Text>
            </View>
            <View styl={{flex: 1 }}>
              <Text style={{color: "#F6841F", fontSize: 13, fontFamily: FONT.BOLD, paddingHorizontal: 5}}><Price amount={grandTotal} /></Text>
            </View>
            <View styl={{flex: 1}}>
                <AIcons name={bolean ? 'up' : 'down'} size={17} color={COLOR.ORANGE}/>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
      </>
    )
}
