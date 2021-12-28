import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Modal,
  Text,
  Platform,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { floatingIcon, food1 } from "toktokfood/assets/images";
import {COLORS, FONTS, SIZES} from 'res/constants';
import FA5Icon, { TabBarItem } from 'react-native-vector-icons/FontAwesome5';
import { verticalScale, scale } from "toktokfood/helper/scale";
export const DetailsModal = ({ visible, onPressClose, data, onLayout, title }) => {

    const renderItem = ({ item }) => {

        let { statusMessage, orderId, image, shop, shopAddress, quantity, destinationAddress, statusCode } = item
       
        return (
          <TouchableWithoutFeedback key={orderId}>
            <View style={styles.cardShadow}>
              <View style={styles.imgWrapper}>
                <Image resizeMode="contain" source={image} style={styles.img} />
              </View>
              <View style={styles.restaurantInfo}>
                <Text numberOfLines={1} style={styles.restaurantDetails}>
                    {`${shop} • ${shopAddress}`}
                </Text>
                <Text numberOfLines={1} style={styles.destinationDetails}>
                    {quantity + ' items • ' + destinationAddress}
                </Text>
                <View style={styles.activityWrapper}>
                    <FA5Icon name="history" color={COLORS.DARK} size={12} style={styles.activityIcon} />
                    <Text numberOfLines={1} style={styles.statusMessage}>
                        { statusMessage }
                    </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
    };

    if(!visible){ return null }
    return (
        <Modal style={styles.container} transparent={true} animationType="fade">
            <View style={ styles.content }>
                <View style={styles.closePrompt}>
                    <View style={{ padding: 16 }}>
                        <Text style={{ fontSize: SIZES.XL, fontFamily: FONTS.BOLD, color: COLORS.ORANGE }}>
                            { title }
                        </Text>
                        <View style={styles.separator} />
                    </View>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingTop: 5 }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <View style={styles.floatingIconContainer}>
                        <TouchableOpacity onPress={onPressClose}>
                            <Image source={floatingIcon} style={styles.floatingIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(34, 34, 34, 0.5)'
    },
    closePrompt: {
        height: verticalScale(450),
        width: scale(335),
        backgroundColor: 'white',
        borderRadius: 10,
        paddingBottom: 10
    },
    actions: {
        flexDirection: 'row',
        height: 50,
    },
    cardShadow: {
        padding: 10,
        marginBottom: 10,
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
    
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    
        flexDirection: 'row',
    },
    itemContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        paddingVertical: verticalScale(8),
    },
    imgWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    img: {
        height: 75,
        width: 78,
        borderRadius: Platform.OS === 'android' ? 3 : 12,
    },
    restaurantInfo: {
        flex: 1,
        paddingEnd: 8,
        paddingStart: 10,
        color: COLORS.BLACK,
    },
    infoWrapper: {
        paddingEnd: 10,
        width: scale(250),
    },
        restaurantDetails: {
        color: COLORS.BLACK,
        fontFamily: FONTS.BOLD,
        flexShrink: 1,
        fontSize: SIZES.M
    },
    destinationDetails: {
        marginVertical: 3,
        color: COLORS.DARK,
        fontFamily: FONTS.REGULAR,
        fontSize: SIZES.S
    },
    statusMessage: {
        color: COLORS.DARK,
        fontFamily: FONTS.BOLD,
        fontSize: SIZES.XS
    },
    activityWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
        activityIcon: {
        marginEnd: 4,
    },
    floatingIconContainer: {
        alignItems: "flex-end",
        paddingHorizontal: scale(10),
        zIndex: 6
    },
    floatingIcon: {
        resizeMode: "cover",
        width: verticalScale(55),
        height: verticalScale(55)
    },
    separator: {
        borderBottomWidth: 2,
        borderBottomColor: "#F7F7FA" ,
        marginTop: 16
    }
});
  