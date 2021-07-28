export const APP_VERSION = '1.15.0';
export const APP_FLAVOR = 'C'; // C = Customer | D = Driver
export const ACCOUNT_TYPE = 1; // 1 = Customer | 2 = Driver
export const MAPS_API_KEY = 'AIzaSyDhlw6pbriuwr_Mb6KYkVlBar7KD1KTrOs';

export const COLOR = {
  WHITE: '#FFFFFF', // View backgroundColor
  LIGHT: '#F7F7FA', // Form backgroundColor and item separator
  MEDIUM: '#D3D3D3', // Placeholder Color
  DARK: '#808080', // Text and Icons
  BLACK: '#222222', // Text and Icons
  YELLOW: '#FDBA1C',
  ORANGE: '#F5841F',
  YELLOW_UNDERLAY: '#96641e', //TouchableHightlight underlayColor for YELLOW background
  WHITE_UNDERLAY: '#FDBA1C', //TouchableHightlight underlayColor for WHITE background
  TRANSPARENT_YELLOW: 'rgba(256,186,28, 0.15)',
  RED: '#F93154',
};

export const FONT = {
  REGULAR: 'FiraSans-Regular',
  BOLD: 'FiraSans-Bold',
};

export const FONT_SIZE = {
  XS: 9,
  S: 11,
  M: 13,
  L: 15,
  XL: 17,
};

export const SIZE = {
  BUTTON_HEIGHT: 50,
  FORM_HEIGHT: 50,
  BORDER_RADIUS: 5,
  MARGIN: 16,
};

export const MARGIN = {
  S: 8,
  M: 16,
  L: 24,
  XL: 32,
};

export const SHADOW = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

export const MAP_DELTA = {
  HIGH: {
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  },
  LOW: {
    latitudeDelta: 0.0032216430310114674,
    longitudeDelta: 0.002014003694029043,
  },
};
