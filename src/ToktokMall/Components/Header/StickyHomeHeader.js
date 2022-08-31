import React from 'react'
import { Text, View, Animated, StyleSheet, ImageBackground } from 'react-native'
import StickyParallaxHeader from 'react-native-sticky-parallax-header'
import { LandingSubHeader, LandingHeader } from './'

import {banner} from '../../assets';

export const StickyHomeHeader = ({navigation, children}) => {

  const translation = new Animated.Value(0)
  const [scroll, setScroll] = React.useState(new Animated.Value(0))
  const [_value, set_Value] = React.useState(0)

  React.useEffect(() => {
    scroll.addListener(({value}) => set_Value(value))
  }, [])

  const renderContent = () => {
    return (
      <>
        <View style={styles.content}>
          <Text>{label}</Text>
        </View>
      </>
    )
  }
  
  const renderForeground = () => {
    
    const titleOpacity = scroll.interpolate({
      inputRange: [0, 106, 154],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp'
    })
  
    return (
      <View style={{backgroundColor: 'red', alignItems: 'center', justifyContent: 'flex-end'}}>
        <Animated.View style={{ opacity: titleOpacity }}>
          <Text>Foreground</Text>
        </Animated.View>
      </View>
    )
  }
  
  const renderHeader = () => {
  
    const opacity = scroll.interpolate({
      inputRange: [0, 120, 170],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
  
    return (
      <View style={{backgroundColor: 'orange', justifyContent: 'center'}}>
        <Animated.View style={{
          marginTop: 10,
          backgroundColor: 'green',
          transform: [{
            translateY: scroll.interpolate({
              inputRange: [0, 60],
              outputRange: [0, 60]
            })
          }]
        }}>
          <Text>Render Header</Text>
        </Animated.View>
      </View>
    )
  }

  return (
    <>
      {/* <ImageBackground
        source={banner}
        imageStyle={{resizeMode: 'stretch', width: '100%', height: 130}}
        style={{width: '100%'}}
      >
        <StickyParallaxHeader
          foreground={renderForeground()}
          header={renderHeader()}
          parallaxHeight={0}
          headerHeight={86}
          headerSize={() => {}}
          onEndReached={() => {}}
          scrollEvent={Animated.event([{ nativeEvent: { contentOffset: { y: scroll } } }])}        
        >
        </StickyParallaxHeader>
      </ImageBackground> */}
      <StickyParallaxHeader
          foreground={renderForeground()}
          header={renderHeader()}
          parallaxHeight={0}
          // transparentHeader={true}
          headerHeight={86}
          headerSize={() => {}}
          onEndReached={() => {}}
          scrollEvent={Animated.event([{ nativeEvent: { contentOffset: { y: scroll } } }])}        
      >
        {children}
      </StickyParallaxHeader>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    height: 1000,
    marginTop: 50
  },
  foreground: {
    flex: 0.2,
    justifyContent: 'flex-end',
    backgroundColor: 'red'
  },
  message: {
    color: 'white',
    fontSize: 40,
    paddingTop: 24,
    paddingBottom: 7
  },
  headerWrapper: {
    backgroundColor: 'green',
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 25,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 16,
    color: 'white',
    margin: 12
  },
  tabsWrapper: {
    paddingVertical: 12
  },
  tabTextContainerStyle: {
    backgroundColor: 'transparent',
    borderRadius: 18
  },
  tabTextContainerActiveStyle: {
    backgroundColor: 'lightgreen'
  },
  tabText: {
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: 'white'
  }
})