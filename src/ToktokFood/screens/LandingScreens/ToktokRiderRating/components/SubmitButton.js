

import React, {useState} from 'react';
import { Rating } from 'react-native-ratings';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLOR} from 'res/variables';
import {scale, getDeviceWidth} from 'toktokfood/helper/scale';
import {COLORS, FONTS, FONT_SIZE, BUTTON_HEIGHT} from 'res/constants';

export const SubmitButton = () => {

    return (
        <TouchableOpacity style={styles.submitRatingButton} onPress={() => {}}>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
    );
  };



const styles = StyleSheet.create({
    submitRatingButton: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: BUTTON_HEIGHT,
        backgroundColor: COLOR.YELLOW,
        marginVertical: scale(15),
        marginHorizontal: 16
    },
    buttonText: {
        color: COLORS.BLACK,
        fontSize: FONT_SIZE.L,
        fontFamily: FONTS.BOLD,
    },
  });
  