import React from 'react'
import { StyleSheet, View, Text} from "react-native";
import { numberFormat } from "toktokwallet/helper";
import CONSTANTS from 'common/res/constants';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS;

const Card = ({
    title,
    description = null,
    limit,
    used,
    remaining,
    bottomLabel = null,
})=> {
    return (
        <View style={[styles.cardShadow, styles.cardStyle]}>
            <View style={{flexDirection:"row",marginBottom: 5}}>
                <View style={{flex: 1}}>
                    <Text style={styles.labelBold}>{title}</Text>
                </View>
                <View style={{flex: 1,justifyContent:"center"}}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressBarValue,{width:`${ (+used/limit)*100 }%` }]}/>
                    </View>
                </View>
            </View>
            {description && description()}
            <View style={{flexDirection:"row",marginTop: 10}}>
                <View style={{marginRight: 10}}>
                    <Text style={[styles.labelRegular,{marginBottom: 5}]}>Limit</Text>
                    <Text style={[styles.labelRegular,{marginBottom: 5}]}>Used</Text>
                    <Text style={[styles.labelRegular,{marginBottom: 5}]}>Remaining</Text>
                </View>
                <View>
                    <Text style={[styles.labelBold,{marginBottom: 5}]}>₱{numberFormat(+limit)}</Text>
                    <Text style={[styles.labelBold,{marginBottom: 5}]}>₱{numberFormat(+used)}</Text>
                    <Text style={[styles.labelBold,{marginBottom: 5}]}>₱{numberFormat(+remaining)}</Text>
                </View>
            </View>
            {
                bottomLabel &&
                <View style={styles.cardBottomLabel}>
                    {bottomLabel()}
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    cardShadow: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      cardStyle: {
        padding: 20,
        marginBottom: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderColor: COLOR.ORANGE,
        borderTopWidth: 2,
        borderRadius: 8,
      },
      cardBottomLabel: {
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        marginTop: 10,
      },
      labelRegular: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
      },
      labelBold: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M
      },
      labelRegularSmall: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
      },
      progressBar:{
        height: 10,
        backgroundColor:"#FFF1D2",
        borderRadius: 5,
        position:"relative"
      },
      progressBarValue: {
        position: "absolute",
        height: 10,
        borderRadius: 5,
        backgroundColor:COLOR.ORANGE
      }
})

export default Card;