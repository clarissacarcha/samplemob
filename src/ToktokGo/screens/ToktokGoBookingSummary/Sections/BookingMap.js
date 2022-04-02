import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import PolylineUtility from '@mapbox/polyline';
import _ from 'lodash';

import CONSTANTS from '../../../../common/res/constants';
import LocationIcon from '../../../../assets/images/locationIcon.png';
import PinIcon from '../../../../assets/images/pinIcon.png';
import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';
import OfficeIcon from '../../../../assets/icons/office-address-icon.png';

const SAMPLE_LEGS = [
  {
    steps: [
      {
        polyline: {
          points: '}jvwAaauaVaJ`I',
        },
      },
      {
        polyline: {
          points: '_vvwA_wtaV_AoAi@m@wB_C}@_A}@y@oDsCe@i@c@o@_@o@Qa@Qg@',
        },
      },
      {
        polyline: {
          points: '{jwwA_nuaVcDjAcDlA[L',
        },
      },
      {
        polyline: {
          points: '_vwwAwhuaVq@}Bu@eDGUaA_EkAoEGUu@uCYkAK_@Ka@YiAg@}BEQAEAGgAoEGUCEAECECACAG?',
        },
      },
      {
        polyline: {
          points: 'cgxwA_xvaVEP?BEPMh@Sp@Qh@INOf@K\\oA`EIV?@u@|BeEjMEBCDCDCFGLe@j@Y\\YXc@V',
        },
      },
      {
        polyline: {
          points: 'wyxwAsquaVa@T[P\\^dApAlD~DJL',
        },
      },
      {
        polyline: {
          points: 'wrxwAkfuaVxBnCdDhEz@jA|BvCh@p@nA~AZ^b@f@RRFFNHPJ',
        },
      },
      {
        polyline: {
          points:
            'e|wwAaltaVfHzI|AlBdAvA`@h@V\\bAtAdA`BDDn@z@`@h@PTBDZd@j@dA@@DJHNHNZp@DHFNP^LVP`@FRHPN^JTDJN^LXRn@FRZbAFNFPRr@\\nA@@H^VhAPbAHb@RfAFT@F?D?@@F?J?L?BA^?N@NA`@JdATbCVbD?B@^BZ?B@^XbDHlAB`@Dn@HbA?d@?Z@\\Bj@JfBR~C@HBb@Dd@Bb@Dd@Dd@Bd@Dd@@RDr@BXL|BT|BRfC@VJ|ALbBBh@JzAA\\?Z?^?VAZGvACbACf@I~CAXCd@Ct@Al@Ab@?^?f@@nDB|@PxBFl@Hn@Fl@Hf@BRFb@F`@?@D\\PfALbAH~@',
        },
      },
      {
        polyline: {
          points: 'shvwAujnaVy@D}AJ{BL',
        },
      },
      {
        polyline: {
          points:
            'gqvwAuinaVaAFK@UJoF\\oAHe@DeBNOBaE`@kAJyBTQ@QBo@FwAPiCVwAPkCb@w@LgBXeC^KBeC\\a@FoHlAC@kBX?@yBXq@JWDYFMBYDMBE@WFWF}@P_B^_B\\eE|@KBm@JeH|A{AZ_@JqGpAi@Lq@Na@J_@NcBh@SH{HjC{Af@uBr@{@ZODgA\\QFiFfBSF[LWHkA`@_GnByAf@qBp@_Cx@s@TOF{@Xq@T_@LiA`@cDhAsAd@_@LmDnAk@R_C`AaA^s@ZKDQHs@XwCjAqAj@uAj@ID_@P[LkAh@q@Zy@^qAn@cBv@{@`@oAj@m@Xe@R}Ap@aBt@iAf@KFYNWNQHQHuCvAmDfBa@ReAf@mB`AYNoAj@w@\\g@P_@N_@NsAd@eAd@QHg@TiCrAeCnAwDnBULKD]Rg@XgAn@YN_@R]R]R]R}EfCKDKDOD[H',
        },
      },
      {
        polyline: {
          points:
            'ov`xAodjaVCCCCCAEACAEAE?C?I?I@G@GBGDEDEFCFEH?BAB?B?D?DUX_@`@]XULc@VsC|AeBbAMF[ROJe@X{@f@}@d@aCrBo@d@uC`BsEnCmAp@kB`Aq@^m@\\]Re@VoAr@e@X]TQNQPONOPSXOXKLINUh@IVi@dBk@fBKZKZSTm@~@WTSROHOHGDSFQFA?KBSBSDuAH_@@',
        },
      },
      {
        polyline: {
          points: '}`cxA{ihaVWD@b@^Ct@CP?PABAJATEJCXGPETIPGRGHEFGFERUJOJMHQP]',
        },
      },
      {
        polyline: {
          points: '}ubxAinhaVDAFCHGJKHMHOFO',
        },
      },
      {
        polyline: {
          points: '}sbxAqphaVL@J@JDJDBl@HdCHrCLzDDtALxCNbGJtCOZU^GHKHIDwBtAaAl@EFGJEJCL',
        },
      },
      {
        polyline: {
          points: 'kxbxAkcgaVYTc@ZA@QLC@QHA@A@A@',
        },
      },
    ],
  },
];

