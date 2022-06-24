import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';

import CONSTANTS from '../../../common/res/constants';
import {ThrottledOpacity} from '../../../components_section';
import {SuccessVoucherClaimedModal} from './Components';
import {Header} from '../Components';

import GraphicsIMG from '../../../assets/images/Promos/Dummy_graphics.png';

const FULL_HEIGHT = Dimensions.get('window').height;
const FULL_WIDTH = Dimensions.get('window').width;

export const SelectedVoucherScreen = ({navigation, route}) => {
  const {data} = route.params;
  const [viewSuccesVoucherClaimedModal, setViewSuccesVoucherClaimedModal] = useState(false);

  return (
    <View style={styles.outerContainer}>
      <SuccessVoucherClaimedModal isVissible={viewSuccesVoucherClaimedModal} />
      <Header title={data.title} navigation={navigation} />
      <View style={styles.container}>
        <Image
          source={GraphicsIMG}
          resizeMode={'stretch'}
          style={{height: FULL_HEIGHT * 0.22, width: FULL_WIDTH - 32}}
        />
        <Text style={{marginVertical: 16}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim lacus aenean praesent amet ullamcorper nec ac.
          Augue aliquam risus nam pellentesque etiam mattis id nunc. Faucibus diam vitae bibendum viverra adipiscing.
        </Text>
        <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD}}>Promo Terms and Conditions</Text>
        <Text style={{marginVertical: 16}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim lacus aenean praesent amet ullamcorper nec ac.
          Augue aliquam risus nam pellentesque etiam mattis id nunc. Faucibus diam vitae bibendum viverra adipiscing.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {data.isClaimed ? (
          <ThrottledOpacity style={styles.claimButtonWrapper} onPress={() => setViewSuccesVoucherClaimedModal(true)}>
            <Text style={styles.claimText}>Claim</Text>
          </ThrottledOpacity>
        ) : (
          <ThrottledOpacity style={styles.useButtonWrapper}>
            <Text style={styles.useText}>Use</Text>
          </ThrottledOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  buttonContainer: {
    position: 'absolute',
    zIndex: 999,
    bottom: 0,
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    paddingTop: 16,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.2,
    elevation: 5,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
  },
  useButtonWrapper: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    marginBottom: 16,
    paddingVertical: 11,
    alignItems: 'center',
  },
  useText: {
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.ORANGE,
  },
  claimButtonWrapper: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    marginBottom: 16,
    paddingVertical: 11,
    alignItems: 'center',
  },
  claimText: {
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
