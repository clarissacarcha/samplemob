import {Image} from 'react-native';

import AluminumImage from './Aluminum.png';
import MotorcycleImage from './Motorcycle.png';
import MpvImage from './MPV.png';
import SedanImage from './Sedan.png';
import VanImage from './Van.png';
import XUVImage from './XUV.png';

export default {
  Aluminum: Image.resolveAssetSource(AluminumImage).uri,
  Motorcycle: Image.resolveAssetSource(MotorcycleImage).uri,
  MPV: Image.resolveAssetSource(MpvImage).uri,
  Sedan: Image.resolveAssetSource(SedanImage).uri,
  Van: Image.resolveAssetSource(VanImage).uri,
  XUV: Image.resolveAssetSource(XUVImage).uri,
};
