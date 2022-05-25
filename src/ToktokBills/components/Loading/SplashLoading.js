import React from 'react'
import { View , Text , Modal , StyleSheet , ActivityIndicator, Dimensions} from 'react-native'
import { moderateScale } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const { width } = Dimensions.get("window")

export const SplashLoading = ({
  visible
})=> {

  return (
    <Modal
      visible={visible}
      style={styles.container}
    >
      <View style={styles.body}>
        <ActivityIndicator
          size={moderateScale(100)}
          color={COLOR.DARK}
        />
        <Text style={styles.label}>
          Loading...
        </Text>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor:COLOR.YELLOW,
    justifyContent:"center",
    alignItems:"center"
  },
  label: {
    fontFamily: FONT.REGULAR,
    fontSize: moderateScale(20),
    marginTop: 20
  }
})