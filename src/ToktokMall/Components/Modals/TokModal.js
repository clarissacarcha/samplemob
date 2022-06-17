import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, TouchableWithoutFeedback} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FONT, FONT_SIZE} from '../../../res/variables';
import {successIcon, errorIcon, warningIcon, questionIcon} from '../../assets';

const {width, height} = Dimensions.get('screen');

export const TokModal = () => {
  const dispatch = useDispatch();
  const {
    modal: {type, onClose, title, message, actions = [], Content, onCloseDisabled},
  } = useSelector(state => state.toktokMall);

  const getIconByType =
    type == 'Success'
      ? successIcon
      : type == 'Error'
      ? errorIcon
      : type == 'Warning'
      ? warningIcon
      : type == 'Question'
      ? questionIcon
      : null;

  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback
        disabled={!!onCloseDisabled}
        onPress={() => {
          dispatch({type: 'TOKTOK_MALL_CLOSE_MODAL'});
          onClose?.();
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              minWidth: '70%',
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {Content ? (
                <Content />
              ) : (
                <>
                  {type && (
                    <>
                      <Image
                        source={getIconByType}
                        style={{width: 130, height: 120, resizeMode: 'stretch', overflow: 'hidden'}}
                      />
                      <View style={{paddingVertical: 12}} />
                    </>
                  )}
                  {title && (
                    <Text style={{color: '#F6841F', marginBottom: 10, fontSize: 22, textAlign: 'center', marginTop: 15}}>{title}</Text>
                  )}
                  <Text
                    style={{
                      fontSize: title ? FONT_SIZE.M : 20,
                      color: '#F6841F',
                      fontFamily: FONT.REGULAR,
                      textAlign: 'center',
                    }}>
                    {message}
                  </Text>
                </>
              )}
              {actions.length > 0 && <View style={{paddingVertical: 8}} />}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {actions.map(({onPress, type, name}) => (
                  <TouchableOpacity
                    onPress={() => {
                      dispatch({type: 'TOKTOK_MALL_CLOSE_MODAL'});
                      onPress?.();
                    }}
                    style={[
                      styles.button,
                      {
                        backgroundColor: type === 'outline' ? '#F6841F' : '#fff',
                      },
                    ]}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: type != 'outline' ? '#F6841F' : '#fff',
                      }}>
                      {name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 999,
    width: width,
    height: height,
    overflow: 'visible',
  },
  button: {
    marginHorizontal: 5,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F6841F',
  },
});
