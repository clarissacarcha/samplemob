import React,{ useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Price } from '../../../../helpers';
import { FONT, COLOR } from '../../../../../res/variables';
import { origin, destination} from './../../../../assets';
import AIcons from 'react-native-vector-icons/dist/AntDesign';
import { RenderDot } from './SubComponents';

export const RenderSummary = ({data}) => {

    // const grandTotal = parseFloat(data?.payments?.shippingFee) + parseFloat(data?.totalAmount) - parseFloat(data?.discounts?.totalDiscount)
    const grandTotal = data?.payments?.grandTotal
    const [bolean,setBolean] = useState(false);
    
    return (
      <>
        <View style={styles.shippingContainer}>
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
            <Text style={styles.itemPriceText}>
              <Price amount={data?.payments?.shippingFee} />
            </Text>
            <Text style={styles.itemAmountText}>
              <Price amount={data?.totalAmount} />
            </Text>
          </View>
        </View>
  
        <View style={styles.line} />
  
        <View style={styles.locationContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.locationImages}
              source={origin}
            />
            <View><RenderDot number={7} color={'#ccc'}/></View>
            <Image
              style={styles.locationImages}
              source={destination}
            />
          </View>
  
          <View style={{ flex: 1, justifyContent: 'center', marginVertical:16}}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.locationName} numberOfLines={2}>
                  {data?.location?.destination?.name}
                </Text>
              </View>
            </View>
            <View>
            <View style={{ flexDirection: 'row', paddingTop: 3 }}>
                <View style={{ flex: 1.5 }}>
                  <Text style={styles.locationAddress}>
                    {data?.location?.destination?.address}
                  </Text>
                </View>
                <View style={{ flex: 0.2 }}></View>
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'center',paddingTop:16}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.locationName} numberOfLines={2}>
                    {data?.location?.origin?.name}
                  </Text>
                </View>
              </View>
  
              <View style={{flexDirection: 'row', paddingTop: 3}}>
                <View style={{flex: 1.5}}>
                  <Text style={styles.locationAddress}>
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
          <View style={styles.itemTotalContainer}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 13}}>Shipping Total</Text>
              <Text style={styles.itemTotalText}>Merchandise Subtotal </Text>
              {data?.discounts?.totalDiscount > 0 && <Text style={styles.itemTotalText}>Discount </Text>}              
            </View>
            <View styl={{flex: 1}}>
              <Text style={{fontSize: 13, textAlign:'right'}}>
                <Price amount={data?.payments?.shippingFee} />
              </Text>
              <Text style={styles.itemTotalText}>
                <Price amount={data?.srpTotalamount} />
              </Text>
              {data?.discounts?.totalDiscount > 0 &&
                <Text style={{fontSize: 13, paddingTop:8, color: "#ED3A19"}}>
                  - <Price amount={data?.discounts?.totalDiscount} />
                </Text>
              }
            </View>
          </View>
        }

        <TouchableOpacity onPress={()=>setBolean(!bolean)}>
          <View style={styles.itemTotalAmountContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.itemTotalAmountText}>Total</Text>
            </View>
            <View styl={{flex: 1 }}>
              <Text style={styles.itemTotalAmountPrice}>
                <Price amount={grandTotal} />
              </Text>
            </View>
            <View styl={{flex: 1}}>
                <AIcons 
                  name={bolean ? 'up' : 'down'} 
                  size={17} color={COLOR.ORANGE}
                />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.line} />
      </>
    )
}

const styles = StyleSheet.create({
  line: {
    height: 8, 
    backgroundColor: '#F7F7FA'
  },
  shippingContainer: {
    flexDirection: 'row', 
    paddingVertical: 20, 
    paddingHorizontal: 15
  },
  itemPriceText: {
    fontSize: 13, 
    textAlign:'right', 
    paddingBottom: 8
  },
  itemAmountText: {
    color: "#F6841F", 
    fontSize: 13, 
    fontFamily: FONT.BOLD
  },
  locationContainer: {
    flexDirection: 'row', 
    flex: 1 
  },
  locationImages: {
    height: 20, 
    width: 12, 
    resizeMode: 'contain' 
  },
  locationName: {
    fontSize: 13, 
    fontWeight: '100' 
  },
  locationAddress: {
    color: "#525252", 
    fontSize: 12
  },
  imageContainer: {
    marginHorizontal:10,
    marginVertical:23
  },
  itemTotalContainer: {
    flexDirection: 'row', 
    paddingVertical: 16, 
    paddingHorizontal: 16
  },
  itemTotalText: {
    fontSize: 13,
    paddingTop:8
  },
  itemTotalAmountContainer: {
    flexDirection: 'row', 
    alignItems:'center', 
    paddingVertical: 10, 
    paddingHorizontal: 15
  },
  itemTotalAmountText: {
    fontSize: 13, 
    fontFamily: FONT.BOLD, 
    color: "#F6841F"
  },
  itemTotalAmountPrice: {
    color: "#F6841F", 
    fontSize: 13, 
    fontFamily: FONT.BOLD, 
    paddingHorizontal: 5
  }
})