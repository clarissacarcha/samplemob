const COLOR = {
  WHITE: '#FFFFFF', // View backgroundColor
  LIGHT: '#F7F7FA', // Form backgroundColor and item separator
  MEDIUM: '#D3D3D3', // Placeholder Color
  DARK: '#808080', // Text and Icons
  ALMOST_BLACK: '#525252',
  MEDIUM_DARK: '#F8F8F8',
  BLACK: '#222222', // Text and Icons
  YELLOW: '#FDBA1C',
  LIGHT_YELLOW: '#FFFCF4',
  ORANGE: '#F5841F',
  YELLOW_UNDERLAY: '#96641e', //TouchableHightlight underlayColor for YELLOW background
  WHITE_UNDERLAY: '#FDBA1C', //TouchableHightlight underlayColor for WHITE background
  TRANSPARENT_YELLOW: 'rgba(256,186,28, 0.15)',
  TRANSPARENT_ORANGE: 'rgba(245,132,31, 0.15)',
  RED: '#F93154',
  GREEN: '#198754',
  BACKGROUND_YELLOW: '#FBFAE3',
  GRAY: '#9E9E9E',
};

const FONT_FAMILY = {
  REGULAR: 'FiraSans-Regular',
  BOLD: 'FiraSans-Bold',
  Thin800: 'FiraSans-Thin-800',
};

const FONT_SIZE = {
  XS: 9,
  S: 11,
  M: 13,
  L: 15,
  XL: 17,
};

export const SIZE = {
  FORM_HEIGHT: 50,
  BORDER_RADIUS: 5,
};

const MARGIN = {
  XS: 4,
  S: 8,
  M: 16,
  L: 24,
  XL: 32,
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
  HIGH: {
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  },
  LOW: {
    latitudeDelta: 0.0032216430310114674,
    longitudeDelta: 0.002014003694029043,
  },
};

export default {
  COLOR,
  FONT_FAMILY,
  FONT_SIZE,
  SIZE,
  MARGIN,
  SHADOW,
  MAP_DELTA,
};
