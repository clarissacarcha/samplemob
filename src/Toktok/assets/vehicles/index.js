import {Image} from 'react-native';

import MotorcycleImage from './Motorcycle.png';
import MpvImage from './MPV.png';
import SedanImage from './Sedan.png';
import TruckImage from './Truck.png';
import VanImage from './Van.png';

export default {
  Motorcycle: Image.resolveAssetSource(MotorcycleImage).uri,
  MPV: Image.resolveAssetSource(MpvImage).uri,
  Sedan: Image.resolveAssetSource(SedanImage).uri,
  Truck: Image.resolveAssetSource(TruckImage).uri,
  Van: Image.resolveAssetSource(VanImage).uri,
};
