const FONT = {
  FAMILY: {
    REGULAR: 'FiraSans-Regular',
    BOLD: 'FiraSans-Bold',
  },
  SIZE: {
    XS: 9,
    S: 11,
    M: 13,
    L: 15,
    XL: 17,
  },
};

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const MAP_DELTA = {
  LOW: {
    latitudeDelta: 0.0032216430310114674,
    longitudeDelta: 0.002014003694029043,
  },
  HIGH: {
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  },
};

export default {
  FONT,
  SHADOW,
  MAP_DELTA,
};
