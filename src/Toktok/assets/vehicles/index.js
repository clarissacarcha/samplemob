import {Image} from 'react-native';

import MotorcycleImage from './Motorcycle.png';

export default {
  Motorcycle: Image.resolveAssetSource(MotorcycleImage).uri,
};
