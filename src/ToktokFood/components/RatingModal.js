import React, {useState} from 'react';
import {View, Modal, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';

// Fonts & Colors
import {COLORS, FONTS, FONT_SIZE, NUMBERS, BUTTON_HEIGHT} from 'res/constants';

// Utils
import {verticalScale, moderateScale, scale} from 'toktokfood/helper/scale';
import {success_ic, error_ic, warning_ic, question_ic, star, star_no_fill, star_gray, star_half} from 'toktokfood/assets/images';
import { FlatList } from 'react-native';
import CustomStarRating from './CustomStarRating';
import LoadingIndicator from './LoadingIndicator';

const RatingModal = (props) => {

    const {
        children,
        visibility,
        title,
        onCloseModal,
        btnTitle,
        imgSrc,
        rating,
        ratingDisabled,
        showRating,
        readOnly,
        onFinishRating,
        loading
    } = props;
  
    return (
        <Modal 
            visible={visibility}
            style={styles.modal}
            transparent={true}
        >
            <View style={styles.content}>
                <View style={[styles.prompContentWrapper, NUMBERS.SHADOW]}>
                    { !!title && <Text style={styles.title}>{title}</Text> }
                    <Image style={styles.icon} source={{ uri: imgSrc }} resizeMode="cover" />
                    <View style={styles.messegeWrapper}>
                        {children}
                    </View>
                    <CustomStarRating
                        showRating={showRating}
                        readOnly={readOnly}
                        rating={rating}
                        onFinishRating={onFinishRating}
                    />
                    <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.confirmButton} onPress={() => onCloseModal()}>
                        { loading ? (
                            <LoadingIndicator isLoading={loading} color='#ffffff' />
                        ) : (
                            <Text style={styles.buttonText}>{btnTitle}</Text>
                        ) }
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(34, 34, 34, 0.5)',
    },
    prompContentWrapper: {
        display: 'flex',
        borderRadius: 14,
        alignItems: 'center',
        width: moderateScale(325),
        backgroundColor: COLORS.WHITE,
        padding: verticalScale(20),
    },
    icon: {
        width: scale(100),
        height: scale(100),
        borderRadius: 100,
    },
    messegeWrapper: {
        display: 'flex',
        alignItems: 'center',
        paddingHorizontal: scale(22),
        paddingTop: verticalScale(15),
    },
  
    buttonWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    confirmButton: {
        flex: 1,
        alignItems: 'center',
        height: BUTTON_HEIGHT,
        justifyContent: 'center',
        backgroundColor: '#FFA700',
        borderRadius: NUMBERS.BORDER_RADIUS,
        marginTop: 15
    },
    buttonText: {
        color: COLORS.WHITE,
        fontSize: FONT_SIZE.L,
        fontFamily: FONTS.BOLD,
    },
    title: {
        color: COLORS.BLACK,
        fontSize: FONT_SIZE.L,
        fontFamily: FONTS.BOLD,
        paddingBottom: 15
    }
});

export default RatingModal;
