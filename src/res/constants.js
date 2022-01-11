export const APP_VERSION = '1.29.1'; // Used for Version Check
export const APP_FLAVOR = 'C'; // C = Customer | D = Driver
export const ACCOUNT_TYPE = 1; // 1 = Customer | 2 = Driver
export const MAPS_API_KEY = 'AIzaSyDhlw6pbriuwr_Mb6KYkVlBar7KD1KTrOs';
// export const PROTOCOL = 'https';
// export const HOST_PORT = 'graphql.toktok.ph:2096';
// export const HOST_PORT = 'stg-graphql.toktok.ph:2096';

/* LOCAL PORTS */

// export const PROTOCOL = 'http';
// export const HOST_PORT = '192.168.1.3:3100'; // Myutini
// // export const HOST_PORT = '35.173.0.77:3088'; // Marketing Server

// export const TOKTOK_WALLET_PROTOCOL = 'http';
// export const TOKTOK_WALLET_PROTOCOL_HOST_PORT = '192.168.1.3:3200';

// export const TOKTOK_MALL_PROTOCOL = 'http';
// export const TOKTOK_MALL_PROTOCOL_HOST_PORT = '192.168.1.3:3300';

/* LOCAL PORTS */

// export const PROTOCOL = 'http';
// export const HOST_PORT = '192.168.0.102:3000'; // Myutini

export const PROTOCOL = 'https';
export const HOST_PORT = 'graphql.toktok.ph:2096'; // Test

// export const TOKTOK_FOOD_PROTOCOL = 'http';
// export const TOKTOK_FOOD_PROTOCOL_HOST_PORT = 'localhost:3002';

// export const PROTOCOL = 'https';
// export const HOST_PORT = 'graphql.toktok.ph:2096'; // Prod

// export const TOKTOK_WALLET_PROTOCOL = 'http';
// export const TOKTOK_WALLET_PROTOCOL_HOST_PORT = '192.168.0.103:3100';

export const COLORS = {
  YELLOW: '#FDBA1C',
  YELLOWTEXT: '#FFA700',
  ORANGE: '#F5841F',
  LIGHT: '#D3D3D3',
  MEDIUM: '#808080',
  DARK: '#222222',
  WHITE: '#FFFFFF',
  TRANSPARENT_YELLOW: 'rgba(256,186,28, 0.1)',
  TRANSPARENT_GRAY: 'rgba(204,204,204,0.2)',
  LIGHT_YELLOW: '#F9C344', //Use WHITE UNDERLAY from variables
};

export const FONTS = {
  LIGHT: 'Jost-Light',
  MEDIUM: 'Jost-Medium',
  SEMIBOLD: 'Jost-SemiBold',
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

export const SIZES = {
  XS: 9,
  S: 11,
  M: 13,
  L: 15,
  XL: 17,
};

// export const SIZES = {
//   XS: 10,
//   S: 12,
//   M: 14,
//   L: 16,
//   XL: 18,
// };

export const NUMBERS = {
  BORDER_RADIUS: 5,
  MARGIN_HORIZONTAL: 20,
  SHADOW: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export const BUTTON_HEIGHT = 50;
export const INPUT_HEIGHT = 50;

export const BUTTON_ORANGE = '#FDBA1C';

/**
 * LEGACY CONSTANTS
 */

export const COLOR = '#FDBA1C'; //YELLOW
export const COLOR_UNDERLAY = 'rgba(256,186,28, 0.1)';
export const ORANGE = '#F5841F';
export const DARK = '#222222';
export const MEDIUM = 'gray';
export const LIGHT = '#D3D3D3';
export const DIRTY_WHITE = 'rgba(204,204,204,0.2)';
export const FONT_COLOR = '#2E2D32';

// export const FONT_SIZE = 10;
// export const SIZES = 10;
export const FONT_SIZE_SMALL = 10;
export const FONT_SIZE_MEDIUM = 12;
export const FONT_SIZE_LARGE = 14;

export const FONT_FAMILY = 'Rubik-Regular';
export const FONT_STYLE = {
  fontSize: SIZES,
  fontFamily: FONT_FAMILY,
  color: FONT_COLOR,
};

export const FONT_DEFAULT = 'Jost';
export const FONT_REGULAR = `${FONT_DEFAULT}-Regular`;
export const FONT_MEDIUM = `${FONT_DEFAULT}-Medium`;
export const FONT_LIGHT = `${FONT_DEFAULT}-Light`;
export const FONT_BOLD = `${FONT_DEFAULT}-Bold`;
export const FONT_SEMIBOLD = `${FONT_DEFAULT}-SemiBold`;

export const MAP_DELTA = {
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

export const MAP_DELTA_LOW = {
  latitudeDelta: 0.0032216430310114674,
  longitudeDelta: 0.002014003694029043,
};
