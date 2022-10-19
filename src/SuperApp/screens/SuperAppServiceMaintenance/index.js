import React from 'react';
import {Image, ImageBackground, Text, View, StatusBar, StyleSheet} from 'react-native';
import GradientBackground from '../../../assets/toktokgo/toktokgo-gradient-background.png';
import constants from '../../../common/res/constants';
import {ThrottledOpacity} from '../../../components_section';

import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';

import DeliveryMaintenance from '../../../assets/superapp/service-image/maintenance-delivery.png';
import GoMaintenance from '../../../assets/superapp/service-image/maintenance-go.png';
import FoodMaintenance from '../../../assets/superapp/service-image/maintenance-food.png';
import WalletMaintenance from '../../../assets/superapp/service-image/maintenance-wallet.png';
import MallMaintenance from '../../../assets/superapp/service-image/maintenance-mall.png';
import BillsMaintenance from '../../../assets/superapp/service-image/maintenance-bills.png';
import LoadMaintenance from '../../../assets/superapp/service-image/maintenance-load.png';
import DefaultMaintenance from '../../../assets/superapp/service-image/maintenance-default.png';

import DefaultMaintenanceLogo from '../../../assets/superapp/service-logo/maintenance-default-logo.png';
import DeliveryMaintanceLogo from '../../../assets/superapp/service-logo/toktokdelivery.png';
import GoMaintanceLogo from '../../../assets/superapp/service-logo/toktokgo.png';
import FoodMaintanceLogo from '../../../assets/superapp/service-logo/toktokfood.png';
import WalletMaintanceLogo from '../../../assets/superapp/service-logo/toktokwallet.png';
import MallMaintanceLogo from '../../../assets/superapp/service-logo/toktokmall.png';
import BillsMaintanceLogo from '../../../assets/superapp/service-logo/toktokbills.png';
import LoadMaintanceLogo from '../../../assets/superapp/service-logo/toktokload.png';

const SuperAppServiceMaintenance = ({navigation, route}) => {
  const identify = ({identifier, logo, image}) => {
    if (identifier === 'logo') {
      return logo;
    }
    if (identifier === 'image') {
      return image;
    }
  };

  const serviceImage = identifier => {
    if (!route.params?.service) {
      return identify({identifier, logo: DefaultMaintenanceLogo, image: DefaultMaintenance});
    }
    const service = route.params?.service;
    switch (service) {
      case 'DELIVERY': {
        return identify({identifier, logo: DeliveryMaintanceLogo, image: DeliveryMaintenance});
      }
      case 'GO': {
        return identify({identifier, logo: GoMaintanceLogo, image: GoMaintenance});
      }
      case 'FOOD': {
        return identify({identifier, logo: FoodMaintanceLogo, image: FoodMaintenance});
      }
      case 'WALLET': {
        return identify({identifier, logo: WalletMaintanceLogo, image: WalletMaintenance});
      }
      case 'MALL': {
        return identify({identifier, logo: MallMaintanceLogo, image: MallMaintenance});
      }
      case 'BILLS': {
        return identify({identifier, logo: BillsMaintanceLogo, image: BillsMaintenance});
      }
      case 'LOAD': {
        return identify({identifier, logo: LoadMaintanceLogo, image: LoadMaintenance});
      }
      default: {
        return identify({identifier, logo: DefaultMaintenanceLogo, image: DefaultMaintenance});
      }
    }
  };

  const onBackPress = () => {
    navigation.replace('RootDrawer', {
      screen: 'AuthenticatedStack',
      params: {
        screen: 'ConsumerLanding',
      },
    });
  };

  return (
    <ImageBackground source={GradientBackground} style={styles.container}>
      <ThrottledOpacity style={styles.backButton} onPress={onBackPress}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </ThrottledOpacity>
      <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <Image source={serviceImage('logo')} resizeMode={'contain'} style={{height: 30}} />
        <Image
          source={serviceImage('image')}
          resizeMode={'contain'}
          style={{height: 255, width: 300, marginVertical: 25}}
        />
        <View style={{alignItems: 'center', marginHorizontal: 20}}>
          <Text
            style={{
              color: constants.COLOR.ORANGE,
              fontFamily: constants.FONT_FAMILY.BOLD,
              fontSize: constants.FONT_SIZE.XL + 1,
            }}>
            Katok ka ulit mamaya!
          </Text>
          <Text style={{fontSize: constants.FONT_SIZE.M, textAlign: 'center', marginTop: 8, marginHorizontal: 25}}>
            We are performing some maintenance to serve you better. We will be right back. Thank you.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SuperAppServiceMaintenance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  iconDimensions: {
    width: 10,
    height: 15,
  },
  backButton: {
    position: 'absolute',
    zIndex: 1,
    top: StatusBar.currentHeight + 23,
    left: 6,
    padding: 10,
  },
});
