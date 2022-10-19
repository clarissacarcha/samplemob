/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect, useRef, useState} from 'react';
import type {PropsType} from './types';
import {Container, Image, ImageContainer, Text} from './Styled';
import Modal from 'react-native-modal';
import {loading_animation, success_mini_image} from 'toktokfood/assets/images';
import {useDispatch, useSelector} from 'react-redux';
const StyledLoader = (props: PropsType): React$Node => {
  const dispatch = useDispatch();
  const {loader} = useSelector(select => select.toktokFood);
  // const {setIsLoaderVisible} = useLoader();
  const {isVisible, text = '', type} = props;
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    setIsLoaderVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (type && isVisible) {
      timer.current = setTimeout(() => {
        const payload = {...loader, isVisible: false};
        dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
      }, 2000);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [type, isVisible]);

  return (
    <Modal
      isVisible={isLoaderVisible}
      borderRadius={10}
      // flex={0}
      alignSelf="center"
      animationIn="zoomIn"
      animationOut="zoomOut">
      <Container>
        <ImageContainer type={type}>
          {type ? (
            <Image source={type === 'success' ? success_mini_image : success_mini_image} size={80} />
          ) : (
            <Image source={loading_animation} />
          )}
        </ImageContainer>
        {text.length > 0 && <Text type={type}>{text}</Text>}
      </Container>
    </Modal>
  );
};

export default StyledLoader;