const SAMPLE_BOUNDS = {
  northeast: {
    latitude: 14.6026663,
    longitude: 121.0356804,
  },
  southwest: {
    latitude: 14.53722,
    longitude: 120.9551616,
  },
};

const decodeLegsPolyline = legs => {
  const decodedLegsPolyline = legs.map(leg => {
    return leg.steps.map(step => {
      const decodedStepPolyline = PolylineUtility.decode(step.polyline.points);

      return decodedStepPolyline.map(point => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
    });
  });

  return _.flattenDeep(decodedLegsPolyline);
};

const SAMPLE_POLYLINE = decodeLegsPolyline(SAMPLE_LEGS);

// console.log(JSON.stringify({polyline: decodeLegsPolyline(SAMPLE_LEGS)}, null, 2));

export const BookingMap = ({}) => {
  const mapRef = useRef();
  const INITIAL_REGION = {
    latitude: 11.22309004847093,
    latitudeDelta: 19.887065883877668,
    longitude: 121.97818368673325,
    longitudeDelta: 10.145791545510278,
  };

  const FROM = {
    latitude: 13.357554369495743,
    longitude: 123.71824264526369,
  };

  const TO = {
    latitude: 13.283971976125885,
    longitude: 123.67090702056886,
  };

  useEffect(() => {
    const {northeast, southwest} = SAMPLE_BOUNDS;
    const coordinates = [
      {
        ...northeast,
      },
      {
        ...southwest,
      },
    ];
    setTimeout(() => {
      mapRef.current.fitToCoordinates(
        coordinates,
        {
          edgePadding: {
            right: 20,
            bottom: 20,
            left: 20,
            top: 20,
          },
        },
        3000, // Animation duration in milliseconds.
      );
    }, 1000);
  }, []);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{height: '60%', width: '100%'}}
      initialRegion={INITIAL_REGION}>
      <Marker
        key={key => {
          1;
        }}
        coordinate={FROM}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.originLocation}>
            <View style={{flexDirection: 'row'}}>
              <Image source={OfficeIcon} resizeMode={'contain'} style={{height: 20, width: 15, marginRight: 5}} />
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S, color: CONSTANTS.COLOR.ORANGE}}>Office</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>Palawan Tabaco...</Text>
              <Image source={ArrowRightIcon} resizeMode={'contain'} style={{height: 10, width: 10}} />
            </View>
          </View>
          <Image source={LocationIcon} resizeMode={'contain'} style={{height: 26, width: 26}} />
        </View>
      </Marker>

      <Marker
        key={key => {
          2;
        }}
        coordinate={TO}>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <View style={styles.pinLocation}>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>Mayon Skyline...</Text>
            <Image source={ArrowRightIcon} resizeMode={'contain'} style={{height: 10, width: 10}} />
          </View>
          <Image source={PinIcon} resizeMode={'contain'} style={{height: 26, width: 26}} />
        </View>
      </Marker>

      <Polyline
        coordinates={SAMPLE_POLYLINE}
        strokeColor="#FF0000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeWidth={3}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  pinLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CONSTANTS.COLOR.WHITE,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  originLocation: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
});
