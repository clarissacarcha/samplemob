/**
 * @format
 * @flow
 */

import React, {useEffect, useRef} from 'react';
import type {PropsType} from './types';
import {Container, Image, ImageContainer, Text} from './Styled';
import {Modal} from 'toktokfood/components/Modal';
import {loading_animation, success_mini_image} from 'toktokfood/assets/images';
import {useLoader} from 'toktokfood/hooks';
const StyledLoader = (props: PropsType): React$Node => {
  const [loaderState, setLoaderState] = useLoader();
  // const {setIsLoaderVisible} = useLoader();
  const {isVisible, text = '', type} = props;
  const timer = useRef(null);

  useEffect(() => {
    if (type) {
      timer.current = setTimeout(() => {
        setLoaderState({...loaderState, isVisible: false});
        // setIsLoaderVisible(false);
      }, 2000);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [loaderState, setLoaderState, type]);

  return (
    <Modal
      isVisible={isVisible}
      borderRadius={10}
      flex={0}
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
