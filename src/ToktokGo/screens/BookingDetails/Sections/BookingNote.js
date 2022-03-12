import React from 'react'
import { Text, StyleSheet, Image, View } from 'react-native'
import constants from '../../../../common/res/constants'
import { APP_FLAVOR, MEDIUM } from '../../../../res/constants'
import { FONT } from '../../../../res/variables'
// import CashImage from '../../../../assets/toktok/images/Cash.png';
// import ToktokIcon from '../../../../assets/toktok/images/ToktokIcon.png';

export const BookingNote = ({delivery}) => {       
    
    return (
        <View style={styles.card}>
            <View style={styles.directionsBox}>
                <View style={styles.directionDetail}>
                {/*-------------------- ORDER DATE --------------------*/}
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <View>
                            <Text style={{fontFamily: FONT.REGULAR, fontSize: constants.FONT_SIZE.M}}>
                                Note to Driver
                            </Text>
                            <Text style={styles.items}>
                                {delivery.notes}
                            </Text>
                        </View>
                    </View>
                </View>
           </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: constants.COLOR.WHITE,
        // marginTop: 5,
        // alignItems: 'center',
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
