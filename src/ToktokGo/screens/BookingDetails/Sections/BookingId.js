import React from 'react'
import { Text, StyleSheet, Image, View } from 'react-native'
import constants from '../../../../common/res/constants'
import { APP_FLAVOR, DARK, FONTS, MEDIUM } from '../../../../res/constants'
import { FONT } from '../../../../res/variables'
// import CashImage from '../../../../assets/toktok/images/Cash.png';
// import ToktokIcon from '../../../../assets/toktok/images/ToktokIcon.png';

export const BookingID = ({delivery}) => {
    return (
        <View style={styles.card}>
            <View style={[styles.cardShadow, {marginBottom: 20}]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{marginLeft: 10, color: DARK, fontFamily: FONTS.BOLD, fontSize: constants.FONT_SIZE.M}}>
                    Booking ID
                  </Text>
                </View>
                <Text style={{color: constants.COLOR.YELLOW, fontSize: constants.FONT_SIZE.M, fontFamily: FONTS.BOLD,marginRight:10}}>{delivery.deliveryId}</Text>
              </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: constants.COLOR.WHITE,
    },
    cardShadow: {
      padding: 10,
      margin: 16,
      borderRadius: 5,
      backgroundColor: constants.COLOR.MEDIUM_DARK,
    },
    directionDetail: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    directionsBox: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      justifyContent: 'space-between',
    },
    items: {
      fontFamily: FONT.REGULAR,
      color: constants.COLOR.DARK,
      fontSize: constants.FONT_SIZE.M,
      marginTop: 2,
    }
})
