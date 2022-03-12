import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Linking } from 'react-native';
import EIcons from 'react-native-vector-icons/Entypo';
import CONSTANTS from '../../../../common/res/constants';

import PhoneIcon from "../../../../assets/images/phoneIcon.png"
import MessageIcon from "../../../../assets/images/messageIcon.png"
import NavigateIcon from "../../../../assets/images/navigateIcon.png"
import ProfileImagePlaceHolder from '../../../../assets/icons/ProfileIcon.png';
import VaccinatedIcon from '../../../../assets/images/vaccinated.png'
import StarIcon from '../../../../assets/images/star.png'

export const BookingDriverDetails = ({stop}) => {
    const navigateToStop = () => {
        const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
        const latLng = `${stop.latitude},${stop.longitude}`;
        const label = stop.name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });

        Linking.openURL(url);
    }

    const callStop = () => {
        // const link = Platform.OS === 'android' ? `tel:${stop.mobile}` : `telprompt:${stop.mobile}`;
        const link = Platform.OS === 'android' ? `tel:+639151111111` : `telprompt:+639151111111`;
        Linking.openURL(link);
    }
    
    const messageStop = () => {
        // Linking.openURL(`sms:${stop.mobile}`);
        Linking.openURL(`sms:+639151111111`);
    }

    const imageRender = () => {
        // to do: condition, driver image here 
        return ProfileImagePlaceHolder;
      }

    return (
        <>
        <Text style={styles.titleCard}>Driver Details</Text>
        <View style={styles.contentCard}>
            <View style={styles.imageContainer}>
                <Image source={imageRender()} resizeMode={'cover'} style={styles.middleImageContent}/>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.detailName}>Juan Dela Cruz</Text>
                <Text style={styles.detailVehicle}>Honda Civic (White) · DA963000 </Text>
                <View style={styles.ratingContainer}>
                    <Text>5.0</Text>
                    <Image source={StarIcon} resizeMode={'contain'} style={styles.starIconDetail}/> 
                    <Image source={VaccinatedIcon} resizeMode={'contain'} style={styles.vaccinatedIconDetail}/> 
                </View>
            </View>
            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={messageStop} style={styles.iconContainer}>
                    <Image source={MessageIcon} resizeMode={'contain'} style={styles.iconDimensions} /> 
                </TouchableOpacity>
                <TouchableOpacity onPress={callStop} style={styles.iconContainer}>
                    <Image source={PhoneIcon} resizeMode={'contain'} style={styles.iconDimensions} /> 
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToStop} style={styles.iconContainer}>
                    <Image source={NavigateIcon} resizeMode={'contain'} style={styles.iconDimensions} /> 
                </TouchableOpacity>
            </View>
        </View> 
        </> 
    )
}

const styles = StyleSheet.create({
    titleCard: {
        marginLeft: 16, 
        fontFamily: CONSTANTS.FONT_FAMILY.BOLD, 
        fontSize: CONSTANTS.FONT_SIZE.M
    },
    contentCard: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        width: '17%',
    },
    detailsContainer: { 
        flexDirection: 'column', 
        width:'53%'
    },
    detailName: { 
        fontSize: CONSTANTS.FONT_SIZE.M, 
        fontFamily: CONSTANTS.FONT_FAMILY.BOLD
    },
    detailVehicle: { 
        fontSize: CONSTANTS.FONT_SIZE.S
    },
    starIconDetail: {
        width: 15, 
        height: 15, 
        marginHorizontal: 3
    },
    vaccinatedIconDetail: { 
        width: 54, 
        height: 15
    },
    middleImageContent: {
        width: 55, 
        height: 55, 
        borderRadius: 100, 
        borderWidth:2, 
        borderColor: CONSTANTS.COLOR.ORANGE
    },
    iconsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around',
        width: '30%'
    },
    iconContainer: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        width:30, 
        height: 30, 
        padding: 0,
        borderWidth:1, 
        borderColor: CONSTANTS.COLOR.ORANGE, 
        borderRadius:4 
    },
    iconDimensions: { 
        width: 15, 
        height: 15
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3
    }
});