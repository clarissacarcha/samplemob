import React from 'react';
import {
  ToktokMallCategoriesList,
  ToktokMallCategoriesSearch
} from '../../../ToktokMall/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokMallCategoriesList" component={ToktokMallCategoriesList} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallCategoriesSearch" component={ToktokMallCategoriesSearch} />
  </>
);
