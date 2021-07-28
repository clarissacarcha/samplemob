const ENV = 'LOCAL'; // LOCAL | DEV | TEST | DEMO | STAGING | PRODUCTION

const ENVIRONMENT_LIST = {
  LOCAL: {
    TOKTOK_SERVER: 'http://192.168.0.102:3000',
    TOKTOKWALLET_SERVER: 'http://192.168.0.102:3001',
    TOKTOKMALL_SERVER: 'http://192.168.0.102:3002',
    TOKTOKFOOD_SERVER: 'http://192.168.0.102:3002',
  },
  DEV: {
    TOKTOK_SERVER: 'https://dev.toktok.ph:2096',
    TOKTOKWALLET_SERVER: 'https://dev.toktok.ph:2087',
    TOKTOKMALL_SERVER: 'https://dev.toktok.ph:2083',
    TOKTOKFOOD_SERVER: 'https://dev.toktok.ph:2053',
  },
  TEST: {
    TOKTOK_SERVER: 'https://test.toktok.ph:2096',
    TOKTOKWALLET_SERVER: 'https://test.toktok.ph:2087',
    TOKTOKMALL_SERVER: 'https://test.toktok.ph:2083',
    TOKTOKFOOD_SERVER: 'https://test.toktok.ph:2053',
  },
  DEMO: {
    TOKTOK_SERVER: 'https://demo.toktok.ph:2096',
    TOKTOKWALLET_SERVER: 'https://demo.toktok.ph:2087',
    TOKTOKMALL_SERVER: 'https://demo.toktok.ph:2083',
    TOKTOKFOOD_SERVER: 'https://demo.toktok.ph:2053',
  },
};

export default ENVIRONMENT_LIST[ENV];